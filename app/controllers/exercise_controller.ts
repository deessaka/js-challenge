import { ExerciseDto } from '#dto/exercice_dto'
import Exercise from '#models/exercise'
import IsolatedTestRunner from '#services/test_runner_service'
import { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import { s } from 'node_modules/vite/dist/node/types.d-aGj9QkWt.js'

export default class ExerciseController {
  async render({ auth, params, inertia }: HttpContext) {
    await auth.use('web').check()
    const exercise = await Exercise.findOrFail(params.exerciseId)
    return inertia.render('exercise', { exercise: new ExerciseDto(exercise).toJSON() })
  }

  async execute({ request, response, auth, params }: HttpContext) {
    const { exerciseId } = params
    const code = request.all()

    try {
      const runner = new IsolatedTestRunner(exerciseId, code)
        .onRun((result: any) => {
          const { success, results } = result
          if (success) {
            console.log('test passed', results)
          } else {
            console.log('test failed', results)
          }
        })
        .onRunError((error: any) => {
          console.log('test failed', error.results)
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
