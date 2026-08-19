import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { portalDestination } from '#services/portal_destination_service'

/**
 * Guest middleware is used to redirect authenticated users to the home page.
 */
export default class GuestMiddleware {
  /**
   * The URL to redirect to when the user is already authenticated
   */
  async handle(ctx: HttpContext, next: NextFn) {
    const guard = ctx.auth.use('web')
    if (guard.isAuthenticated && guard.user) {
      return ctx.response.redirect(portalDestination(guard.user))
    }
    return next()
  }
}
