import UserProgressService from '#services/user_progress'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor(private userProgressService: UserProgressService) { }

  async landing({ inertia, auth }: HttpContext) {
    try {
      if (auth.use('web').isAuthenticated) {
        return inertia.location('/home')
      }
      return inertia.render('landing', {})
    } catch (error) {
      console.error('Error in landing:', error)
      return inertia.render('landing', { error: 'Une erreur est survenue' })
    }
  }

  async about({ inertia }: HttpContext) {
    return inertia.render('about', {})
  }

  async render({ inertia, request, auth }: HttpContext) {
    try {
      const user = auth.use('web').user
      if (!user) {
        console.log('No user found, redirecting to /')
        return inertia.location('/')
      }

      // Log avant la récupération des données
      console.log('Fetching data for user:', user.id)

      const page = request.input('page', '1')

      try {
        const [progressExercises, users] = await Promise.all([
          this.userProgressService.renderExercisesWithProgress(page, user),
          this.userProgressService.getUsersWithStats(),
        ])

        // Log des données récupérées
        console.log('Data fetched successfully:', {
          progressExercisesCount: progressExercises?.exercises?.length,
          usersCount: users?.length,
        })

        return inertia.render('home', {
          progressExercises,
          users,
          user: {
            ...user,
            avatarUrl: user.avatar || null,
          },
        })
      } catch (dbError) {
        console.error('Database operation failed:', dbError)
        throw dbError
      }
    } catch (error) {
      console.error('Error in home render:', error)

      return inertia.render('home', {
        error: 'Une erreur est survenue lors du chargement des données',
        progressExercises: {
          exercises: [],
          total: 0,
          currentPage: 1,
          lastPage: 1,
        },
        users: [],
        user: auth.use('web').user, // Gardez l'utilisateur même en cas d'erreur
      })
    }
  }
}
