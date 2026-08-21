import assert from 'node:assert/strict'
import test from 'node:test'

import { createEditorState, editorText, reduceEditor } from '../dist/editor_engine.js'
import {
  graphemeIndexToTerminalColumn,
  graphemeIndexToUtf16Offset,
  splitGraphemes,
  utf16OffsetToGraphemeIndex,
} from '../dist/unicode_text.js'
import { editorEventFromInk } from '../dist/ui/editor_input.js'

test('the headless editor owns document, cursor and mode transitions', () => {
  let state = createEditorState('const value = 1')

  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'i' }))
  assert.equal(state.mode, 'insert')

  const result = reduceEditor(state, { type: 'insert-text', text: 'X' })
  assert.equal(result.state.lines.join('\n'), 'Xconst value = 1')
  assert.deepEqual(result.state.cursor, { row: 0, grapheme: 1 })
  assert.deepEqual(result.effects, [{ type: 'document-changed', text: 'Xconst value = 1' }])
})

test('simple deletion and movement preserve valid positions', () => {
  let state = createEditorState('ab\ncd')
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'i' }))
  ;({ state } = reduceEditor(state, { type: 'move-visual', direction: 'right' }))
  ;({ state } = reduceEditor(state, { type: 'move-visual', direction: 'down' }))
  assert.deepEqual(state.cursor, { row: 1, grapheme: 1 })

  const result = reduceEditor(state, { type: 'backspace' })
  assert.equal(result.state.lines.join('\n'), 'ab\nd')
  assert.deepEqual(result.state.cursor, { row: 1, grapheme: 0 })
})

test('the Ink adapter translates input without owning editor state', () => {
  assert.deepEqual(editorEventFromInk('x', {}, 'insert'), { type: 'insert-text', text: 'x' })
  assert.deepEqual(editorEventFromInk('', { leftArrow: true }, 'insert'), {
    type: 'move-visual',
    direction: 'left',
  })
  assert.deepEqual(editorEventFromInk('i', {}, 'normal'), { type: 'normal-key', key: 'i' })
})

test('the Ink adapter exposes Vim prefixes, replacement and redo to the engine', () => {
  assert.deepEqual(editorEventFromInk('d', {}, 'normal'), {
    type: 'normal-key',
    key: 'd',
  })
  assert.deepEqual(editorEventFromInk('u', {}, 'normal'), { type: 'undo' })
  assert.deepEqual(editorEventFromInk('r', { ctrl: true }, 'normal'), { type: 'redo' })
  assert.deepEqual(editorEventFromInk('界', {}, 'replace'), {
    type: 'replace-text',
    text: '界',
  })
  assert.deepEqual(editorEventFromInk('', { downArrow: true }, 'normal'), {
    type: 'move-visual',
    direction: 'down',
  })
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
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'i' }))
  ;({ state } = reduceEditor(state, { type: 'insert-text', text: 'e\u0301👩‍💻界' }))
  assert.deepEqual(state.cursor, { row: 0, grapheme: 3 })
  ;({ state } = reduceEditor(state, { type: 'move-visual', direction: 'left' }))
  const result = reduceEditor(state, { type: 'backspace' })

  assert.equal(result.state.lines.join('\n'), 'e\u0301界')
  assert.deepEqual(result.state.cursor, { row: 0, grapheme: 1 })
})

test('printable AltGr text wins over ambiguous legacy modifiers', () => {
  for (const input of ['{', '}', '[', ']', '=', '|', '@']) {
    assert.deepEqual(editorEventFromInk(input, { ctrl: true, meta: true }, 'insert'), {
      type: 'insert-text',
      text: input,
    })
  }
})

test('a multi-character IME commit remains printable input', () => {
  const event = editorEventFromInk('漢字', {}, 'insert')
  assert.deepEqual(event, { type: 'insert-text', text: '漢字' })

  let state = createEditorState('')
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'i' }))
  ;({ state } = reduceEditor(state, event))
  assert.equal(state.lines.join('\n'), '漢字')
  assert.deepEqual(state.cursor, { row: 0, grapheme: 2 })
})

