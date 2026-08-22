import { test } from '@japa/runner'

import { ExecutionCapacityError, ExecutionCapacityLimiter } from '#services/execution_capacity'

test.group('Execution capacity limiter', () => {
  test('rejects work above the configured concurrency and releases capacity', async ({
    assert,
  }) => {
    const limiter = new ExecutionCapacityLimiter(1)
    let release!: () => void

    const running = limiter.run(
      () =>
        new Promise<void>((resolve) => {
          release = resolve
        })
    )

    await new Promise<void>((resolve) => setImmediate(resolve))
    assert.equal(limiter.activeCount, 1)

    let capacityError: unknown
    try {
      await limiter.run(async () => undefined)
    } catch (error) {
      capacityError = error
    }

    assert.instanceOf(capacityError, ExecutionCapacityError)
    release()
    await running
    assert.equal(limiter.activeCount, 0)
  })

  test('releases capacity when the task fails', async ({ assert }) => {
    const limiter = new ExecutionCapacityLimiter(1)

    try {
      await limiter.run(async () => {
        throw new Error('execution failed')
      })
    } catch (error) {
      assert.equal((error as Error).message, 'execution failed')
    }

    assert.equal(limiter.activeCount, 0)
  })
})
