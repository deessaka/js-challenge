import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { ConfigStore } from '../dist/config_store.js'
import { EditorPreferencesStore } from '../dist/editor_preferences.js'

test('editor preferences default to alternate screen on and automatic pairs off', async () => {
  const root = await mkdtemp(join(tmpdir(), 'codojo-preferences-'))
  try {
    const store = new EditorPreferencesStore({ XDG_CONFIG_HOME: root }, root)
    assert.deepEqual(await store.read(), { alternateScreen: true, autoPairs: false })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('editor preferences live in a file separate from API credentials', async () => {
  const root = await mkdtemp(join(tmpdir(), 'codojo-preferences-'))
  try {
    const env = { XDG_CONFIG_HOME: root }
    const config = new ConfigStore(env, root)
    const preferences = new EditorPreferencesStore(env, root)

    await config.save({ apiBaseUrl: 'https://codojo.ekodevs.com', token: 'secret-token' })
    await preferences.save({ alternateScreen: false, autoPairs: true })

    assert.notEqual(preferences.filePath, config.filePath)
    assert.deepEqual(await preferences.read(), { alternateScreen: false, autoPairs: true })
    assert.doesNotMatch(await readFile(preferences.filePath, 'utf8'), /secret-token/)
    assert.doesNotMatch(await readFile(config.filePath, 'utf8'), /autoPairs/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
