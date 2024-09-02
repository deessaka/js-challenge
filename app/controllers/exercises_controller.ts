import type { HttpContext } from '@adonisjs/core/http'

export default class ExercisesController {
  async render({ inertia, params, auth }: HttpContext) {
    await auth.use('web').check()
    return inertia.render('exercise')
  }

  async execute({ request, response }: HttpContext) {}
}
