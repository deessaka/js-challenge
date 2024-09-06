import { ExerciseDto } from '#dto/exercice_dto'
import Exercise from '#models/exercise'
import { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class ExerciseController {
  async render({ auth, params, inertia }: HttpContext) {
    const exercise = await Exercise.findOrFail(params.exercise)
    return inertia.render('exercise', { exercise: new ExerciseDto(exercise).toJSON() })
  }

  async execute({ request, response, auth, params }: HttpContext) {}

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