test('Vim Normal movements follow words, lines and document edges', () => {
  let state = createEditorState('  alpha beta\nx\nomega')

  for (const key of ['w', 'w', 'b', '$', 'j', 'j', '0', 'g', 'g', 'G']) {
    ;({ state } = reduceEditor(state, { type: 'normal-key', key }))
  }

  assert.equal(editorText(state), '  alpha beta\nx\nomega')
  assert.deepEqual(state.cursor, { row: 2, grapheme: 0 })
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'g' }))
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'k' }))
  assert.deepEqual(state.cursor, { row: 1, grapheme: 0 })
})

test('logical vertical movement preserves the preferred Vim column', () => {
  let state = createEditorState('abcd\nx\nwxyz')
  for (const key of ['l', 'l', 'l', 'j', 'j']) {
    ;({ state } = reduceEditor(state, { type: 'normal-key', key }))
  }
  assert.deepEqual(state.cursor, { row: 2, grapheme: 3 })
})

test('arrows and gj move visually while j remains a logical movement', () => {
  let visual = createEditorState('abcdef\nxy')
  ;({ state: visual } = reduceEditor(visual, { type: 'set-viewport-width', width: 3 }))
  ;({ state: visual } = reduceEditor(visual, { type: 'normal-key', key: 'l' }))
  ;({ state: visual } = reduceEditor(visual, { type: 'move-visual', direction: 'down' }))
  assert.deepEqual(visual.cursor, { row: 0, grapheme: 4 })

  let logical = createEditorState('abcdef\nxy')
  ;({ state: logical } = reduceEditor(logical, { type: 'set-viewport-width', width: 3 }))
  ;({ state: logical } = reduceEditor(logical, { type: 'normal-key', key: 'l' }))
  ;({ state: logical } = reduceEditor(logical, { type: 'normal-key', key: 'j' }))
  assert.deepEqual(logical.cursor, { row: 1, grapheme: 1 })

  let wrapped = createEditorState('abcdef\nxy')
  ;({ state: wrapped } = reduceEditor(wrapped, { type: 'set-viewport-width', width: 3 }))
  ;({ state: wrapped } = reduceEditor(wrapped, { type: 'normal-key', key: 'l' }))
  ;({ state: wrapped } = reduceEditor(wrapped, { type: 'normal-key', key: 'g' }))
  ;({ state: wrapped } = reduceEditor(wrapped, { type: 'normal-key', key: 'j' }))
  assert.deepEqual(wrapped.cursor, { row: 0, grapheme: 4 })
})

test('Vim insertion entry points place text at their documented locations', () => {
  const scenarios = [
    { key: 'i', initial: 'abc', before: [], expected: 'Xabc' },
    { key: 'I', initial: '  abc', before: ['G', '$'], expected: '  Xabc' },
    { key: 'a', initial: 'abc', before: [], expected: 'aXbc' },
    { key: 'A', initial: 'abc', before: [], expected: 'abcX' },
    { key: 'o', initial: 'abc', before: [], expected: 'abc\nX' },
    { key: 'O', initial: 'abc', before: [], expected: 'X\nabc' },
  ]

  for (const scenario of scenarios) {
    let state = createEditorState(scenario.initial)
    for (const key of scenario.before) {
      ;({ state } = reduceEditor(state, { type: 'normal-key', key }))
    }
    ;({ state } = reduceEditor(state, { type: 'normal-key', key: scenario.key }))
    assert.equal(state.mode, 'insert', scenario.key)
    ;({ state } = reduceEditor(state, { type: 'insert-text', text: 'X' }))
    ;({ state } = reduceEditor(state, { type: 'enter-normal' }))
    assert.equal(editorText(state), scenario.expected, scenario.key)
    assert.equal(state.mode, 'normal', scenario.key)
  }
})

