import Exercise from '#models/exercise'
import type { HttpContext } from '@adonisjs/core/http'

export default class ExercisesController {
  async render({ inertia, auth, request }: HttpContext) {
    await auth.use('web').check()
    const page = Number.parseInt(request.input('page') || '1')
    const limit = 16

    const exercises = await Exercise.query().orderBy('id', 'asc').paginate(page, limit)

    return inertia.render('exercise', { exercises })
  }

  async execute({ response, auth, params }: HttpContext) {
    const user = auth.user!
    const { exercise } = params

    console.log(exercise, user)
  }
}
