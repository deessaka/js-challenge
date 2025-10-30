import { UserDto } from '#dto/user_dto'
import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    appName: 'JS Challenge',
    user: (ctx) => new UserDto(ctx.auth?.user!).toJSON(),
    errors: (ctx) => ctx.session && ctx.session.flashMessages ? ctx.session.flashMessages.get('errors') : null,
    flash: (ctx) => {
      if (!ctx.session || !ctx.session.flashMessages) return {}
      return {
        success: ctx.session.flashMessages.get('success'),
        error: ctx.session.flashMessages.get('error'),
        warning: ctx.session.flashMessages.get('warning'),
        info: ctx.session.flashMessages.get('info'),
      }
    },
  },

  /**s
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> { }
}
