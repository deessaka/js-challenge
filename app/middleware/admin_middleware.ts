import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

export default class AdminMiddleware {
  redirectTo = '/auth/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })

    const user = ctx.auth.user
    if (!user || user.status === 'suspended' || !['admin', 'super_admin'].includes(user.role)) {
      return ctx.response.redirect('/home')
    }

    return next()
  }
}
