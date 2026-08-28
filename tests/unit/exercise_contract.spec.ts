import { test } from '@japa/runner'

import {
  compileExerciseContract,
  hashExerciseContract,
  validateExerciseContract,
} from '#services/exercise_contract_service'
import IsolatedTestRunner from '#services/test_runner_service'

const countSheepsContract = {
  metadata: {
    title: 'Nombre de moutons',
    description: 'Compter les valeurs strictement égales à true.',
    difficulty: 8,
    category: 'JavaScript',
    points: 10,
  },
  instruction: 'Comptez les moutons présents dans le tableau.',
  entry: {
    kind: 'function',
    name: 'countSheeps',
    parameters: [{ type: 'array', items: 'unknown' }],
    returns: 'number',
  },
  behavior: {
    kind: 'count',
    where: { operator: 'strictEquals', value: true },
  },
  examples: [
    {
      description: 'ignore les valeurs qui ne sont pas true',
      input: [[true, false, null, 'true', undefined]],
      output: 1,
    },
  ],
  edgeCases: [{ description: 'tableau vide', input: [[]], output: 0 }],
  caseGenerator: {
    kind: 'arrayValues',
    seed: 42,
    count: 4,
    minLength: 2,
    maxLength: 5,
    values: [true, false, null, 'true'],
  },
}

test.group('Exercise contracts', () => {
  async function run(code: string) {
    const compiled = compileExerciseContract(countSheepsContract)
    return new Promise<{ success: boolean; results: Array<{ passed: boolean }> }>(
      (resolve, reject) => {
        new IsolatedTestRunner('2', { code }, compiled)
          .onTestPassed((result) => resolve(result))
          .onTestFailed((result) => resolve(result))
          .exec()
          .catch(reject)
      }
    )
  }

  test('compiles the count DSL without accepting test JavaScript', ({ assert }) => {
    const compiled = compileExerciseContract(countSheepsContract)

    assert.include(compiled.starterCode, 'function countSheeps(')
    assert.include(compiled.testSource, 'countSheeps')
    assert.include(compiled.testSource, 'void 0')
    assert.notInclude(compiled.testSource, 'describe("injected"')
    assert.equal(compiled.generatedCases.length, 4)
    assert.deepEqual(compiled.evaluateReference([[true, false, 'true']]), 1)
  })

  test('generates reproducible cases from the contract seed', ({ assert }) => {
    const first = compileExerciseContract(countSheepsContract)
    const second = compileExerciseContract(countSheepsContract)

    assert.deepEqual(first.generatedCases, second.generatedCases)
    assert.equal(hashExerciseContract(countSheepsContract), hashExerciseContract(second.definition))
  })

  test('rejects an invalid entry point and unknown operators before publication', ({ assert }) => {
    const invalidEntry = validateExerciseContract({
      ...countSheepsContract,
      entry: { ...countSheepsContract.entry, name: 'not-valid;globalThis.pwned=true' },
    })
    const invalidOperator = validateExerciseContract({
      ...countSheepsContract,
      behavior: {
        kind: 'count',
        where: { operator: 'executeJavascript', value: true },
      },
    })

    assert.isFalse(invalidEntry.valid)
    assert.isFalse(invalidOperator.valid)
    assert.isTrue(invalidOperator.errors.some((error) => error.includes('opérateur')))
  })

  test('requires examples to agree with the declarative reference', ({ assert }) => {
    const result = validateExerciseContract({
      ...countSheepsContract,
      examples: [{ input: [[true]], output: 99 }],
    })

    assert.isFalse(result.valid)
    assert.isTrue(result.errors.some((error) => error.includes('example')))
  })

  test('does not enable an unregistered custom evaluator from database data', ({ assert }) => {
    const result = validateExerciseContract({
      ...countSheepsContract,
      behavior: undefined,
      evaluation: { kind: 'custom', id: 'vector-algebra', version: 2 },
    })

    assert.isFalse(result.valid)
    assert.isTrue(result.errors.some((error) => error.includes('custom')))
  })

  test('evaluates a submission against the generated contract cases', async ({ assert }) => {
    const passed = await run(
      'function countSheeps(values) { return values.filter((value) => value === true).length }'
    )
    const failed = await run('function countSheeps(values) { return values.length }')

    assert.isTrue(passed.success)
    assert.isFalse(failed.success)
  })
})
