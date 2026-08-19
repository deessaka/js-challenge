import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { PORTAL_INTENDED_KEY } from '#services/portal_destination_service'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/auth/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    } catch (error) {
      if ((!options.guards || options.guards.includes('web')) && ctx.request.method() === 'GET') {
        ctx.session.put(PORTAL_INTENDED_KEY, ctx.request.url(true))
      }
      throw error
    }

    if (ctx.auth.user?.status === 'suspended') {
      if (options.guards?.includes('api')) {
        return ctx.response.unauthorized({ error: 'Ce compte est suspendu.' })
      }
      await ctx.auth.use('web').logout()
      ctx.session.flash('error', 'Votre compte est temporairement suspendu.')
      return ctx.response.redirect(this.redirectTo)
    }

    return next()
  }
}
