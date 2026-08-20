import type { EditorCommand, EditorMode } from '../editor_engine.js'

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
  if (mode === 'normal' && key.ctrl && input === 'r') return { type: 'redo' }
  if (key.escape) return { type: 'enter-normal' }
  if (key.upArrow) {
    return mode === 'normal' ? { type: 'normal-key', key: 'k' } : { type: 'move', direction: 'up' }
  }
  if (key.downArrow) {
    return mode === 'normal'
      ? { type: 'normal-key', key: 'j' }
      : { type: 'move', direction: 'down' }
  }
  if (key.leftArrow) {
    return mode === 'normal'
      ? { type: 'normal-key', key: 'h' }
      : { type: 'move', direction: 'left' }
  }
  if (key.rightArrow) {
    return mode === 'normal'
      ? { type: 'normal-key', key: 'l' }
      : { type: 'move', direction: 'right' }
  }

  if (mode === 'insert') {
    if (key.return) return { type: 'insert-line-break' }
    if (key.backspace || key.delete) return { type: 'backspace' }
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

  if (input === 'u' && !key.ctrl && !key.meta) return { type: 'undo' }
  if (input && !/[\r\n]/.test(input) && (!key.ctrl || key.meta)) {
    return { type: 'normal-key', key: input }
  }
  return null
}
