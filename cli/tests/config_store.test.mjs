import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ConfigStore,
  DEFAULT_API_URL,
  normalizeApiUrl,
} from '../dist/config_store.js'

test('production API is the default endpoint', () => {
  const store = new ConfigStore({}, '/tmp/codojo-config-test')

  assert.equal(DEFAULT_API_URL, 'https://codojo.ekodevs.com')
  assert.equal(store.defaultApiUrl, DEFAULT_API_URL)
})

test('CODOJO_API_URL overrides and normalizes the endpoint', () => {
  const store = new ConfigStore(
    {
      CODOJO_API_URL: ' https://preview.example.test/// ',
      JS_CHALLENGE_API_URL: 'https://legacy.example.test',
    },
    '/tmp/codojo-config-test'
  )

  assert.equal(store.defaultApiUrl, 'https://preview.example.test')
  assert.equal(normalizeApiUrl('http://localhost:3333/'), 'http://localhost:3333')
})
