import Exercise from '#models/exercise'
import UserProgress from '#models/user_progress'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class UserLocationMiddleware {
  async handle({ request, response, auth, params }: HttpContext, next: NextFn) {
    if (auth.use('web').isAuthenticated) {
      const user = auth.user!
      const { exerciseId } = params
      const exercise = await Exercise.findOrFail(exerciseId)

      const userProgress = await UserProgress.query()
        .where('user_id', user.id)
        .where('exercise_id', exercise.id)
        .first()

      if (userProgress && userProgress.isUnlocked) {
        return await next()
      }
      return response.redirect().toRoute('home')
    }
    return await next()
  }
}
