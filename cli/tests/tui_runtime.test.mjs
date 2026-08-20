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
import { Header } from '../dist/ui/Header.js'
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

function createTerminalStreams({ columns = 100, rows = 30 } = {}) {
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
  stdout.columns = columns
  stdout.rows = rows
  stdout.on('data', (chunk) => output.push(chunk.toString()))

  return { stdin, stdout, output, rawModeChanges }
}

function InputProbe({ onInput }) {
  useInput(onInput)
  return React.createElement(Text, null, 'ready')
}

function EchoingEditor({ onTest }) {
  const [code, setCode] = React.useState('value')
  return React.createElement(CodeEditorView, {
    challenge: exercise,
    initialCode: code,
    onSaveCode: async (nextCode) => setCode(nextCode),
    onTestLocally: onTest,
    onSubmitSolution: () => {},
    onBack: () => {},
  })
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
  const instance = render(
    React.createElement(InputProbe, { onInput: (input, key) => events.push({ input, key }) }),
    {
      ...createTuiRenderOptions({ alternateScreen: false }),
      stdin: terminal.stdin,
      stdout: terminal.stdout,
      interactive: true,
      exitOnCtrlC: false,
    }
  )

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
  assert.deepEqual({ input: events[5].input, ctrl: events[5].key.ctrl }, { input: 'c', ctrl: true })
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
  assert.equal(
    output.every((frame) => frame.length > 0),
    true
  )
  assert.match(output[0], /1 affichés/)
  assert.match(output[1], /Hello World/)
  assert.match(output[2], /ÉDITEUR/)
  assert.match(output[3], /CONSOLE DE DÉBOGAGE/)
  assert.match(output[4], /GUIDE DES RACCOURCIS/)
})

test('the editor view delegates printable input to the headless engine', async () => {
  const terminal = createTerminalStreams()
  const instance = render(
    React.createElement(CodeEditorView, {
      challenge: exercise,
      initialCode: 'value',
      onSaveCode: async () => {},
      onTestLocally: () => {},
      onSubmitSolution: () => {},
      onBack: () => {},
    }),
    {
      ...createTuiRenderOptions({ alternateScreen: false }),
      stdin: terminal.stdin,
      stdout: terminal.stdout,
      interactive: true,
      exitOnCtrlC: false,
    }
  )

  await instance.waitUntilRenderFlush()
  terminal.stdin.write('i')
  await instance.waitUntilRenderFlush()
  terminal.stdin.write('X')
  await instance.waitUntilRenderFlush()
  instance.unmount()
  await instance.waitUntilExit()

  assert.match(terminal.output.join(''), /Xvalue/)
})

