import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  getUpdateInfo,
  isNewerVersion,
  isUpdateCheckDisabled,
  notifyIfUpdateAvailable,
  resolveRegistry,
} from '../dist/update_service.js'

test('SemVer comparison handles stable and prerelease versions', () => {
  assert.equal(isNewerVersion('0.2.0-beta.1', '0.2.0-beta.2'), true)
  assert.equal(isNewerVersion('0.2.0-beta.1', '0.2.0'), true)
  assert.equal(isNewerVersion('0.2.0', '0.2.0-beta.2'), false)
  assert.equal(isNewerVersion('0.2.0', '0.2.0'), false)
  assert.equal(isNewerVersion('0.2.0', '0.1.99'), false)
})

test('update service reads the requested dist-tag and respects the configured registry', async () => {
  const cachePath = join(await mkdtemp(join(tmpdir(), 'codojo-update-')), 'cache.json')
  const requests = []
  try {
    const result = await getUpdateInfo('0.2.0-beta.1', 'beta', {
      env: { npm_config_registry: 'https://registry.example.test/' },
      cachePath,
      fetcher: async (url, init) => {
        requests.push({ url, init })
        return new Response(JSON.stringify({ 'dist-tags': { beta: '0.3.0-beta.1' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    })

    assert.deepEqual(result, {
      currentVersion: '0.2.0-beta.1',
      latestVersion: '0.3.0-beta.1',
      tag: 'beta',
    })
    assert.equal(requests.length, 1)
    assert.equal(requests[0].url, 'https://registry.example.test/%40codojo%2fcli')
    assert.equal(requests[0].init.headers.Accept, 'application/vnd.npm.install-v1+json')
    const cache = JSON.parse(await readFile(cachePath, 'utf8'))
    assert.equal(typeof cache.checkedAt, 'number')
    assert.equal(cache.tag, 'beta')
    assert.equal(cache.latestVersion, '0.3.0-beta.1')
  } finally {
    await rm(cachePath, { force: true })
  }
})

test('cached update metadata avoids a second network request', async () => {
  const root = await mkdtemp(join(tmpdir(), 'codojo-update-cache-'))
  const cachePath = join(root, 'cache.json')
  let calls = 0
  try {
    const options = {
      cachePath,
      now: () => 1000,
      fetcher: async () => {
        calls += 1
        return new Response(JSON.stringify({ 'dist-tags': { latest: '0.3.0' } }), { status: 200 })
      },
    }
    await getUpdateInfo('0.2.0', 'latest', options)
    const cached = await getUpdateInfo('0.2.0', 'latest', options)
    assert.equal(calls, 1)
    assert.equal(cached.latestVersion, '0.3.0')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('a newer stable version produces the suggested update notification', async () => {
  const root = await mkdtemp(join(tmpdir(), 'codojo-update-notification-'))
  const originalError = console.error
  const output = []
  console.error = (message) => output.push(message)
  try {
    await notifyIfUpdateAvailable('0.2.0', {
      cachePath: join(root, 'cache.json'),
      fetcher: async () =>
        new Response(JSON.stringify({ 'dist-tags': { latest: '0.3.0' } }), { status: 200 }),
    })
    assert.match(output.join('\n'), /0\.2\.0.*0\.3\.0/)
    assert.match(output.join('\n'), /codojo update/)
  } finally {
    console.error = originalError
    await rm(root, { recursive: true, force: true })
  }
})

test('network failures are fail-open and do not notify', async () => {
  const root = await mkdtemp(join(tmpdir(), 'codojo-update-failure-'))
  const cachePath = join(root, 'cache.json')
  const originalError = console.error
  const output = []
  console.error = (message) => output.push(message)
  try {
    const result = await getUpdateInfo('0.2.0', 'latest', {
      cachePath,
      fetcher: async () => {
        throw new Error('offline')
      },
    })
    await notifyIfUpdateAvailable('0.2.0', {
      cachePath: join(root, 'notification-cache.json'),
      fetcher: async () => {
        throw new Error('offline')
      },
    })
    assert.equal(result, null)
    assert.deepEqual(output, [])
  } finally {
    console.error = originalError
    await rm(root, { recursive: true, force: true })
  }
})

test('update checks can be disabled in CI or explicitly', () => {
  assert.equal(isUpdateCheckDisabled({ CI: 'true' }), true)
  assert.equal(isUpdateCheckDisabled({ CODOJO_NO_UPDATE_CHECK: '1' }), true)
  assert.equal(isUpdateCheckDisabled({}), false)
  assert.equal(
    resolveRegistry({ npm_config_registry: 'https://registry.test///' }),
    'https://registry.test',
  )
})
