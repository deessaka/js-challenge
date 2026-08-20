import assert from 'node:assert/strict'
import test from 'node:test'

import {
  GLOBAL_VIEW_SHORTCUTS,
  HELP_SHORTCUT_GROUPS,
  TERMINAL_SHORTCUTS,
  matchesShortcut,
  shortcutHint,
} from '../dist/ui/shortcut_catalog.js'

test('every active shortcut is documented exactly once in Help', () => {
  const documented = HELP_SHORTCUT_GROUPS.flatMap((group) => group.shortcuts)

  assert.deepEqual(documented.toSorted(), Object.keys(TERMINAL_SHORTCUTS).toSorted())
  assert.equal(new Set(documented).size, documented.length)
})

test('the global terminal views expose Ctrl+1 through Ctrl+4 and Help from one contract', () => {
  assert.deepEqual(
    GLOBAL_VIEW_SHORTCUTS.map(({ id, view, keys, label }) => [id, view, keys, label]),
    [
      ['view-catalog', 'catalog', 'Ctrl+1', 'Exercices'],
      ['view-instructions', 'instructions', 'Ctrl+2', 'Consignes'],
      ['view-editor', 'editor', 'Ctrl+3', 'Éditeur'],
      ['view-tests', 'tests', 'Ctrl+4', 'Tests'],
      ['view-help', 'help', '?', 'Aide'],
    ]
  )
})

test('modifier-aware matching distinguishes search from filtering', () => {
  assert.equal(matchesShortcut('catalog-search', 'f', { ctrl: true }), true)
  assert.equal(matchesShortcut('catalog-search', '/', {}), true)
  assert.equal(matchesShortcut('catalog-filter', 'f', {}), true)
  assert.equal(matchesShortcut('catalog-filter', 'f', { ctrl: true }), false)
  assert.equal(matchesShortcut('catalog-filter', 'F', {}), false)
})

test('shared footer hints render the catalog labels verbatim', () => {
  assert.equal(shortcutHint('editor-save'), '[Ctrl+S] Sauvegarder')
  assert.equal(shortcutHint('editor-test'), '[Ctrl+T] Tester')
  assert.equal(shortcutHint('editor-submit'), '[Ctrl+Entrée] Soumettre')
})

test('the shortcut contract contains no legacy Watch or external-editor path', () => {
  const contract = JSON.stringify(TERMINAL_SHORTCUTS)

  assert.doesNotMatch(contract, /watch|éditeur externe|external editor/i)
})
