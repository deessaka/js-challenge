import stringWidth from 'string-width'

import { splitGraphemes } from './unicode_text.js'

export type ViewportMode = 'normal' | 'insert' | 'replace'

export interface ViewportPosition {
  row: number
  grapheme: number
}

export interface VisualLine {
  text: string
  logicalRow: number
  startGrapheme: number
  endGrapheme: number
  continuation: boolean
}

export interface ViewportLayout {
  visibleLines: readonly VisualLine[]
  cursor: { row: number; column: number }
  scrollTop: number
  totalVisualLines: number
}

export interface ViewportInput {
  lines: readonly string[]
  cursor: ViewportPosition
  mode: ViewportMode
  width: number
  height: number
  scrollTop: number
}

export interface VisualMovementInput {
  lines: readonly string[]
  cursor: ViewportPosition
  mode: ViewportMode
  width: number
  direction: 'up' | 'down'
  preferredColumn: number | null
}

export interface VisualMovement {
  cursor: ViewportPosition
  preferredColumn: number
}

export function layoutViewport(input: ViewportInput): ViewportLayout {
  const width = Math.max(1, Math.floor(input.width))
  const height = Math.max(1, Math.floor(input.height))
  const visualLines = buildVisualLines(input)
  const absoluteCursor = locateCursor(visualLines, input.lines, input.cursor, input.mode)
  const maximumScroll = Math.max(0, visualLines.length - height)
  let scrollTop = Math.min(maximumScroll, Math.max(0, Math.floor(input.scrollTop)))
  if (absoluteCursor.row < scrollTop) scrollTop = absoluteCursor.row
  if (absoluteCursor.row >= scrollTop + height) {
    scrollTop = absoluteCursor.row - height + 1
  }

  return {
    visibleLines: visualLines.slice(scrollTop, scrollTop + height),
    cursor: {
      row: absoluteCursor.row - scrollTop,
      column: absoluteCursor.column,
    },
    scrollTop,
    totalVisualLines: visualLines.length,
  }
}

export function moveVisualPosition(input: VisualMovementInput): VisualMovement {
  const width = Math.max(1, Math.floor(input.width))
  const visualLines = buildVisualLines({ ...input, width })
  const current = locateCursor(visualLines, input.lines, input.cursor, input.mode)
  const preferredColumn = input.preferredColumn ?? current.column
  const targetRow = Math.min(
    visualLines.length - 1,
    Math.max(0, current.row + (input.direction === 'up' ? -1 : 1))
  )
  const target = visualLines[targetRow]
  if (!target) return { cursor: input.cursor, preferredColumn }
  return {
    cursor: positionAtColumn(target, preferredColumn, input.mode),
    preferredColumn,
  }
}

function buildVisualLines(input: {
  lines: readonly string[]
  cursor: ViewportPosition
  mode: ViewportMode
  width: number
}): VisualLine[] {
  const width = Math.max(1, Math.floor(input.width))
  return input.lines.flatMap((line, logicalRow) => {
    const wrapped = wrapLogicalLine(line, logicalRow, width)
    const logicalLength = splitGraphemes(line).length
    const lastLine = wrapped.at(-1)
    if (
      input.mode === 'insert' &&
      input.cursor.row === logicalRow &&
      input.cursor.grapheme === logicalLength &&
      lastLine &&
      stringWidth(lastLine.text) === width
    ) {
      wrapped.push(createVisualLine('', logicalRow, logicalLength, logicalLength, true))
    }
    return wrapped
  })
}

function wrapLogicalLine(line: string, logicalRow: number, width: number): VisualLine[] {
  const graphemes = splitGraphemes(line)
  if (graphemes.length === 0) {
    return [createVisualLine('', logicalRow, 0, 0, false)]
  }

  const result: VisualLine[] = []
  let start = 0
  let cells = 0
  for (let index = 0; index < graphemes.length; index += 1) {
    const grapheme = graphemes[index] ?? ''
    const graphemeWidth = stringWidth(grapheme)
    if (index > start && cells + graphemeWidth > width) {
      result.push(
        createVisualLine(
          graphemes.slice(start, index).join(''),
          logicalRow,
          start,
          index,
          start > 0
        )
      )
      start = index
      cells = 0
    }
    cells += graphemeWidth
  }
  result.push(
    createVisualLine(
      graphemes.slice(start).join(''),
      logicalRow,
      start,
      graphemes.length,
      start > 0
    )
  )
  return result
}

function createVisualLine(
  text: string,
  logicalRow: number,
  startGrapheme: number,
  endGrapheme: number,
  continuation: boolean
): VisualLine {
  return { text, logicalRow, startGrapheme, endGrapheme, continuation }
}

function locateCursor(
  visualLines: readonly VisualLine[],
  logicalLines: readonly string[],
  cursor: ViewportPosition,
  mode: ViewportMode
): { row: number; column: number } {
  const logicalLine = logicalLines[cursor.row] ?? ''
  const logicalLength = splitGraphemes(logicalLine).length
  const row = visualLines.findIndex((line, index) => {
    if (line.logicalRow !== cursor.row) return false
    if (line.startGrapheme === line.endGrapheme) return true
    if (cursor.grapheme < line.endGrapheme) return cursor.grapheme >= line.startGrapheme
    return (
      mode === 'insert' &&
      cursor.grapheme === logicalLength &&
      visualLines[index + 1]?.logicalRow !== cursor.row
    )
  })
  const visualRow = row < 0 ? 0 : row
  const visualLine = visualLines[visualRow] ?? createVisualLine('', cursor.row, 0, 0, false)
  const graphemes = splitGraphemes(logicalLine)
  const beforeCursor = graphemes
    .slice(visualLine.startGrapheme, Math.max(visualLine.startGrapheme, cursor.grapheme))
    .join('')
  return { row: visualRow, column: stringWidth(beforeCursor) }
}

function positionAtColumn(line: VisualLine, column: number, mode: ViewportMode): ViewportPosition {
  const graphemes = splitGraphemes(line.text)
  if (graphemes.length === 0) {
    return { row: line.logicalRow, grapheme: line.startGrapheme }
  }

  let cells = 0
  let grapheme = line.startGrapheme
  for (let index = 0; index < graphemes.length; index += 1) {
    if (cells > column) break
    grapheme = line.startGrapheme + index
    const nextCells = cells + stringWidth(graphemes[index] ?? '')
    if (mode === 'insert' && nextCells <= column) {
      grapheme = line.startGrapheme + index + 1
    }
    cells = nextCells
  }
  return {
    row: line.logicalRow,
    grapheme: Math.min(
      mode === 'insert' ? line.endGrapheme : Math.max(line.startGrapheme, line.endGrapheme - 1),
      grapheme
    ),
  }
}
