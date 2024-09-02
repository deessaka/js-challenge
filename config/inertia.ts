import { UserDto } from '#dto/user_dto'
import Exercise from '#models/exercise'
import User from '#models/user'
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
    user: (ctx) => new UserDto(ctx.auth?.user!).toJSON(),
    users: async () => await User.all(),
    exercises: async () => (await Exercise.all()).sort((a, b) => a.number - b.number),
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
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
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
