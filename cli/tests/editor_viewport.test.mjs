import assert from 'node:assert/strict'
import test from 'node:test'

import { layoutViewport, moveVisualPosition } from '../dist/editor_viewport.js'

test('the viewport wraps Unicode lines by terminal cells without splitting graphemes', () => {
  const viewport = layoutViewport({
    lines: ['ab界c', `a\u200bb`, ''],
    cursor: { row: 0, grapheme: 2 },
    mode: 'normal',
    width: 4,
    height: 5,
    scrollTop: 0,
  })

  assert.deepEqual(
    viewport.visibleLines.map((line) => ({
      text: line.text,
      logicalRow: line.logicalRow,
      startGrapheme: line.startGrapheme,
      endGrapheme: line.endGrapheme,
      continuation: line.continuation,
    })),
    [
      {
        text: 'ab界',
        logicalRow: 0,
        startGrapheme: 0,
        endGrapheme: 3,
        continuation: false,
      },
      {
        text: 'c',
        logicalRow: 0,
        startGrapheme: 3,
        endGrapheme: 4,
        continuation: true,
      },
      {
        text: `a\u200bb`,
        logicalRow: 1,
        startGrapheme: 0,
        endGrapheme: 3,
        continuation: false,
      },
      {
        text: '',
        logicalRow: 2,
        startGrapheme: 0,
        endGrapheme: 0,
        continuation: false,
      },
    ]
  )
  assert.deepEqual(viewport.cursor, { row: 0, column: 2 })
  assert.equal(viewport.totalVisualLines, 4)
})

test('an Insertion cursor at an exact wrap boundary gets a visible continuation row', () => {
  const viewport = layoutViewport({
    lines: ['abcd'],
    cursor: { row: 0, grapheme: 4 },
    mode: 'insert',
    width: 2,
    height: 3,
    scrollTop: 0,
  })

  assert.deepEqual(
    viewport.visibleLines.map((line) => line.text),
    ['ab', 'cd', '']
  )
  assert.deepEqual(viewport.cursor, { row: 2, column: 0 })
})

test('visual movement crosses wrapped rows before logical rows', () => {
  const first = moveVisualPosition({
    lines: ['abcdef', 'xy'],
    cursor: { row: 0, grapheme: 1 },
    mode: 'normal',
    width: 3,
    direction: 'down',
    preferredColumn: null,
  })
  assert.deepEqual(first, {
    cursor: { row: 0, grapheme: 4 },
    preferredColumn: 1,
  })

  const second = moveVisualPosition({
    lines: ['abcdef', 'xy'],
    cursor: first.cursor,
    mode: 'normal',
    width: 3,
    direction: 'down',
    preferredColumn: first.preferredColumn,
  })
  assert.deepEqual(second, {
    cursor: { row: 1, grapheme: 1 },
    preferredColumn: 1,
  })
})

test('resize recomputes wrapping and scroll without changing the logical cursor', () => {
  const narrow = layoutViewport({
    lines: ['abcd', 'efgh'],
    cursor: { row: 1, grapheme: 3 },
    mode: 'normal',
    width: 2,
    height: 2,
    scrollTop: 0,
  })
  assert.equal(narrow.scrollTop, 2)
  assert.deepEqual(narrow.cursor, { row: 1, column: 1 })
  assert.deepEqual(
    narrow.visibleLines.map((line) => line.text),
    ['ef', 'gh']
  )

  const wide = layoutViewport({
    lines: ['abcd', 'efgh'],
    cursor: { row: 1, grapheme: 3 },
    mode: 'normal',
    width: 8,
    height: 2,
    scrollTop: narrow.scrollTop,
  })
  assert.equal(wide.scrollTop, 0)
  assert.deepEqual(wide.cursor, { row: 1, column: 3 })
  assert.deepEqual(
    wide.visibleLines.map((line) => line.text),
    ['abcd', 'efgh']
  )
})
