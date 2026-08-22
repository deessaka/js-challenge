import env from '#start/env'

export class ExecutionCapacityError extends Error {
  readonly code = 'EXECUTION_CAPACITY_EXCEEDED'
  readonly retryAfterSeconds = 2

  constructor(readonly limit: number) {
    super("Beaucoup de personnes s'entraînent en ce moment ! Nos serveurs sont très sollicités, veuillez patienter quelques secondes avant de réessayer.")
    this.name = 'ExecutionCapacityError'
  }
}

export class ExecutionCapacityLimiter {
  private active = 0

  constructor(private readonly maxConcurrent: number) {
    if (!Number.isInteger(maxConcurrent) || maxConcurrent < 1) {
      throw new Error('La limite de concurrence doit être un entier positif.')
    }
  }

  get activeCount(): number {
    return this.active
  }

  get limit(): number {
    return this.maxConcurrent
  }

  canAccept(): boolean {
    return this.active < this.maxConcurrent
  }

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (!this.canAccept()) {
      throw new ExecutionCapacityError(this.maxConcurrent)
    }

    this.active += 1
    try {
      return await task()
    } finally {
      this.active -= 1
    }
  }
}

const configuredLimit = env.get('CODE_EXECUTION_CONCURRENCY', 2)

/**
 * Process-local guard for isolated-vm executions.
 * The default of two concurrent isolates is conservative for a 512 MB instance.
 */
const executionCapacity = new ExecutionCapacityLimiter(Math.max(1, Math.floor(configuredLimit)))

export default executionCapacity
