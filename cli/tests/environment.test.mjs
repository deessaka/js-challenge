import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EnvironmentError,
  defaultApiUrlFor,
  resolveEnvironment,
  validateApiUrl,
} from '../dist/environment.js'

test('production is the default environment', () => {
  assert.deepEqual(resolveEnvironment({ env: {} }), {
    environment: 'production',
    apiBaseUrl: 'https://codojo.ekodevs.com',
    source: 'default',
  })
  assert.equal(defaultApiUrlFor('production'), 'https://codojo.ekodevs.com')
})

test('development uses loopback and remains explicit', () => {
  assert.deepEqual(
    resolveEnvironment({
      requestedEnvironment: 'development',
      env: {},
    }),
    {
      environment: 'development',
      apiBaseUrl: 'http://localhost:3333',
      source: 'default',
    }
  )

  assert.equal(
    resolveEnvironment({
      requestedEnvironment: 'development',
      env: { CODOJO_DEV_API_URL: 'http://127.0.0.1:4444/' },
    }).apiBaseUrl,
    'http://127.0.0.1:4444'
  )
})

test('staging requires an explicit HTTPS endpoint', () => {
  assert.equal(
    resolveEnvironment({
      requestedEnvironment: 'staging',
      env: { CODOJO_STAGING_API_URL: 'https://staging.example.test/' },
    }).apiBaseUrl,
    'https://staging.example.test'
  )

  assert.throws(
    () => resolveEnvironment({ requestedEnvironment: 'staging', env: {} }),
    EnvironmentError
  )
})

test('rejects unsafe environment and endpoint combinations', () => {
  assert.throws(() => validateApiUrl('production', 'http://localhost:3333'), EnvironmentError)
  assert.throws(
    () => validateApiUrl('development', 'https://public.example.test'),
    EnvironmentError
  )
  assert.throws(
    () => validateApiUrl('production', 'https://user:password@codojo.ekodevs.com'),
    EnvironmentError
  )
  assert.throws(
    () => resolveEnvironment({ explicitApiUrl: 'https://unknown.example.test', env: {} }),
    EnvironmentError
  )
})
