import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
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

test('refreshes an untouched draft when the starter code changes server-side', async () => {
  const { root, persistence } = await makePersistence()
  try {
    await persistence.open('starter v1')
    assert.deepEqual(await persistence.open('starter v2'), { code: 'starter v2' })
    assert.equal(await readFile(persistence.virtualFilePath, 'utf8'), 'starter v2')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('never overwrites a draft the learner has edited, even after a starter code change', async () => {
  const { root, persistence } = await makePersistence()
  try {
    await persistence.open('starter v1')
    await persistence.save('my in-progress solution')
    assert.deepEqual(await persistence.open('starter v2'), { code: 'my in-progress solution' })
    assert.equal(await readFile(persistence.virtualFilePath, 'utf8'), 'my in-progress solution')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('never refreshes a pre-existing draft that has no seed record, even across repeated opens', async () => {
  const { root, persistence } = await makePersistence()
  try {
    await mkdir(dirname(persistence.virtualFilePath), { recursive: true })
    await writeFile(persistence.virtualFilePath, 'old draft, no seed file')

    // Ambiguous: could be an edited solution or a stale template — must never be discarded.
    assert.deepEqual(await persistence.open('starter v2'), { code: 'old draft, no seed file' })
    assert.equal(await readFile(persistence.virtualFilePath, 'utf8'), 'old draft, no seed file')
    assert.deepEqual(await persistence.open('starter v3'), { code: 'old draft, no seed file' })
    assert.equal(await readFile(persistence.virtualFilePath, 'utf8'), 'old draft, no seed file')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('bootstraps a seed record once a no-seed draft happens to match the current starter code', async () => {
  const { root, persistence } = await makePersistence()
  try {
    await mkdir(dirname(persistence.virtualFilePath), { recursive: true })
    await writeFile(persistence.virtualFilePath, 'starter v2')

    assert.deepEqual(await persistence.open('starter v2'), { code: 'starter v2' })
    // A seed was safely bootstrapped (content matched exactly), so a later change now refreshes it.
    assert.deepEqual(await persistence.open('starter v3'), { code: 'starter v3' })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
