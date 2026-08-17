import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const publicAppUrl = (env.get('PUBLIC_APP_URL') || env.get('DOMAIN') || '').replace(/\/$/, '')

const allyConfig = defineConfig({
  github: services.github({
    clientId: env.get('GITHUB_CLIENT_ID'),
    clientSecret: env.get('GITHUB_CLIENT_SECRET'),
    callbackUrl: `${publicAppUrl}/oauth/github/callback`,
    scopes: ['user:email'],
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
