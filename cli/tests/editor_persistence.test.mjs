import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { DEFAULT_API_URL } from '../dist/config_store.js'
import { EditorPersistence } from '../dist/editor_persistence.js'

async function makePersistence(apiBaseUrl = DEFAULT_API_URL, existingRoot) {
  const root = existingRoot || (await mkdtemp(join(tmpdir(), 'codojo-persistence-')))
  const workspacePath = join(root, 'workspace')
  const stateHome = join(root, 'state')
  await mkdir(workspacePath, { recursive: true })
  const persistence = new EditorPersistence(
    {
      slug: 'hello-world',
      apiBaseUrl,
      legacyWorkspacePath: workspacePath,
      legacyExerciseId: 'exercise-1',
    },
    { env: { XDG_STATE_HOME: stateHome }, home: root, platform: 'linux' },
  )
  return { root, workspacePath, persistence }
}

test('persists the virtual document without creating a workspace file', async () => {
  const { root, workspacePath, persistence } = await makePersistence()
  try {
    assert.deepEqual(await persistence.open('starter'), { code: 'starter' })
    assert.equal(await readFile(persistence.virtualFilePath, 'utf8'), 'starter')
    await assert.rejects(() => readFile(join(workspacePath, 'hello-world.js'), 'utf8'), {
      code: 'ENOENT',
    })

    await persistence.save('finished')
    assert.equal(await readFile(persistence.virtualFilePath, 'utf8'), 'finished')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('serializes concurrent saves so the latest buffer wins', async () => {
  const { root, persistence } = await makePersistence()
  try {
    await persistence.open('starter')
    await Promise.all([persistence.save('first edit'), persistence.save('latest edit')])
    assert.equal(await readFile(persistence.virtualFilePath, 'utf8'), 'latest edit')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('scopes virtual documents by API target', async () => {
  const first = await makePersistence(DEFAULT_API_URL)
  const second = await makePersistence('http://localhost:3333', first.root)
  try {
    assert.notEqual(first.persistence.virtualFilePath, second.persistence.virtualFilePath)
    await first.persistence.open('production draft')
    await second.persistence.open('development draft')
    assert.equal(await readFile(first.persistence.virtualFilePath, 'utf8'), 'production draft')
    assert.equal(await readFile(second.persistence.virtualFilePath, 'utf8'), 'development draft')
  } finally {
    await rm(first.root, { recursive: true, force: true })
  }
})

test('imports a legacy workspace file non-destructively', async () => {
  const { root, workspacePath, persistence } = await makePersistence()
  try {
    await writeFile(join(workspacePath, 'hello-world.js'), 'legacy solution')
    assert.deepEqual(await persistence.open('starter'), { code: 'legacy solution' })
    assert.equal(await readFile(join(workspacePath, 'hello-world.js'), 'utf8'), 'legacy solution')
    assert.equal(await readFile(persistence.virtualFilePath, 'utf8'), 'legacy solution')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
