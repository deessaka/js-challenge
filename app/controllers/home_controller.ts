import UserProgressService from '#services/user_progress'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor(private userProgressService: UserProgressService) {}

  async landing({ inertia, auth }: HttpContext) {
    try {
      if (auth.use('web').isAuthenticated) {
        return inertia.location('/home')
      }
      return inertia.render('landing')
    } catch (error) {
      console.error('Error in landing:', error)
      return inertia.render('landing', { error: 'Une erreur est survenue' })
    }
  }

  async about({ inertia }: HttpContext) {
    return inertia.render('about')
  }

  async render({ inertia, request, auth }: HttpContext) {
    try {
      const user = auth.use('web').user
      if (!user) {
        return inertia.location('/')
      }

      const page = request.input('page', '1')
      const [progressExercises, users] = await Promise.all([
        this.userProgressService.renderExercisesWithProgress(page, user),
        this.userProgressService.getUsersWithStats()
      ])

      return inertia.render('home', { 
        progressExercises, 
        users,
        user: {
          ...user,
          avatarUrl: user.avatar || null
        }
      })
    } catch (error) {
      console.error('Error in home render:', error)
      return inertia.render('home', { 
        progressExercises: [], 
        users: [],
        user: auth.use('web').user,
        error: 'Une erreur est survenue lors du chargement des données'
      })
    }
  }
}
