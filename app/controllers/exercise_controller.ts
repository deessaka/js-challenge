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

  async render({ auth, params, inertia }: HttpContext) {
    await auth.use('web').check()
    const user = auth.user!
    const exercise = await this.exerciceService
      .getExerciseWithSolution(params.exerciseId, user.id)
      .catch((err) => console.log('ERROR IN GET EXERCISE WITH SOLUTION', err))
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
        logger.info('TEST RESULTS', { success: true, results: result.results })
        return response.status(200).json({ success: true, results: result.results })
      })
      .onTestFailed((error: any) => {
        logger.error('test failed', error)
        return response.status(200).json({ success: false, results: error.results })
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

      return response.notFound('No saved progress found')
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
