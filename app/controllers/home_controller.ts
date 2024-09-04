import UserProgressService from '#services/user_progress'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor(private userProgressService: UserProgressService) {}
  async render({ inertia, auth, request }: HttpContext) {
    const user = auth.user!
    const page = request.input('page') || '1'
    const progressExercises = await this.userProgressService.renderExercisesWithProgress(page)

    return inertia.render('home', { progressExercises })
  }
}
