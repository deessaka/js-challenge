import UserProgressService from '#services/user_progress'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor(private userProgressService: UserProgressService) {}

  async landing({ inertia, auth }: HttpContext) {
    // Si l'utilisateur est connecté, rediriger vers /home
    if (auth.use('web').isAuthenticated) {
      return inertia.location('/home')
    }
    return inertia.render('landing')
  }

  async about({ inertia }: HttpContext) {
    return inertia.render('about')
  }

  async render({ inertia, request, auth }: HttpContext) {
    const user = auth.use('web').user!
    const page = request.input('page') || '1'
    const progressExercises = await this.userProgressService.renderExercisesWithProgress(page, user)
    const users = await this.userProgressService.getUsersWithStats()
    return inertia.render('home', { progressExercises, users })
  }
}
