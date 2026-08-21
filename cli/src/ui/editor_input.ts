import type { EditorCommand, EditorMode } from '../editor_engine.js'
import { matchesShortcut } from './shortcut_catalog.js'

export interface InkKey {
  ctrl?: boolean
  meta?: boolean
  escape?: boolean
  return?: boolean
  backspace?: boolean
  delete?: boolean
  upArrow?: boolean
  downArrow?: boolean
  leftArrow?: boolean
  rightArrow?: boolean
}

export function editorEventFromInk(
  input: string,
  key: InkKey,
  mode: EditorMode
): EditorCommand | null {
  if (mode === 'normal' && matchesShortcut('vim-history', input, key)) {
    return key.ctrl ? { type: 'redo' } : { type: 'undo' }
  }
  if (matchesShortcut('back', input, key)) return { type: 'enter-normal' }
  if (matchesShortcut('editor-arrows', input, key)) {
    if (key.upArrow) return { type: 'move-visual', direction: 'up' }
    if (key.downArrow) return { type: 'move-visual', direction: 'down' }
    if (key.leftArrow) return { type: 'move-visual', direction: 'left' }
    if (key.rightArrow) return { type: 'move-visual', direction: 'right' }
  }

  if (mode === 'insert') {
    if (matchesShortcut('editor-line-break', input, key)) return { type: 'insert-line-break' }
    if (matchesShortcut('editor-delete', input, key)) return { type: 'backspace' }
    if (input && !/[\r\n]/.test(input) && (!key.ctrl || key.meta)) {
      return { type: 'insert-text', text: input }
    }
    return null
  }

  if (mode === 'replace') {
    if (input && !/[\r\n]/.test(input) && (!key.ctrl || key.meta)) {
      return { type: 'replace-text', text: input }
    }
    return null
  }

  if (input && !/[\r\n]/.test(input) && (!key.ctrl || key.meta)) {
    return { type: 'normal-key', key: input }
  }
  return null
}
