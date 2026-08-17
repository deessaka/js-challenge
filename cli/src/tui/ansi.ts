/**
 * ANSI terminal utilities for TUI rendering: styling, cursor control, and screen management.
 */

export const ESC = '\x1b['

export const ANSI = {
  // Screen and buffer
  enterAltScreen: '\x1b[?1049h',
  leaveAltScreen: '\x1b[?1049l',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
  clearScreen: '\x1b[2J\x1b[H',
  clearLine: '\x1b[2K',

  // Reset
  reset: '\x1b[0m',

  // Styles
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  inverse: '\x1b[7m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bgGray: '\x1b[100m',
  bgDarkGray: '\x1b[48;5;236m',
  bgHighlight: '\x1b[48;5;238m',
  bgPanel: '\x1b[48;5;235m',
}

export const BOX = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
  teeLeft: '├',
  teeRight: '┤',
  teeTop: '┬',
  teeBottom: '┴',
  cross: '┼',
}

/**
 * Move cursor to 1-indexed (row, col)
 */
export function moveTo(row: number, col: number): string {
  return `\x1b[${Math.max(1, Math.floor(row))};${Math.max(1, Math.floor(col))}H`
}

/**
 * Strips ANSI escape sequences for accurate string length computation.
 */
export function stripAnsi(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
}

/**
 * Visual width of string in terminal characters.
 */
export function stringWidth(text: string): number {
  return stripAnsi(text).length
}

/**
 * Truncate string to maximum visual width, adding ellipsis if truncated.
 */
export function truncate(text: string, maxWidth: number): string {
  const plain = stripAnsi(text)
  if (plain.length <= maxWidth) return text
  if (maxWidth <= 3) return plain.slice(0, maxWidth)
  return `${plain.slice(0, maxWidth - 1)}…`
}

/**
 * Pad a string (which may contain ANSI codes) to a given visual width.
 */
export function padRight(text: string, width: number): string {
  const current = stringWidth(text)
  if (current >= width) return text
  return text + ' '.repeat(width - current)
}

/**
 * Pad a string to center it in a given visual width.
 */
export function padCenter(text: string, width: number): string {
  const current = stringWidth(text)
  if (current >= width) return text
  const totalSpaces = width - current
  const left = Math.floor(totalSpaces / 2)
  const right = totalSpaces - left
  return ' '.repeat(left) + text + ' '.repeat(right)
}
