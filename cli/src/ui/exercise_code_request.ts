import type { Challenge as Exercise } from '../types.js'

export class LatestExerciseCodeRequest {
  private requestId = 0

  cancel(): void {
    this.requestId += 1
  }

  async load(
    exercise: Exercise,
    loadCode: (exercise: Exercise) => Promise<string>,
    applyCode: (code: string) => void,
    applyError: (error: unknown) => void = () => undefined
  ): Promise<boolean> {
    const currentRequestId = ++this.requestId
    let code: string
    try {
      code = await loadCode(exercise)
    } catch (error) {
      if (currentRequestId !== this.requestId) return false
      applyError(error)
      return true
    }
    if (currentRequestId !== this.requestId) return false

    applyCode(code)
    return true
  }
}
