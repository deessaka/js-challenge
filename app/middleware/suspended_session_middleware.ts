import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SuspendedSessionMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const guard = ctx.auth.use('web')
    await guard.check()

    if (guard.user?.status === 'suspended') {
      await guard.logout()
      ctx.session.flash(
        'error',
        'Votre compte est suspendu. Vous pouvez toujours consulter le site public.'
      )
    }

    return next()
  }
}
