import type { Challenge as Exercise } from '../types.js'

export class LatestExerciseCodeRequest {
  private requestId = 0

  cancel(): void {
    this.requestId += 1
  }

  async load<Value>(
    exercise: Exercise,
    loadValue: (exercise: Exercise) => Promise<Value>,
    applyValue: (value: Value) => void,
    applyError: (error: unknown) => void = () => undefined
  ): Promise<boolean> {
    const currentRequestId = ++this.requestId
    let value: Value
    try {
      value = await loadValue(exercise)
    } catch (error) {
      if (currentRequestId !== this.requestId) return false
      applyError(error)
      return true
    }
    if (currentRequestId !== this.requestId) return false

    applyValue(value)
    return true
  }
}
