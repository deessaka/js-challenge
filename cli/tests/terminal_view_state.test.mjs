import assert from 'node:assert/strict'
import test from 'node:test'
import { PassThrough } from 'node:stream'
import React, { useState } from 'react'
import { render, Text } from 'ink'

import {
  GLOBAL_VIEW_SHORTCUTS,
  createTerminalViewState,
  getSelectedExercise,
  isGlobalInputOwner,
  reduceTerminalViewState,
  terminalViewEventForKey,
} from '../dist/ui/terminal_view_state.js'
import { LatestExerciseCodeRequest } from '../dist/ui/exercise_code_request.js'
import { useTerminalInput } from '../dist/ui/use_terminal_input.js'

const exercises = [
  {
    id: 'locked',
    slug: 'exercise-1',
    number: 1,
    title: 'Verrouillé',
    isUnlocked: false,
    isCompleted: false,
    progressStatus: 'locked',
  },
  {
    id: 'available',
    slug: 'exercise-2',
    number: 2,
    title: 'Disponible',
    isUnlocked: true,
    isCompleted: false,
    progressStatus: 'available',
  },
  {
    id: 'completed',
    slug: 'exercise-3',
    number: 3,
    title: 'Terminé',
    isUnlocked: true,
    isCompleted: true,
    progressStatus: 'completed',
  },
]

test('filtering selects the first visible exercise by identity', () => {
  const initial = createTerminalViewState(exercises)
  const next = reduceTerminalViewState(initial, { type: 'cycle-filter' }, exercises)

  assert.equal(next.filterMode, 'unlocked')
  assert.equal(next.selectedExerciseId, 'available')
  assert.equal(getSelectedExercise(next, exercises)?.id, 'available')
})

test('loading the catalog selects its first exercise explicitly', () => {
  const initial = createTerminalViewState()
  const next = reduceTerminalViewState(initial, { type: 'catalog-updated' }, exercises)

  assert.equal(next.selectedExerciseId, 'locked')
})

test('moving in a filtered catalog opens the exercise shown as selected', () => {
  let state = createTerminalViewState(exercises)
  state = reduceTerminalViewState(state, { type: 'cycle-filter' }, exercises)
  state = reduceTerminalViewState(state, { type: 'cycle-filter' }, exercises)

  assert.equal(state.filterMode, 'completed')
  assert.equal(state.selectedExerciseId, 'completed')

  state = reduceTerminalViewState(state, { type: 'open-selection' }, exercises)

  assert.equal(state.activeView, 'instructions')
  assert.equal(getSelectedExercise(state, exercises)?.title, 'Terminé')
})

test('search keeps a visible selection and otherwise selects the first result', () => {
  let state = createTerminalViewState(exercises)
  state = reduceTerminalViewState(state, { type: 'select-next' }, exercises)
  state = reduceTerminalViewState(
    state,
    { type: 'set-search-query', query: 'disponible' },
    exercises
  )

  assert.equal(state.selectedExerciseId, 'available')

  state = reduceTerminalViewState(state, { type: 'set-search-query', query: 'terminé' }, exercises)
  assert.equal(state.selectedExerciseId, 'completed')

  state = reduceTerminalViewState(state, { type: 'set-search-query', query: 'absent' }, exercises)
  assert.equal(state.selectedExerciseId, null)
})

test('catalog movement only traverses visible exercises', () => {
  let state = createTerminalViewState(exercises)
  state = reduceTerminalViewState(state, { type: 'cycle-filter' }, exercises)
  state = reduceTerminalViewState(state, { type: 'select-next' }, exercises)

  assert.equal(state.selectedExerciseId, 'available')
})

test('global view shortcuts come from one definition and respect locked exercises', () => {
  assert.deepEqual(
    GLOBAL_VIEW_SHORTCUTS.map(({ input, view }) => [input, view]),
    [
      ['1', 'catalog'],
      ['2', 'instructions'],
      ['3', 'editor'],
      ['4', 'tests'],
      ['?', 'help'],
    ]
  )

  let state = createTerminalViewState(exercises)
  assert.equal(terminalViewEventForKey('3'), null)
  const lockedEditorEvent = terminalViewEventForKey('3', true)
  assert.ok(lockedEditorEvent)
  state = reduceTerminalViewState(state, lockedEditorEvent, exercises)
  assert.equal(state.activeView, 'catalog')

  state = reduceTerminalViewState(state, terminalViewEventForKey('2', true), exercises)
  assert.equal(state.activeView, 'instructions')

  state = reduceTerminalViewState(state, terminalViewEventForKey('?'), exercises)
  assert.equal(state.activeView, 'help')
})

test('each non-editor view owns global input while the editor owns its input exclusively', () => {
  const state = { ...createTerminalViewState(exercises), selectedExerciseId: 'available' }

  for (const view of ['catalog', 'instructions', 'tests', 'help']) {
    assert.equal(isGlobalInputOwner({ ...state, activeView: view }, false), true)
  }
  assert.equal(isGlobalInputOwner({ ...state, activeView: 'editor' }, false), false)
  assert.equal(isGlobalInputOwner({ ...state, activeView: 'editor' }, false, false), true)
  assert.equal(isGlobalInputOwner(state, true), false)
})

