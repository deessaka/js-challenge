import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createEditorState,
  reduceEditor,
} from '../dist/editor_engine.js'
import { editorEventFromInk } from '../dist/ui/editor_input.js'

test('the headless editor owns document, cursor and mode transitions', () => {
  let state = createEditorState('const value = 1')

  ;({ state } = reduceEditor(state, { type: 'enter-insert' }))
  assert.equal(state.mode, 'insert')

  const result = reduceEditor(state, { type: 'insert-text', text: 'X' })
  assert.equal(result.state.lines.join('\n'), 'Xconst value = 1')
  assert.deepEqual(result.state.cursor, { row: 0, column: 1 })
  assert.deepEqual(result.effects, [
    { type: 'document-changed', text: 'Xconst value = 1' },
  ])
})

test('simple deletion and movement preserve valid positions', () => {
  let state = createEditorState('ab\ncd')
  ;({ state } = reduceEditor(state, { type: 'enter-insert' }))
  ;({ state } = reduceEditor(state, { type: 'move', direction: 'right' }))
  ;({ state } = reduceEditor(state, { type: 'move', direction: 'down' }))
  assert.deepEqual(state.cursor, { row: 1, column: 1 })

  const result = reduceEditor(state, { type: 'backspace' })
  assert.equal(result.state.lines.join('\n'), 'ab\nd')
  assert.deepEqual(result.state.cursor, { row: 1, column: 0 })
})

test('the Ink adapter translates input without owning editor state', () => {
  assert.deepEqual(
    editorEventFromInk('x', {}, 'insert'),
    { type: 'insert-text', text: 'x' },
  )
  assert.deepEqual(
    editorEventFromInk('', { leftArrow: true }, 'insert'),
    { type: 'move', direction: 'left' },
  )
  assert.deepEqual(
    editorEventFromInk('i', {}, 'normal'),
    { type: 'enter-insert' },
  )
})