test('the editor uses the native terminal cursor instead of inverse text', async () => {
  const terminal = createTerminalStreams()
  const instance = render(
    React.createElement(CodeEditorView, {
      challenge: exercise,
      initialCode: '界value',
      onSaveCode: async () => {},
      onTestLocally: () => {},
      onSubmitSolution: () => {},
      onBack: () => {},
    }),
    {
      ...createTuiRenderOptions({ alternateScreen: false }),
      stdin: terminal.stdin,
      stdout: terminal.stdout,
      interactive: true,
      exitOnCtrlC: false,
    }
  )

  await instance.waitUntilRenderFlush()
  await instance.waitUntilRenderFlush()
  const output = terminal.output.join('')
  instance.unmount()
  await instance.waitUntilExit()

  assert.match(output, /\u001b\[\?25h/)
  assert.doesNotMatch(output, /\u001b\[7m/)
})

test('rapid resize selects compact and blocking layouts without changing the buffer', async () => {
  const terminal = createTerminalStreams()
  const tested = []
  const instance = render(
    React.createElement(CodeEditorView, {
      challenge: exercise,
      initialCode: 'value',
      onSaveCode: async () => {},
      onTestLocally: (code) => tested.push(code),
      onSubmitSolution: () => {},
      onBack: () => {},
    }),
    {
      ...createTuiRenderOptions({ alternateScreen: false }),
      stdin: terminal.stdin,
      stdout: terminal.stdout,
      interactive: true,
      exitOnCtrlC: true,
    }
  )

  await instance.waitUntilRenderFlush()
  terminal.stdin.write('i')
  await instance.waitUntilRenderFlush()
  terminal.stdin.write('X')
  await instance.waitUntilRenderFlush()

  terminal.output.length = 0
  for (const [columns, rows] of [
    [79, 23],
    [72, 20],
    [70, 20],
  ]) {
    terminal.stdout.columns = columns
    terminal.stdout.rows = rows
    terminal.stdout.emit('resize')
  }
  await instance.waitUntilRenderFlush()
  assert.match(terminal.output.join(''), /💻 Hello World/)

  terminal.output.length = 0
  terminal.stdout.columns = 59
  terminal.stdout.rows = 15
  terminal.stdout.emit('resize')
  await instance.waitUntilRenderFlush()
  assert.match(terminal.output.join(''), /Terminal trop petit — 59×15/)
  assert.match(terminal.output.join(''), /60×16/)

  terminal.stdout.columns = 100
  terminal.stdout.rows = 30
  terminal.stdout.emit('resize')
  await instance.waitUntilRenderFlush()
  terminal.stdin.write('\u0014')
  await instance.waitUntilRenderFlush()
  assert.equal(tested.at(-1), 'Xvalue')

  terminal.stdin.write('\u0003')
  await instance.waitUntilExit()
})

test('the global header reduces its chrome below 80 by 24', async () => {
  const terminal = createTerminalStreams({ columns: 79, rows: 23 })
  const instance = render(
    React.createElement(Header, {
      user: null,
      challenges: [exercise],
      activeView: 'editor',
      apiBaseUrl: 'https://codojo.ekodevs.com',
    }),
    {
      ...createTuiRenderOptions({ alternateScreen: false }),
      stdin: terminal.stdin,
      stdout: terminal.stdout,
      interactive: true,
      exitOnCtrlC: false,
    }
  )

  await instance.waitUntilRenderFlush()
  const output = terminal.output.join('')
  instance.unmount()
  await instance.waitUntilExit()

  assert.match(output, /CODOJO/)
  assert.doesNotMatch(output, /Terminal Edition/)
  assert.doesNotMatch(output, /Progression:/)
})

test('the editor refuses bracketed paste without changing the document', async () => {
  const terminal = createTerminalStreams()
  const saved = []
  const instance = render(
    React.createElement(CodeEditorView, {
      challenge: exercise,
      initialCode: 'value',
      onSaveCode: async (code) => saved.push(code),
      onTestLocally: () => {},
      onSubmitSolution: () => {},
      onBack: () => {},
    }),
    {
      ...createTuiRenderOptions({ alternateScreen: false }),
      stdin: terminal.stdin,
      stdout: terminal.stdout,
      interactive: true,
      exitOnCtrlC: false,
    }
  )

  await instance.waitUntilRenderFlush()
  terminal.stdin.write('i')
  await instance.waitUntilRenderFlush()
  terminal.stdin.write('\u001b[200~PASTED\nTEXT\u001b[201~')
  await instance.waitUntilRenderFlush()
  terminal.stdin.write('X')
  await instance.waitUntilRenderFlush()
  instance.unmount()
  await instance.waitUntilExit()

  assert.match(terminal.output.join(''), /Collage désactivé/)
  assert.match(terminal.output.join(''), /Xvalue/)
  assert.deepEqual(saved, [])
})

test('the editor accepts common AltGr characters through the Ink input seam', async () => {
  const terminal = createTerminalStreams()
  const instance = render(
    React.createElement(CodeEditorView, {
      challenge: exercise,
      initialCode: '',
      onSaveCode: async () => {},
      onTestLocally: () => {},
      onSubmitSolution: () => {},
      onBack: () => {},
    }),
    {
      ...createTuiRenderOptions({ alternateScreen: false }),
      stdin: terminal.stdin,
      stdout: terminal.stdout,
      interactive: true,
      exitOnCtrlC: false,
    }
  )

  await instance.waitUntilRenderFlush()
  terminal.stdin.write('i')
  await instance.waitUntilRenderFlush()
  for (const input of ['{', '}', '[', ']', '=', '@', '|']) {
    terminal.stdin.write(input)
    await instance.waitUntilRenderFlush()
  }
  instance.unmount()
  await instance.waitUntilExit()

  assert.match(terminal.output.join(''), /\{\}\[\]=@\|/)
})

test('the editor exposes replacement, prefix cancellation and redo through Ink', async () => {
  const terminal = createTerminalStreams()
  let backCount = 0
  const saved = []
  const instance = render(
    React.createElement(CodeEditorView, {
      challenge: exercise,
      initialCode: 'value',
      onSaveCode: async (code) => {
        saved.push(code)
      },
      onTestLocally: () => {},
      onSubmitSolution: () => {},
      onBack: () => {
        backCount += 1
      },
    }),
    {
      ...createTuiRenderOptions({ alternateScreen: false }),
      stdin: terminal.stdin,
      stdout: terminal.stdout,
      interactive: true,
      exitOnCtrlC: false,
    }
  )

  await instance.waitUntilRenderFlush()
  terminal.stdin.write('r')
  await instance.waitUntilRenderFlush()
  assert.match(terminal.output.join(''), /REMPLACEMENT/)

  terminal.stdin.write('X')
  await instance.waitUntilRenderFlush()
  terminal.stdin.write('u')
  await instance.waitUntilRenderFlush()
  terminal.stdin.write('\u0012')
  await instance.waitUntilRenderFlush()
  await new Promise((resolve) => setTimeout(resolve, 350))
  assert.equal(saved.at(-1), 'Xalue')

  terminal.stdin.write('d')
  await instance.waitUntilRenderFlush()
  terminal.stdin.write('\u001b')
  await new Promise((resolve) => setTimeout(resolve, 60))
  await instance.waitUntilRenderFlush()
  assert.equal(backCount, 0)

  instance.unmount()
  await instance.waitUntilExit()
})

test('an echoed autosave preserves the editor undo history', async () => {
  const terminal = createTerminalStreams()
  const tested = []
  const instance = render(
    React.createElement(EchoingEditor, {
      onTest: (code) => tested.push(code),
    }),
    {
      ...createTuiRenderOptions({ alternateScreen: false }),
      stdin: terminal.stdin,
      stdout: terminal.stdout,
      interactive: true,
      exitOnCtrlC: false,
    }
  )

  await instance.waitUntilRenderFlush()
  for (const input of ['i', 'X', '\u001b']) {
    terminal.stdin.write(input)
    await new Promise((resolve) => setTimeout(resolve, input === '\u001b' ? 60 : 0))
    await instance.waitUntilRenderFlush()
  }
  await new Promise((resolve) => setTimeout(resolve, 350))
  await instance.waitUntilRenderFlush()

  terminal.stdin.write('u')
  await instance.waitUntilRenderFlush()
  terminal.stdin.write('\u0014')
  await instance.waitUntilRenderFlush()
  assert.equal(tested.at(-1), 'value')

  instance.unmount()
  await instance.waitUntilExit()
})