test('all five terminal views are reachable for an available exercise', () => {
  let state = { ...createTerminalViewState(exercises), selectedExerciseId: 'available' }

  for (const shortcut of GLOBAL_VIEW_SHORTCUTS) {
    state = reduceTerminalViewState(state, { type: 'select-view', view: shortcut.view }, exercises)
    assert.equal(state.activeView, shortcut.view)
  }
})

test('back navigation follows the terminal view hierarchy', () => {
  let state = { ...createTerminalViewState(exercises), selectedExerciseId: 'available' }

  state = reduceTerminalViewState(state, { type: 'select-view', view: 'tests' }, exercises)
  state = reduceTerminalViewState(state, { type: 'back' }, exercises)
  assert.equal(state.activeView, 'editor')

  state = reduceTerminalViewState(state, { type: 'back' }, exercises)
  assert.equal(state.activeView, 'instructions')

  state = reduceTerminalViewState(state, { type: 'back' }, exercises)
  assert.equal(state.activeView, 'catalog')
})

test('a late exercise load cannot replace the code selected more recently', async () => {
  const pending = new Map()
  const applied = []
  const requests = new LatestExerciseCodeRequest()
  const loadCode = (exercise) =>
    new Promise((resolve) => {
      pending.set(exercise.id, resolve)
    })

  const first = requests.load(exercises[0], loadCode, (code) => applied.push(code))
  const second = requests.load(exercises[1], loadCode, (code) => applied.push(code))

  pending.get('available')('code récent')
  assert.equal(await second, true)
  pending.get('locked')('code obsolète')
  assert.equal(await first, false)
  assert.deepEqual(applied, ['code récent'])
})

test('only the current exercise load can report an error', async () => {
  const pending = new Map()
  const errors = []
  const requests = new LatestExerciseCodeRequest()
  const loadCode = (exercise) =>
    new Promise((resolve, reject) => {
      pending.set(exercise.id, { resolve, reject })
    })

  const first = requests.load(
    exercises[0],
    loadCode,
    () => undefined,
    (error) => errors.push(error.message)
  )
  const second = requests.load(
    exercises[1],
    loadCode,
    () => undefined,
    (error) => errors.push(error.message)
  )

  pending.get('locked').reject(new Error('erreur obsolète'))
  assert.equal(await first, false)
  pending.get('available').reject(new Error('erreur courante'))
  assert.equal(await second, true)
  assert.deepEqual(errors, ['erreur courante'])
})

test('Ink input switches the rendered terminal view through the public input owner', async () => {
  const stdin = new PassThrough()
  stdin.isTTY = true
  stdin.setRawMode = () => undefined
  stdin.ref = () => undefined
  stdin.unref = () => undefined
  const stdout = new PassThrough()
  stdout.columns = 120
  stdout.rows = 40
  const output = []
  stdout.on('data', (chunk) => output.push(chunk.toString()))

  const Harness = () => {
    const [state, setState] = useState(() => createTerminalViewState(exercises))
    useTerminalInput({
      state,
      isAuthenticating: false,
      editorOwnsInput: false,
      selectedExercise: getSelectedExercise(state, exercises),
      dispatch: (event) =>
        setState((current) => reduceTerminalViewState(current, event, exercises)),
      exit: () => undefined,
      runTest: () => undefined,
      submit: () => undefined,
      toggleWatch: () => undefined,
    })
    return React.createElement(Text, null, state.activeView)
  }

  const instance = render(React.createElement(Harness), {
    stdin,
    stdout,
    stderr: new PassThrough(),
    debug: true,
    patchConsole: false,
  })

  await new Promise((resolve) => setTimeout(resolve, 10))
  stdin.write('?')
  await new Promise((resolve) => setTimeout(resolve, 25))
  instance.unmount()

  assert.match(output.join(''), /help/)
})

test('Ctrl+1 through Ctrl+4 switch views even while catalog search owns input', async () => {
  const stdin = new PassThrough()
  stdin.isTTY = true
  stdin.setRawMode = () => undefined
  stdin.ref = () => undefined
  stdin.unref = () => undefined
  const stdout = new PassThrough()
  stdout.columns = 120
  stdout.rows = 40
  const output = []
  stdout.on('data', (chunk) => output.push(chunk.toString()))

  const Harness = () => {
    const [state, setState] = useState(() => ({
      ...createTerminalViewState(exercises),
      selectedExerciseId: 'available',
      isSearching: true,
    }))
    useTerminalInput({
      state,
      isAuthenticating: false,
      editorOwnsInput: false,
      selectedExercise: getSelectedExercise(state, exercises),
      dispatch: (event) =>
        setState((current) => reduceTerminalViewState(current, event, exercises)),
      exit: () => undefined,
      runTest: () => undefined,
      submit: () => undefined,
      toggleWatch: () => undefined,
    })
    return React.createElement(Text, null, `${state.activeView}:${state.searchQuery}`)
  }

  const instance = render(React.createElement(Harness), {
    stdin,
    stdout,
    stderr: new PassThrough(),
    debug: true,
    patchConsole: false,
  })

  await new Promise((resolve) => setTimeout(resolve, 10))
  stdin.write('\u001b[50;5u')
  await new Promise((resolve) => setTimeout(resolve, 25))
  instance.unmount()

  assert.match(output.join(''), /instructions:/)
  assert.doesNotMatch(output.join(''), /catalog:2/)
})
