export type EditorMode = 'normal' | 'insert' | 'replace'

export interface EditorPosition {
  row: number
  column: number
}

export interface EditorState {
  lines: readonly string[]
  cursor: EditorPosition
  mode: EditorMode
}

export type EditorCommand =
  | { type: 'enter-insert' }
  | { type: 'enter-normal' }
  | { type: 'insert-text'; text: string }
  | { type: 'insert-line-break' }
  | { type: 'backspace' }
  | { type: 'delete-character' }
  | { type: 'move'; direction: 'up' | 'down' | 'left' | 'right' }
  | { type: 'move-line-start' }
  | { type: 'move-line-end' }

export type EditorEffect =
  | { type: 'document-changed'; text: string }

export interface EditorUpdate {
  state: EditorState
  effects: readonly EditorEffect[]
}

export function createEditorState(text: string): EditorState {
  const lines = text.split(/\r?\n/)
  return {
    lines: lines.length > 0 ? lines : [''],
    cursor: { row: 0, column: 0 },
    mode: 'normal',
  }
}

export function editorText(state: EditorState): string {
  return state.lines.join('\n')
}

export function reduceEditor(state: EditorState, command: EditorCommand): EditorUpdate {
  if (command.type === 'enter-insert') {
    return unchanged({ ...state, mode: 'insert' })
  }

  if (command.type === 'enter-normal') {
    return unchanged({ ...state, mode: 'normal' })
  }

  if (command.type === 'move') {
    return unchanged(moveCursor(state, command.direction))
  }

  if (command.type === 'move-line-start') {
    return unchanged({ ...state, cursor: { ...state.cursor, column: 0 } })
  }

  if (command.type === 'move-line-end') {
    return unchanged({
      ...state,
      cursor: { ...state.cursor, column: currentLine(state).length },
    })
  }

  if (command.type === 'insert-text' && command.text.length > 0) {
    const line = currentLine(state)
    const nextLine =
      line.slice(0, state.cursor.column) + command.text + line.slice(state.cursor.column)
    return changed(
      replaceCurrentLine(state, nextLine, state.cursor.column + command.text.length),
    )
  }

  if (command.type === 'insert-line-break') {
    const line = currentLine(state)
    const before = line.slice(0, state.cursor.column)
    const after = line.slice(state.cursor.column)
    const lines = [...state.lines]
    lines.splice(state.cursor.row, 1, before, after)
    return changed({
      ...state,
      lines,
      cursor: { row: state.cursor.row + 1, column: 0 },
    })
  }

  if (command.type === 'backspace') {
    if (state.cursor.column > 0) {
      const line = currentLine(state)
      const nextLine =
        line.slice(0, state.cursor.column - 1) + line.slice(state.cursor.column)
      return changed(replaceCurrentLine(state, nextLine, state.cursor.column - 1))
    }
    if (state.cursor.row > 0) {
      const previous = state.lines[state.cursor.row - 1] ?? ''
      const line = currentLine(state)
      const lines = [...state.lines]
      lines.splice(state.cursor.row - 1, 2, previous + line)
      return changed({
        ...state,
        lines,
        cursor: { row: state.cursor.row - 1, column: previous.length },
      })
    }
  }

  if (command.type === 'delete-character') {
    const line = currentLine(state)
    if (state.cursor.column < line.length) {
      const nextLine =
        line.slice(0, state.cursor.column) + line.slice(state.cursor.column + 1)
      return changed(replaceCurrentLine(state, nextLine, state.cursor.column))
    }
  }

  return unchanged(state)
}

function moveCursor(
  state: EditorState,
  direction: Extract<EditorCommand, { type: 'move' }>['direction'],
): EditorState {
  if (direction === 'left') {
    return {
      ...state,
      cursor: { ...state.cursor, column: Math.max(0, state.cursor.column - 1) },
    }
  }
  if (direction === 'right') {
    return {
      ...state,
      cursor: {
        ...state.cursor,
        column: Math.min(currentLine(state).length, state.cursor.column + 1),
      },
    }
  }

  const row = Math.min(
    state.lines.length - 1,
    Math.max(0, state.cursor.row + (direction === 'up' ? -1 : 1)),
  )
  return {
    ...state,
    cursor: {
      row,
      column: Math.min(state.cursor.column, state.lines[row]?.length ?? 0),
    },
  }
}

function currentLine(state: EditorState): string {
  return state.lines[state.cursor.row] ?? ''
}

function replaceCurrentLine(state: EditorState, line: string, column: number): EditorState {
  const lines = [...state.lines]
  lines[state.cursor.row] = line
  return { ...state, lines, cursor: { ...state.cursor, column } }
}

function unchanged(state: EditorState): EditorUpdate {
  return { state, effects: [] }
}

function changed(state: EditorState): EditorUpdate {
  return {
    state,
    effects: [{ type: 'document-changed', text: editorText(state) }],
  }
}
