import type { HttpContext } from '@adonisjs/core/http'
import { portalDestination } from '#services/portal_destination_service'

export default class HomeController {
  async landing({ inertia }: HttpContext) {
    try {
      return inertia.render('landing', {})
    } catch (error) {
      console.error('Error in landing:', error)
      return inertia.render('landing', { error: 'Une erreur est survenue' })
    }
  }

  async about({ inertia }: HttpContext) {
    return inertia.render('about', {})
  }

  async render({ auth, response }: HttpContext) {
    const user = auth.use('web').user!
    return response.redirect().toPath(portalDestination(user))
  }
}
