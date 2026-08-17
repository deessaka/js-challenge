/**
 * ANSI terminal utilities: semantic styling, cursor control and safe rendering.
 */

export const ESC = '\x1b['
export const COLORS_ENABLED = !process.env.NO_COLOR

const sgr = (sequence: string): string => (COLORS_ENABLED ? sequence : '')

export const ANSI = {
  enterAltScreen: '\x1b[?1049h',
  leaveAltScreen: '\x1b[?1049l',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
  clearScreen: '\x1b[2J\x1b[H',
  clearLine: '\x1b[2K',
  syncStart: '\x1b[?2026h',
  syncEnd: '\x1b[?2026l',

  reset: sgr('\x1b[0m'),
  bold: sgr('\x1b[1m'),
  dim: sgr('\x1b[2m'),
  italic: sgr('\x1b[3m'),
  underline: sgr('\x1b[4m'),
  inverse: sgr('\x1b[7m'),

  black: sgr('\x1b[30m'),
  red: sgr('\x1b[31m'),
  green: sgr('\x1b[32m'),
  yellow: sgr('\x1b[33m'),
  blue: sgr('\x1b[34m'),
  magenta: sgr('\x1b[35m'),
  cyan: sgr('\x1b[36m'),
  white: sgr('\x1b[37m'),
  gray: sgr('\x1b[90m'),
  brightRed: sgr('\x1b[91m'),
  brightGreen: sgr('\x1b[92m'),
  brightYellow: sgr('\x1b[93m'),
  brightBlue: sgr('\x1b[94m'),
  brightMagenta: sgr('\x1b[95m'),
  brightCyan: sgr('\x1b[96m'),
  brightWhite: sgr('\x1b[97m'),

  bgBlack: sgr('\x1b[40m'),
  bgRed: sgr('\x1b[41m'),
  bgGreen: sgr('\x1b[42m'),
  bgYellow: sgr('\x1b[43m'),
  bgBlue: sgr('\x1b[44m'),
  bgMagenta: sgr('\x1b[45m'),
  bgCyan: sgr('\x1b[46m'),
  bgWhite: sgr('\x1b[47m'),
  bgGray: sgr('\x1b[100m'),
  bgDarkGray: sgr('\x1b[48;5;236m'),
  bgHighlight: sgr('\x1b[48;5;238m'),
  bgPanel: sgr('\x1b[48;5;235m'),
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

export function moveTo(row: number, col: number): string {
  return `\x1b[${Math.max(1, Math.floor(row))};${Math.max(1, Math.floor(col))}H`
}

export function stripAnsi(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '')
}

export function stringWidth(text: string): number {
  return Array.from(stripAnsi(text)).length
}

export function truncate(text: string, maxWidth: number): string {
  const plain = stripAnsi(text)
  if (plain.length <= maxWidth) return text
  if (maxWidth <= 3) return Array.from(plain).slice(0, maxWidth).join('')
  return `${Array.from(plain).slice(0, maxWidth - 1).join('')}…`
}

export function padRight(text: string, width: number): string {
  const current = stringWidth(text)
  if (current >= width) return text
  return text + ' '.repeat(width - current)
}

export function padCenter(text: string, width: number): string {
  const current = stringWidth(text)
  if (current >= width) return text
  const totalSpaces = width - current
  const left = Math.floor(totalSpaces / 2)
  const right = totalSpaces - left
  return ' '.repeat(left) + text + ' '.repeat(right)
}
