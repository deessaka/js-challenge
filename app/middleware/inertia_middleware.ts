import { UserDto } from '#dto/user_dto'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  /**
   * Data that should be shared with all rendered pages
   */
  async share(ctx: HttpContext) {
    const webGuard = ctx.auth?.use('web')
    await webGuard?.check()

    return {
      appName: 'Codojo',
      user: webGuard?.user ? new UserDto(webGuard.user).toJSON() : null,
      errors:
        ctx.session && ctx.session.flashMessages ? ctx.session.flashMessages.get('errors') : null,
      flash: {
        success: ctx.session?.flashMessages?.get('success'),
        error: ctx.session?.flashMessages?.get('error'),
        warning: ctx.session?.flashMessages?.get('warning'),
        info: ctx.session?.flashMessages?.get('info'),
        apiToken: ctx.session?.flashMessages?.get('apiToken'),
      },
    }
  }

  /**
   * Handle request
   */
  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)
    try {
      await next()
    } finally {
      this.dispose(ctx)
    }
  }
}

declare module '@adonisjs/inertia/types' {
  export interface SharedProps {
    appName: string
    user: any | null
    errors: any
    flash: any
  }
  export interface InertiaPages {
    'auth/verify-email-pending': { email: string; justSent?: boolean }
    'exercise': { exercise: any }
    'landing': { error?: string }
    'home': { progressExercises?: any; users?: any; user?: any; error?: string }
    'profile/show': { user: any }
    'password/reset': { token: string }
    'errors/not_found': { error: any }
    'errors/server_error': { error: any }
    'docs/index': { documents: any }
    'docs/show': { document: any; documents: any }
    'admin/dashboard': { stats: any; recentLogs: any[] }
    'admin/users': { users: any; filters: any }
    'admin/exercises': { exercises: any; filters: any }
    [key: string]: any
  }
}
