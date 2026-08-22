import ExerciseServices from '#services/exercise_services'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import SubmissionService from '#services/submission_service'
import { ExecutionCapacityError } from '#services/execution_capacity'

@inject()
export default class ExerciseController {
  constructor(
    private exerciceService: ExerciseServices,
    private submissionService: SubmissionService
  ) {}

  async render({ response }: HttpContext) {
    return response.redirect().toPath('/profile#api-token')
  }

  async execute({ request, response, auth, params, logger }: HttpContext) {
    const { exerciseId } = params
    const { code } = request.only(['code'])
    const user = auth.user!
    response.header('Deprecation', 'true')
    try {
      const submission = await this.submissionService.createAndExecute(user, {
        challengeId: exerciseId,
        code: String(code || ''),
        language: 'javascript',
        client: 'web',
      })
      logger.info({ submissionId: submission.id }, 'Legacy web submission executed')
      return response.status(200).json({
        success: submission.accepted === true,
        results: submission.results || [],
        consoleLogs: submission.consoleLogs || [],
      })
    } catch (error) {
      if (error instanceof ExecutionCapacityError) {
        return response.status(429).header('Retry-After', String(error.retryAfterSeconds)).json({
          code: error.code,
          error: error.message,
          retryAfter: error.retryAfterSeconds,
        })
      }
      throw error
    }
  }

  async loadProcess({ params, auth, response }: HttpContext) {
    try {
      response.header('Deprecation', 'true')
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
      response.header('Deprecation', 'true')
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
