import GraphemeSplitter from 'grapheme-splitter'
import stringWidth from 'string-width'

const splitter = new GraphemeSplitter()

export function splitGraphemes(text: string): string[] {
  return splitter.splitGraphemes(text)
}

export function graphemeCount(text: string): number {
  return splitter.countGraphemes(text)
}

export function graphemeIndexToUtf16Offset(text: string, index: number): number {
  const graphemes = splitGraphemes(text)
  const clamped = Math.min(graphemes.length, Math.max(0, index))
  let offset = 0
  for (let current = 0; current < clamped; current += 1) {
    offset += graphemes[current]?.length ?? 0
  }
  return offset
}

export function utf16OffsetToGraphemeIndex(text: string, offset: number): number {
  const target = Math.min(text.length, Math.max(0, offset))
  const graphemes = splitGraphemes(text)
  let boundary = 0
  for (let index = 0; index < graphemes.length; index += 1) {
    const nextBoundary = boundary + (graphemes[index]?.length ?? 0)
    if (target < nextBoundary) return index
    if (target === nextBoundary) return index + 1
    boundary = nextBoundary
  }
  return graphemes.length
}

export function graphemeIndexToTerminalColumn(text: string, index: number): number {
  return stringWidth(graphemeSlice(text, 0, index))
}

export function graphemeSlice(text: string, start: number, end?: number): string {
  return splitGraphemes(text).slice(start, end).join('')
}