test('Vim replacement and operator commands mutate complete Normal intentions', () => {
  const scenarios = [
    { keys: ['x'], initial: 'abc', expected: 'bc', mode: 'normal' },
    { keys: ['r'], text: 'X', initial: 'abc', expected: 'Xbc', mode: 'normal' },
    { keys: ['d', 'd'], initial: 'one\ntwo', expected: 'two', mode: 'normal' },
    { keys: ['d', 'w'], initial: 'one two', expected: 'two', mode: 'normal' },
    { keys: ['w', 'd', '$'], initial: 'one two', expected: 'one ', mode: 'normal' },
    { keys: ['c', 'c'], text: 'X', initial: 'one\ntwo', expected: 'X\ntwo', mode: 'insert' },
    { keys: ['c', 'w'], text: 'X', initial: 'one two', expected: 'X two', mode: 'insert' },
    { keys: ['w', 'c', '$'], text: 'X', initial: 'one two', expected: 'one X', mode: 'insert' },
  ]

  for (const scenario of scenarios) {
    let state = createEditorState(scenario.initial)
    for (const key of scenario.keys) {
      ;({ state } = reduceEditor(state, { type: 'normal-key', key }))
    }
    if (scenario.keys.at(-1) === 'r') {
      assert.equal(state.mode, 'replace')
      ;({ state } = reduceEditor(state, { type: 'replace-text', text: scenario.text }))
    } else if (scenario.text) {
      assert.equal(state.mode, 'insert')
      ;({ state } = reduceEditor(state, { type: 'insert-text', text: scenario.text }))
    }
    assert.equal(editorText(state), scenario.expected, scenario.keys.join(''))
    assert.equal(state.mode, scenario.mode, scenario.keys.join(''))
  }
})

test('undo and redo treat one Insertion session as one transaction', () => {
  let state = createEditorState('value')
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'A' }))
  ;({ state } = reduceEditor(state, { type: 'insert-text', text: ' + 1' }))
  ;({ state } = reduceEditor(state, { type: 'insert-line-break' }))
  ;({ state } = reduceEditor(state, { type: 'insert-text', text: '// fin' }))
  ;({ state } = reduceEditor(state, { type: 'enter-normal' }))
  assert.equal(editorText(state), 'value + 1\n// fin')
  ;({ state } = reduceEditor(state, { type: 'undo' }))
  assert.equal(editorText(state), 'value')
  assert.equal(state.mode, 'normal')
  ;({ state } = reduceEditor(state, { type: 'redo' }))
  assert.equal(editorText(state), 'value + 1\n// fin')
  assert.equal(state.mode, 'normal')
})

test('each completed Normal command is an independent undo transaction', () => {
  let state = createEditorState('abc def')
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'x' }))
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'd' }))
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'w' }))
  assert.equal(editorText(state), 'def')
  ;({ state } = reduceEditor(state, { type: 'undo' }))
  assert.equal(editorText(state), 'bc def')
  ;({ state } = reduceEditor(state, { type: 'undo' }))
  assert.equal(editorText(state), 'abc def')
  ;({ state } = reduceEditor(state, { type: 'redo' }))
  ;({ state } = reduceEditor(state, { type: 'redo' }))
  assert.equal(editorText(state), 'def')
})

test('a change operator and its following Insertion form one transaction', () => {
  let state = createEditorState('old value')
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'c' }))
  ;({ state } = reduceEditor(state, { type: 'normal-key', key: 'w' }))
  ;({ state } = reduceEditor(state, { type: 'insert-text', text: 'new' }))
  ;({ state } = reduceEditor(state, { type: 'enter-normal' }))
  assert.equal(editorText(state), 'new value')
  ;({ state } = reduceEditor(state, { type: 'undo' }))
  assert.equal(editorText(state), 'old value')
})

test('Escape cancels incomplete prefixes and replacement without mutation', () => {
  for (const key of ['g', 'd', 'c', 'r']) {
    let state = createEditorState('value')
    ;({ state } = reduceEditor(state, { type: 'normal-key', key }))
    const result = reduceEditor(state, { type: 'enter-normal' })
    assert.equal(editorText(result.state), 'value', key)
    assert.equal(result.state.mode, 'normal', key)
    assert.equal(result.state.pendingNormal, null, key)
    assert.deepEqual(result.effects, [], key)
  }
})

test('unsupported Normal input never partially mutates the document', () => {
  let state = createEditorState('value')
  for (const keys of [['z'], ['d', 'j'], ['c', 'x'], ['g', 'x']]) {
    let scenario = state
    let effects = []
    for (const key of keys) {
      const update = reduceEditor(scenario, { type: 'normal-key', key })
      scenario = update.state
      effects = [...effects, ...update.effects]
    }
    assert.equal(editorText(scenario), 'value', keys.join(''))
    assert.deepEqual(effects, [], keys.join(''))
  }

  const invalid = reduceEditor(state, { type: 'insert-text', text: 'X' })
  assert.equal(editorText(invalid.state), 'value')
  assert.deepEqual(invalid.effects, [])
})
