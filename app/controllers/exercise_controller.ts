import ExerciseServices from '#services/exercise_services'
import IsolatedTestRunner from '#services/test_runner_service'
import UserProgressService from '#services/user_progress'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

@inject()
export default class ExerciseController {
  constructor(
    private exerciceService: ExerciseServices,
    private userProgressService: UserProgressService
  ) {}

  async render({ auth, params, inertia, logger, response }: HttpContext) {
    await auth.use('web').check()
    const user = auth.user!

    // CRITICAL-05: propagate the error instead of swallowing it and rendering
    // an undefined exercise, which crashes the frontend.
    let exercise
    try {
      exercise = await this.exerciceService.getExerciseWithSolution(params.exerciseId, user.id)
    } catch (err) {
      logger.error({ err }, 'Failed to load exercise with solution')
      return response.redirect().toRoute('home')
    }

    return inertia.render('exercise', { exercise })
  }

  async execute({ request, response, auth, params, logger }: HttpContext) {
    const { exerciseId } = params
    const code: Record<string, string> = request.all()
    const user = auth.user!

    await new IsolatedTestRunner(exerciseId, code)
      .onTestPassed(async (result: any) => {
        await this.exerciceService.saveSolution(user.id, exerciseId, code)
        await this.userProgressService.completeExercise(user, exerciseId)
        logger.info({ results: result.results }, 'Test passed')
        return response.status(200).json({ success: true, results: result.results })
      })
      .onTestFailed((error: any) => {
        // CRITICAL-05: error is an Error whose .message holds a JSON-stringified
        // object from the sandbox catch block. Unpack it to surface the actual
        // test results (or a descriptive runtime error) to the client.
        let results: unknown[] = []
        if (error && error.results) {
          results = error.results
        } else if (error?.message) {
          try {
            const parsed = JSON.parse(error.message)
            results = [{ description: 'Runtime error', passed: false, error: parsed.message }]
          } catch {
            results = [
              { description: 'Runtime error', passed: false, error: String(error.message) },
            ]
          }
        }
        logger.error({ error: error?.message }, 'Test failed')
        return response.status(200).json({ success: false, results })
      })
      .exec()
  }

  async loadProcess({ params, auth, response }: HttpContext) {
    try {
      const { exerciseId } = params
      const userid = auth.user!.id
      const exercise = await this.exerciceService.getExerciseWithSolution(exerciseId, userid)

      if (exercise && exercise.code) {
        return response.json({ code: exercise.code, timestamp: DateTime.now().toMillis() })
      }

      return response.status(204).json({ message: 'Exercise not found.' })
    } catch (error) {
      console.error('Error in loadProgress method:', error)
      return response.status(500).json({ message: 'An error occurred while loading progress.' })
    }
  }

  async saveProgress({ request, params, response, auth }: HttpContext) {
    try {
      const { exerciseId } = params
      const userId = auth.user!.id
      const { code } = request.only(['code'])

      await this.exerciceService.saveSolution(userId, exerciseId, code)

      return response.status(200).json({ success: true, timestamp: DateTime.now().toMillis() })
    } catch (error) {
      console.error('Error in saveProgress method:', error)
      return response
        .status(500)
        .json({ success: false, message: 'An error occurred while saving progress.' })
    }
  }
}
