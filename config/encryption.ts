import env from '#start/env'
import { defineConfig, drivers } from '@adonisjs/core/encryption'
import { InferEncryptors } from '@adonisjs/core/types'

const encryptionConfig = defineConfig({
  default: 'legacy',
  list: {
    legacy: drivers.legacy({
      keys: [env.get('APP_KEY') as string],
    }),
  },
})

export default encryptionConfig

declare module '@adonisjs/core/types' {
  export interface EncryptorsList extends InferEncryptors<typeof encryptionConfig> { }
}
