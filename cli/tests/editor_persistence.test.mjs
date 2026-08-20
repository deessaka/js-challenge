import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, rm, stat, utimes, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { EditorPersistence } from '../dist/editor_persistence.js'

async function withWorkspace(run) {
  const root = await mkdtemp(join(tmpdir(), 'codojo-persistence-'))
  const workspacePath = join(root, 'workspace')
  const stateHome = join(root, 'state')
  const filePath = join(workspacePath, 'hello-world.js')
  const persistence = new EditorPersistence(
    { workspacePath, exerciseId: 'exercise-1', filePath },
    { env: { XDG_STATE_HOME: stateHome }, home: root, platform: 'linux' }
  )

  try {
    await run({ root, workspacePath, stateHome, filePath, persistence })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

test('a durable save atomically replaces the main file and clears recovery', async () => {
  await withWorkspace(async ({ filePath, persistence }) => {
    const opened = await persistence.open('starter')
    assert.equal(opened.code, 'starter')
    assert.equal(opened.recovery, null)

    await persistence.save('finished')

    assert.equal(await readFile(filePath, 'utf8'), 'finished')
    assert.equal(await persistence.inspectRecovery(), null)
    assert.deepEqual((await readdir(join(filePath, '..'))).sort(), ['hello-world.js'])
  })
})

test('concurrent saves are serialized so the latest buffer wins', async () => {
  await withWorkspace(async ({ filePath, persistence }) => {
    await persistence.open('starter')

    await Promise.all([persistence.save('first edit'), persistence.save('latest edit')])

    assert.equal(await readFile(filePath, 'utf8'), 'latest edit')
    assert.equal(await persistence.inspectRecovery(), null)
  })
})

test('recovery is isolated by workspace and exercise', async () => {
  await withWorkspace(async ({ root, stateHome }) => {
    const first = new EditorPersistence(
      {
        workspacePath: join(root, 'workspace-a'),
        exerciseId: 'same-exercise',
        filePath: join(root, 'missing-parent', 'solution.js'),
      },
      { env: { XDG_STATE_HOME: stateHome }, home: root, platform: 'linux' }
    )
    const otherWorkspace = new EditorPersistence(
      {
        workspacePath: join(root, 'workspace-b'),
        exerciseId: 'same-exercise',
        filePath: join(root, 'workspace-b', 'solution.js'),
      },
      { env: { XDG_STATE_HOME: stateHome }, home: root, platform: 'linux' }
    )
    const otherExercise = new EditorPersistence(
      {
        workspacePath: join(root, 'workspace-a'),
        exerciseId: 'other-exercise',
        filePath: join(root, 'workspace-a', 'other.js'),
      },
      { env: { XDG_STATE_HOME: stateHome }, home: root, platform: 'linux' }
    )

    await first.preserveRecovery('recover me')

    assert.equal((await first.inspectRecovery())?.code, 'recover me')
    assert.equal(await otherWorkspace.inspectRecovery(), null)
    assert.equal(await otherExercise.inspectRecovery(), null)
    assert.notEqual(first.recoveryFilePath, otherWorkspace.recoveryFilePath)
    assert.notEqual(first.recoveryFilePath, otherExercise.recoveryFilePath)
  })
})

test('a newer recovery is offered without modifying the main file', async () => {
  await withWorkspace(async ({ filePath, persistence }) => {
    await persistence.open('main version')
    const mainBefore = await stat(filePath)
    await persistence.preserveRecovery('newer buffer')
    await utimes(filePath, mainBefore.atime, new Date(mainBefore.mtimeMs - 2_000))

    const opened = await persistence.open('unused starter')

    assert.equal(opened.code, 'main version')
    assert.equal(opened.recovery?.code, 'newer buffer')
    assert.equal(await readFile(filePath, 'utf8'), 'main version')
  })
})

test('recovery is offered before creating a missing main file', async () => {
  await withWorkspace(async ({ filePath, persistence }) => {
    await persistence.preserveRecovery('buffer from the crash')

    const opened = await persistence.open('starter')

    assert.equal(opened.code, 'starter')
    assert.equal(opened.recovery?.code, 'buffer from the crash')
    await assert.rejects(() => readFile(filePath, 'utf8'), { code: 'ENOENT' })
  })
})

test('restore and ignore are explicit recovery decisions', async () => {
  await withWorkspace(async ({ filePath, persistence }) => {
    await persistence.open('main version')
    await persistence.preserveRecovery('recovered version')
    await utimes(filePath, new Date(0), new Date(0))

    assert.equal(await persistence.restoreRecovery(), 'recovered version')
    assert.equal(await readFile(filePath, 'utf8'), 'recovered version')
    assert.equal(await persistence.inspectRecovery(), null)

    await persistence.preserveRecovery('ignored version')
    await persistence.ignoreRecovery()
    assert.equal(await readFile(filePath, 'utf8'), 'recovered version')
    assert.equal(await persistence.inspectRecovery(), null)
  })
})

test('a main-file error keeps the previous file and recoverable buffer', async (context) => {
  if (process.platform === 'win32') {
    context.skip('POSIX directory permissions are required for this assertion')
    return
  }

  await withWorkspace(async ({ filePath, persistence }) => {
    await persistence.open('previous version')
    const directory = join(filePath, '..')
    const { chmod } = await import('node:fs/promises')
    await chmod(directory, 0o500)

    try {
      await assert.rejects(() => persistence.save('unsaved buffer'))
      assert.equal(await readFile(filePath, 'utf8'), 'previous version')
      assert.equal((await persistence.inspectRecovery())?.code, 'unsaved buffer')
    } finally {
      await chmod(directory, 0o700)
    }
  })
})

test('invalid recovery data is ignored without touching the main file', async () => {
  await withWorkspace(async ({ filePath, persistence }) => {
    await persistence.open('safe main')
    await persistence.preserveRecovery('temporary')
    await writeFile(persistence.recoveryFilePath, '{not json', 'utf8')

    assert.equal(await persistence.inspectRecovery(), null)
    assert.equal(await readFile(filePath, 'utf8'), 'safe main')
  })
})
