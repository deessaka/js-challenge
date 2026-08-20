import assert from 'node:assert/strict'
import { PassThrough } from 'node:stream'
import test from 'node:test'
import React from 'react'
import { render, renderToString, Text, useInput } from 'ink'

import { createTuiRenderOptions, runTui } from '../dist/tui_runtime.js'
import { ChallengeDetails } from '../dist/ui/ChallengeDetails.js'
import { ChallengeList } from '../dist/ui/ChallengeList.js'
import { CodeEditorView } from '../dist/ui/CodeEditorView.js'
import { HelpView } from '../dist/ui/HelpView.js'
import { TestView } from '../dist/ui/TestView.js'

const exercise = {
  id: 'exercise-1',
  slug: 'hello-world',
  number: 1,
  title: 'Hello World',
  description: 'Retourner un message.',
  language: 'javascript',
  difficulty: 1,
  difficultyLabel: 'easy',
  category: 'bases',
  points: 10,
  status: 'published',
  starterCode: 'function hello() {}',
  hint: null,
  prerequisiteId: null,
  isUnlocked: true,
  isCompleted: false,
  progressStatus: 'available',
}

function createTerminalStreams() {
  const stdin = new PassThrough()
  const stdout = new PassThrough()
  const output = []
  const rawModeChanges = []

  stdin.isTTY = true
  stdin.ref = () => stdin
  stdin.unref = () => stdin
  stdin.setRawMode = (enabled) => {
    rawModeChanges.push(enabled)
  }
  stdout.isTTY = true
  stdout.columns = 100
  stdout.rows = 30
  stdout.on('data', (chunk) => output.push(chunk.toString()))

  return { stdin, stdout, output, rawModeChanges }
}

function InputProbe({ onInput }) {
  useInput(onInput)
  return React.createElement(Text, null, 'ready')
}

test('TUI render options enable modern terminal features by default', () => {
  assert.deepEqual(createTuiRenderOptions(), {
    alternateScreen: true,
    kittyKeyboard: { mode: 'auto' },
    exitOnCtrlC: true,
  })
})

test('TUI render options can disable the alternate screen explicitly', () => {
  assert.equal(createTuiRenderOptions({ alternateScreen: false }).alternateScreen, false)
})

test('TUI lifecycle always unmounts after a normal exit', async () => {
  let unmounted = false
  const renderer = () => ({
    waitUntilExit: async () => {},
    unmount: () => {
      unmounted = true
    },
  })

  await runTui({}, {}, renderer)

  assert.equal(unmounted, true)
})

test('TUI lifecycle always unmounts when waiting for exit fails', async () => {
  let unmounted = false
  const failure = new Error('terminal failure')
  const renderer = () => ({
    waitUntilExit: async () => {
      throw failure
    },
    unmount: () => {
      unmounted = true
    },
  })

  await assert.rejects(() => runTui({}, {}, renderer), failure)
  assert.equal(unmounted, true)
})

test('Ink 7 preserves the key semantics used by the CLI', async () => {
  const terminal = createTerminalStreams()
  const events = []
  const instance = render(React.createElement(InputProbe, { onInput: (input, key) => events.push({ input, key }) }), {
    ...createTuiRenderOptions({ alternateScreen: false }),
    stdin: terminal.stdin,
    stdout: terminal.stdout,
    interactive: true,
    exitOnCtrlC: false,
  })

  await instance.waitUntilRenderFlush()
  for (const input of ['\u001b[A', '\u001b[B', '\u001b', '\u007f', '\u001b[3~', '\u0003']) {
    terminal.stdin.write(input)
    await new Promise((resolve) => setTimeout(resolve, input === '\u001b' ? 60 : 0))
  }
  instance.unmount()
  await instance.waitUntilExit()

  assert.equal(events[0].key.upArrow, true)
  assert.equal(events[1].key.downArrow, true)
  assert.equal(events[2].key.escape, true)
  assert.equal(events[3].key.backspace, true)
  assert.equal(events[4].key.delete, true)
  assert.deepEqual(
    { input: events[5].input, ctrl: events[5].key.ctrl },
    { input: 'c', ctrl: true },
  )
})

test('Ctrl+C restores raw mode and the primary screen', async () => {
  const terminal = createTerminalStreams()
  const instance = render(React.createElement(InputProbe, { onInput: () => {} }), {
    ...createTuiRenderOptions(),
    stdin: terminal.stdin,
    stdout: terminal.stdout,
    interactive: true,
  })

  await instance.waitUntilRenderFlush()
  terminal.stdin.write('\u0003')
  await instance.waitUntilExit()

  assert.equal(terminal.rawModeChanges.includes(true), true)
  assert.equal(terminal.rawModeChanges.at(-1), false)
  assert.match(terminal.output.join(''), /\u001b\[\?1049h/)
  assert.match(terminal.output.join(''), /\u001b\[\?1049l/)
})

test('all five terminal views render with the Ink 7 runtime', () => {
  const views = [
    React.createElement(ChallengeList, {
      exercises: [exercise],
      selectedExerciseId: exercise.id,
      searchQuery: '',
      filterMode: 'all',
    }),
    React.createElement(ChallengeDetails, { challenge: exercise }),
    React.createElement(CodeEditorView, {
      challenge: exercise,
      initialCode: exercise.starterCode,
      onSaveCode: async () => {},
      onTestLocally: () => {},
      onSubmitSolution: () => {},
      onBack: () => {},
    }),
    React.createElement(TestView, {
      challengeTitle: exercise.title,
      isTesting: false,
      isDryRun: true,
      isWatching: false,
      submission: null,
      error: null,
      executionTimeMs: null,
    }),
    React.createElement(HelpView),
  ]

  const output = views.map((view) => renderToString(view, { columns: 120 }))

  assert.equal(output.length, 5)
  assert.equal(output.every((frame) => frame.length > 0), true)
  assert.match(output[0], /1 affichés/)
  assert.match(output[1], /Hello World/)
  assert.match(output[2], /ÉDITEUR/)
  assert.match(output[3], /CONSOLE DE DÉBOGAGE/)
  assert.match(output[4], /GUIDE DES RACCOURCIS/)
})
