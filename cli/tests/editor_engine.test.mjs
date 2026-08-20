import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createEditorState,
  reduceEditor,
} from '../dist/editor_engine.js'
import {
  graphemeIndexToTerminalColumn,
  graphemeIndexToUtf16Offset,
  splitGraphemes,
  utf16OffsetToGraphemeIndex,
} from '../dist/unicode_text.js'
import { editorEventFromInk } from '../dist/ui/editor_input.js'

test('the headless editor owns document, cursor and mode transitions', () => {
  let state = createEditorState('const value = 1')

  ;({ state } = reduceEditor(state, { type: 'enter-insert' }))
  assert.equal(state.mode, 'insert')

  const result = reduceEditor(state, { type: 'insert-text', text: 'X' })
  assert.equal(result.state.lines.join('\n'), 'Xconst value = 1')
  assert.deepEqual(result.state.cursor, { row: 0, grapheme: 1 })
  assert.deepEqual(result.effects, [
    { type: 'document-changed', text: 'Xconst value = 1' },
  ])
})

test('simple deletion and movement preserve valid positions', () => {
  let state = createEditorState('ab\ncd')
  ;({ state } = reduceEditor(state, { type: 'enter-insert' }))
  ;({ state } = reduceEditor(state, { type: 'move', direction: 'right' }))
  ;({ state } = reduceEditor(state, { type: 'move', direction: 'down' }))
  assert.deepEqual(state.cursor, { row: 1, grapheme: 1 })

  const result = reduceEditor(state, { type: 'backspace' })
  assert.equal(result.state.lines.join('\n'), 'ab\nd')
  assert.deepEqual(result.state.cursor, { row: 1, grapheme: 0 })
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

test('Unicode positions convert between graphemes, UTF-16 and terminal cells', () => {
  const text = `Ae\u0301界👩🏽‍💻`

  assert.deepEqual(splitGraphemes(text), ['A', 'e\u0301', '界', '👩🏽‍💻'])
  assert.equal(graphemeIndexToUtf16Offset(text, 2), 3)
  assert.equal(utf16OffsetToGraphemeIndex(text, 2), 1)
  assert.equal(utf16OffsetToGraphemeIndex(text, 3), 2)
  assert.equal(graphemeIndexToTerminalColumn(text, 4), 6)
})

test('movement and deletion never split a Unicode grapheme', () => {
  let state = createEditorState('')
  ;({ state } = reduceEditor(state, { type: 'enter-insert' }))
  ;({ state } = reduceEditor(state, { type: 'insert-text', text: 'e\u0301👩‍💻界' }))
  assert.deepEqual(state.cursor, { row: 0, grapheme: 3 })

  ;({ state } = reduceEditor(state, { type: 'move', direction: 'left' }))
  const result = reduceEditor(state, { type: 'backspace' })

  assert.equal(result.state.lines.join('\n'), 'e\u0301界')
  assert.deepEqual(result.state.cursor, { row: 0, grapheme: 1 })
})

test('printable AltGr text wins over ambiguous legacy modifiers', () => {
  for (const input of ['{', '}', '[', ']', '=', '|', '@']) {
    assert.deepEqual(
      editorEventFromInk(input, { ctrl: true, meta: true }, 'insert'),
      { type: 'insert-text', text: input },
    )
  }
})

test('a multi-character IME commit remains printable input', () => {
  const event = editorEventFromInk('漢字', {}, 'insert')
  assert.deepEqual(event, { type: 'insert-text', text: '漢字' })

  let state = createEditorState('')
  ;({ state } = reduceEditor(state, { type: 'enter-insert' }))
  ;({ state } = reduceEditor(state, event))
  assert.equal(state.lines.join('\n'), '漢字')
  assert.deepEqual(state.cursor, { row: 0, grapheme: 2 })
})
