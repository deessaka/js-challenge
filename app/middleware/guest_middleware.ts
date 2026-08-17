import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Guest middleware is used to redirect authenticated users to the home page.
 */
export default class GuestMiddleware {
  /**
   * The URL to redirect to when the user is already authenticated
   */
  redirectTo = '/home'

  async handle(ctx: HttpContext, next: NextFn) {
    if (ctx.auth.use('web').isAuthenticated) {
      return ctx.response.redirect(this.redirectTo)
    }
    return next()
  }
}
