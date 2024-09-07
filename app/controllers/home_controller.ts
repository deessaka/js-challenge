import UserProgressService from '#services/user_progress'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor(private userProgressService: UserProgressService) {}
  async render({ inertia, request, auth }: HttpContext) {
    const user = auth.use('web').user!
    const page = request.input('page') || '1'
    const progressExercises = await this.userProgressService.renderExercisesWithProgress(page, user)
    return inertia.render('home', { progressExercises })
  }
}
