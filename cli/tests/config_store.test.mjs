import assert from 'node:assert/strict'
import { mkdir, readFile, stat, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import test from 'node:test'

import { ConfigStore, DEFAULT_API_URL, normalizeApiUrl } from '../dist/config_store.js'

async function temporaryRoot() {
  const root = join('/tmp', `codojo-config-test-${process.pid}-${Date.now()}`)
  await mkdir(root, { recursive: true })
  return root
}

test('production API is the default endpoint', () => {
  const store = new ConfigStore({}, '/tmp/codojo-config-test')

  assert.equal(DEFAULT_API_URL, 'https://codojo.ekodevs.com')
  assert.equal(store.defaultApiUrl, DEFAULT_API_URL)
  assert.match(store.filePath, /profiles[\\/]production\.json$/)
})

test('development configuration uses its isolated endpoint', () => {
  const store = new ConfigStore(
    {
      CODOJO_DEV_API_URL: ' http://localhost:3333/// ',
    },
    '/tmp/codojo-config-test',
    'development'
  )

  assert.equal(store.defaultApiUrl, 'http://localhost:3333')
  assert.equal(store.filePath.endsWith('/profiles/development.json'), true)
  assert.equal(normalizeApiUrl('http://localhost:3333/'), 'http://localhost:3333')
})

test('production and development tokens are stored in separate files', async () => {
  const root = await temporaryRoot()
  try {
    const env = { XDG_CONFIG_HOME: root }
    const production = new ConfigStore(env, root, 'production')
    const development = new ConfigStore(env, root, 'development')

    await production.save({ apiBaseUrl: DEFAULT_API_URL, token: 'production-secret' })
    await development.save({ apiBaseUrl: 'http://localhost:3333', token: 'development-secret' })

    assert.notEqual(production.filePath, development.filePath)
    assert.equal((await production.read()).token, 'production-secret')
    assert.equal((await development.read()).token, 'development-secret')

    const productionMode = (await stat(production.filePath)).mode & 0o777
    const developmentMode = (await stat(development.filePath)).mode & 0o777
    assert.equal(productionMode, 0o600)
    assert.equal(developmentMode, 0o600)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('rejects an unsafe production endpoint before storing a token', async () => {
  const root = await temporaryRoot()
  try {
    const store = new ConfigStore({ XDG_CONFIG_HOME: root }, root, 'production')
    await assert.rejects(
      () => store.save({ apiBaseUrl: 'http://localhost:3333', token: 'secret' }),
      /production exige exactement/
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('migrates an unambiguous local legacy configuration only to development', async () => {
  const root = await temporaryRoot()
  try {
    const env = { XDG_CONFIG_HOME: root }
    const legacyPath = join(root, 'codojo', 'config.json')
    await mkdir(join(root, 'codojo'), { recursive: true })
    await writeFile(
      legacyPath,
      JSON.stringify({ apiBaseUrl: 'http://localhost:3333', token: 'development-secret' })
    )

    const development = new ConfigStore(env, root, 'development')
    const production = new ConfigStore(env, root, 'production')

    assert.equal((await development.read()).token, 'development-secret')
    assert.equal((await production.read()).token, undefined)
    assert.equal(
      (await readFile(development.filePath, 'utf8')).includes('development-secret'),
      true
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
