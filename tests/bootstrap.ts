import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import testUtils from '@adonisjs/core/services/test_utils'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
import { shieldApiClient } from '@adonisjs/shield/plugins/api_client'

export const plugins: Config['plugins'] = [
  assert(),
  apiClient(),
  pluginAdonisJS(app),
  sessionApiClient(app),
  shieldApiClient(),
]

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    () => {
      const databaseName = process.env.DB_DATABASE || ''
      if (!databaseName.toLowerCase().includes('test')) {
        throw new Error(
          `Refusing to run database tests against "${databaseName}". Set DB_DATABASE to a dedicated test database.`
        )
      }
    },
  ],
  teardown: [],
}

export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
