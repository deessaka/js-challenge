import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { PORTAL_INTENDED_KEY, portalDestination } from '#services/portal_destination_service'

export default class AdminMiddleware {
  redirectTo = '/auth/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    } catch (error) {
      if (ctx.request.method() === 'GET') {
        ctx.session.put(PORTAL_INTENDED_KEY, ctx.request.url(true))
      }
      throw error
    }

    const user = ctx.auth.user
    if (!user || user.status === 'suspended' || !['admin', 'super_admin'].includes(user.role)) {
      return ctx.response.redirect(user ? portalDestination(user) : this.redirectTo)
    }

    return next()
  }
}
