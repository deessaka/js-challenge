import ivm from 'isolated-vm'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import type { CompiledExerciseContract } from '#services/exercise_contract_service'

/** Maximum time (ms) a user script is allowed to run before being killed. */
const EXECUTION_TIMEOUT_MS = 5_000
const MAX_LOG_LINES = 100
const MAX_LOG_LENGTH = 500

export class ExerciseInvalidError extends Error {
  readonly code = 'EXERCISE_INVALID'

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'ExerciseInvalidError'
  }
}

export class SystemFailureError extends Error {
  readonly code = 'SYSTEM_FAILURE'

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'SystemFailureError'
  }
}

export default class IsolatedTestRunner {
  private isolate: ivm.Isolate
  private runTestPassed: any
  private runTestFailed: any

  constructor(
    private exerciseId: string,
    private code: Record<string, any>,
    private contract?: CompiledExerciseContract
  ) {
    this.isolate = new ivm.Isolate({ memoryLimit: 128 })
  }

  async exec() {
    const result = await this.run(this.exerciseId, this.code)
    if (result.success) {
      await this.runTestPassed(result)
    } else {
      await this.runTestFailed(result)
    }
  }

  onTestPassed(handler: (result: any) => void) {
    this.runTestPassed = handler
    return this
  }

  onTestFailed(handler: (error: any) => void) {
    this.runTestFailed = handler
    return this
  }

  private async run(exerciseId: string, code: Record<string, any>) {
    let context: ivm.Context
    try {
      context = await this.isolate.createContext()
    } catch (error) {
      throw new SystemFailureError('La sandbox d’exécution est indisponible.', { cause: error })
    }
    const jail = context.global

    jail.setSync('global', jail.derefInto())

    const consoleLogs: string[] = []
    jail.setSync(
      '__hostLog',
      new ivm.Reference((...args: any[]) => {
        if (consoleLogs.length >= MAX_LOG_LINES) return
        consoleLogs.push(this.formatLogArgs(args).slice(0, MAX_LOG_LENGTH))
      })
    )

    let fullCode: string
    if (code.dryRun) {
      fullCode = `
      ${this.createJestMock()}
      ${this.injectUserCode(code.code)}
      runTests();
      `
    } else if (this.contract) {
      fullCode = `
      ${this.createJestMock()}
      ${this.injectUserCode(code.code)}
      ${this.contract.testSource}
      runTests();
      `
    } else {
      const testFilePath = path.join(
        process.cwd(),
        'tests',
        'exercises',
        `Exercice${exerciseId}.test.js`
      )
      let testFileContent: string
      try {
        testFileContent = await fs.readFile(testFilePath, 'utf-8')
      } catch (error) {
        context.release()
        if (!this.isolate.isDisposed) this.isolate.dispose()
        throw new ExerciseInvalidError(
          `Le test de l’exercice #${exerciseId} est introuvable ou illisible.`,
          { cause: error }
        )
      }
      fullCode = `
      ${this.createJestMock()}
      ${this.injectUserCode(code.code)}
      ${testFileContent}
      runTests();
      `
    }

    try {
      const script = await this.isolate.compileScript(fullCode)
      // CRITICAL-01: enforce a hard execution timeout to prevent infinite loops
      // from hanging the Node.js event loop and taking down the server.
      const result = await script.run(context, { timeout: EXECUTION_TIMEOUT_MS })
      let parsed: { success: boolean; results: any[] }
      try {
        parsed = this.parseResults(result.toString())
      } catch (error) {
        throw new ExerciseInvalidError('Le résultat du test d’exercice est invalide.', {
          cause: error,
        })
      }
      const { success, results } = parsed
      return { success, results, consoleLogs }
    } catch (err) {
      if (err instanceof ExerciseInvalidError || err instanceof SystemFailureError) throw err
      throw new Error(
        JSON.stringify({
          type: err.name,
          message: err.message,
          stack: err.stack,
          status: 500,
          consoleLogs,
        })
      )
    } finally {
      // CRITICAL-02: always release context and dispose the isolate to prevent
      // 128MB V8 heap leaks accumulating per request.
      context.release()
      if (!this.isolate.isDisposed) {
        this.isolate.dispose()
      }
    }
  }

  private injectUserCode(code: string) {
    // Assurons-nous que le code de l'utilisateur est enveloppé dans une fonction nommée 'userSolution'
    return `
      ${code}
    `
  }

  private createJestMock() {
    return `
      const testResults = [];
      const print = (...args) => __hostLog.applySync(undefined, args);
      global.log = print;
      global.console = { log: print, info: print, warn: print, error: print };
      global.describe = (desc, fn) => fn();
      global.it = (desc, fn) => {
        try {
          fn();
          testResults.push({ description: desc, passed: true });
        } catch (error) {
          testResults.push({ description: desc, passed: false, error: error.message });
        }
      };
      global.expect = (actual) => ({
        toBe: (expected) => {
          if (actual !== expected) {
            throw new Error(\`Expected \${expected}, but got \${actual}\`);
          }
        },
        toEqual: (expected) => {
          if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(\`Expected \${JSON.stringify(expected)}, but got \${JSON.stringify(actual)}\`);
          }
        },
        toBeTruthy: () => {
          if (!actual) {
            throw new Error('Expected value to be truthy');
          }
        },
        toBeFalsy: () => {
          if (actual) {
            throw new Error('Expected value to be falsy');
          }
        },
        toBeNull: () => {
          if (actual !== null) {
            throw new Error('Expected value to be null');
          }
        },
        toBeUndefined: () => {
          if (actual !== undefined) {
            throw new Error('Expected value to be undefined');
          }
        },
        // Add other matchers as needed
      });

      function runTests() {
        return JSON.stringify(testResults);
      }
    `
  }

  private formatLogArgs(args: any[]): string {
    return args
      .map((value) => {
        if (typeof value === 'string') return value
        if (value === undefined) return 'undefined'
        if (value === null) return 'null'
        try {
          const serialized = JSON.stringify(value)
          return serialized === undefined ? String(value) : serialized
        } catch {
          return String(value)
        }
      })
      .join(' ')
  }

  private parseResults(results: string) {
    const parsedResults = JSON.parse(results)
    const success = parsedResults.every((result: any) => result.passed)
    return { success, results: parsedResults }
  }

  then(resolve: (value: any) => void, reject?: (reason: any) => void): Promise<any> {
    return this.exec().then(resolve, reject)
  }

  catch(reject: (reason: any) => void): Promise<any> {
    return this.exec().catch(reject)
  }

  finally(onfinally?: (() => void) | undefined): Promise<any> {
    return this.exec().finally(onfinally)
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }
}
