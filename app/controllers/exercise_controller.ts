import ExerciseServices from '#services/exercise_services'
import IsolatedTestRunner from '#services/test_runner_service'
import UserProgressService from '#services/user_progress'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

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
      .catch((err) => console.log(err))
    return inertia.render('exercise', { exercise })
  }

  async execute({ request, response, auth, params, logger }: HttpContext) {
    const { exerciseId } = params
    const code: Record<string, string> = request.all()
    const user = auth.user!

    try {
      const runner = new IsolatedTestRunner(exerciseId, code)
        .onRun(async (result: any) => {
          const { success, results } = result
          if (success) {
            await this.exerciceService.saveSolution(user.id, exerciseId, code)
            await this.userProgressService.completeExercise(user, exerciseId)
            logger.info('TEST RESULTS', { success, results })
            return response.status(200).json({ success, results })
          }
          logger.error('TEST RESULTS', { success, results })
          return response.status(200).json({ success, results })
        })
        .onRunError((error: any) => {
          logger.error('test failed', error.results)
          return response
            .status(500)
            .json({ success: false, error: "Une erreur inattendue s'est produite" })
        })

      await runner.exec()
    } catch (error) {
      // Gérez les erreurs imprévues ici
      console.error('Erreur inattendue :', error)
      response.status(500).json({ success: false, error: "Une erreur inattendue s'est produite" })
    }
  }

  async loadProcess({ params, auth, response }: HttpContext) {
    const { exerciseId } = params
    const userid = auth.user!.id
    const cacheKey = `exercise:${exerciseId}:user:${userid}`
    const cachedData = await redis.get(cacheKey)

    if (cachedData) {
      const { code, timestamp } = JSON.parse(cachedData)
      return response.json({ code, timestamp })
    }

    return response.notFound('No saved progress found')
  }

  async saveProgress({ request, params, response, auth }: HttpContext) {
    const { exerciseId } = params
    const userId = auth.user!.id // Assurez-vous que l'utilisateur est authentifié
    const { code } = request.only(['code'])
    const timestamp = Date.now()

    const cacheKey = `exercise:${exerciseId}:user:${userId}`
    await redis.set(cacheKey, JSON.stringify({ code, timestamp }), 'EX', 60 * 60 * 24 * 7) // Expire après 7 jours

    return response.json({ success: true, timestamp })
  }
}
