import ivm from 'isolated-vm'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const ANSI_RESET = '\x1b[0m'
const ANSI_RED = '\x1b[31m'
const ANSI_GREEN = '\x1b[32m'
const ANSI_YELLOW = '\x1b[33m'

export default class IsolatedTestRunner {
  private isolate: ivm.Isolate
  private runHandler: (result: any) => void = () => {}
  private runErrorHandler: (result: any) => void = () => {}

  constructor(
    private exerciseId: string,
    private code: Record<string, any>
  ) {
    this.isolate = new ivm.Isolate({ memoryLimit: 128 })
  }

  async exec() {
    try {
      const result = await this.run(this.exerciseId, this.code)
      this.printColoredResults(result)
      if (!result.success) {
        return this.runHandler(result)
      }
      return this.runErrorHandler(result)
    } catch (error) {
      this.printColoredResults(error)
      console.error(`${ANSI_RED}Error executing tests:${ANSI_RESET}`, error)
      throw error
    }
  }

  onRun(handler: (result: any) => void) {
    this.runHandler = handler
    return this
  }

  onRunError(handler: (error: Error) => void) {
    this.runErrorHandler = handler
    return this
  }

  private async run(exerciseId: string, code: Record<string, any>) {
    const context = await this.isolate.createContext()
    const jail = context.global

    jail.setSync('global', jail.derefInto())

    jail.setSync('log', new ivm.Reference((...args: any[]) => console.log(...args)))

    const testFilePath = path.join(
      process.cwd(),
      'tests',
      'exercises',
      `Exercice${exerciseId}.test.js`
    )
    const testFileContent = await fs.readFile(testFilePath, 'utf-8')

    const fullCode = `
    ${this.injectUserCode(code.code)}
    ${this.createJestMock()}
    ${testFileContent}
    runTests();
    `

    try {
      const script = await this.isolate.compileScript(fullCode)
      const result = await script.run(context)
      const { success, results } = this.parseResults(result.toString())
      return { success, results }
    } catch (err) {
      throw new Error(
        JSON.stringify({
          type: err.name,
          message: err.message,
          stack: err.stack,
          status: 500,
        })
      )
    } finally {
      context.release()
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

  private parseResults(results: string) {
    const parsedResults = JSON.parse(results)
    const success = parsedResults.every((result: any) => result.passed)
    return { success, results: parsedResults }
  }

  private printColoredResults(result: { success: boolean; results: any[] }) {
    console.log(`${ANSI_YELLOW}Test Results:${ANSI_RESET}`)
    result.results.forEach((testResult: any) => {
      if (testResult.passed) {
        console.log(`${ANSI_GREEN}PASS${ANSI_RESET} - ${testResult.description}`)
      } else {
        console.log(`${ANSI_RED}FAIL${ANSI_RESET} - ${testResult.description}`)
        if (testResult.error) {
          console.log(`  ${ANSI_RED}Error: ${testResult.error}${ANSI_RESET}`)
        }
      }
    })
    console.log(
      `\nOverall Result: ${result.success ? `${ANSI_GREEN}PASS${ANSI_RESET}` : `${ANSI_RED}FAIL${ANSI_RESET}`}`
    )
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
