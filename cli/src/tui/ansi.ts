/**
 * ANSI terminal utilities: Tokyo Night / Catppuccin semantic styling,
 * TrueColor palette with 16 ANSI fallback, rounded box-drawing,
 * synchronized atomic output and widget helpers.
 */

export const COLORS_ENABLED = !process.env.NO_COLOR

export function rgb(r: number, g: number, b: number): string {
  if (!COLORS_ENABLED) return ''
  return `\x1b[38;2;${r};${g};${b}m`
}

export function bgRgb(r: number, g: number, b: number): string {
  if (!COLORS_ENABLED) return ''
  return `\x1b[48;2;${r};${g};${b}m`
}

const sgr = (seq: string): string => (COLORS_ENABLED ? seq : '')

export const THEME = {
  // Tokyo Night / Catppuccin Mocha semantic palette
  bg: bgRgb(26, 27, 38),             // #1a1b26
  surface: bgRgb(36, 40, 59),        // #24283b
  surfaceDark: bgRgb(22, 22, 30),    // #16161e
  surfaceHighlight: bgRgb(47, 53, 79), // #2f354f

  border: rgb(65, 72, 104),          // #414868
  borderFocus: rgb(122, 162, 247),   // #7aa2f7
  borderDim: rgb(47, 53, 79),        // #2f354f

  text: rgb(192, 202, 245),          // #c0caf5
  textBold: `${sgr('\x1b[1m')}${rgb(240, 243, 255)}`,
  textMuted: rgb(86, 95, 137),       // #565f89
  textDim: rgb(65, 72, 104),         // #414868

  primary: rgb(122, 162, 247),       // #7aa2f7 (Sapphire/Sky)
  secondary: rgb(187, 154, 247),     // #bb9af7 (Mauve/Purple)
  success: rgb(158, 206, 106),       // #9ece6a (Emerald/Green)
  warning: rgb(224, 175, 104),       // #e0af68 (Gold/Yellow)
  error: rgb(247, 118, 142),         // #f7768e (Rose/Red)
  cyan: rgb(125, 207, 255),          // #7dcfff (Teal/Cyan)
  orange: rgb(255, 158, 100),        // #ff9e64 (Peach/Orange)

  badgeSuccess: `${bgRgb(34, 70, 44)}${rgb(158, 206, 106)}${sgr('\x1b[1m')}`,
  badgeWarning: `${bgRgb(70, 55, 30)}${rgb(224, 175, 104)}${sgr('\x1b[1m')}`,
  badgeError: `${bgRgb(70, 30, 40)}${rgb(247, 118, 142)}${sgr('\x1b[1m')}`,
  badgePrimary: `${bgRgb(30, 48, 80)}${rgb(122, 162, 247)}${sgr('\x1b[1m')}`,
  badgeSecondary: `${bgRgb(50, 40, 80)}${rgb(187, 154, 247)}${sgr('\x1b[1m')}`,
  badgeMuted: `${bgRgb(36, 40, 59)}${rgb(86, 95, 137)}${sgr('\x1b[1m')}`,
}

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
  red: THEME.error,
  green: THEME.success,
  yellow: THEME.warning,
  blue: THEME.primary,
  magenta: THEME.secondary,
  cyan: THEME.cyan,
  white: THEME.text,
  gray: THEME.textMuted,
  brightRed: THEME.error,
  brightGreen: THEME.success,
  brightYellow: THEME.warning,
  brightBlue: THEME.primary,
  brightMagenta: THEME.secondary,
  brightCyan: THEME.cyan,
  brightWhite: THEME.textBold,

  bgBlack: sgr('\x1b[40m'),
  bgRed: THEME.badgeError,
  bgGreen: THEME.badgeSuccess,
  bgYellow: THEME.badgeWarning,
  bgBlue: THEME.badgePrimary,
  bgMagenta: THEME.badgeSecondary,
  bgCyan: bgRgb(25, 60, 80),
  bgWhite: bgRgb(200, 210, 240),
  bgGray: THEME.surface,
  bgDarkGray: THEME.surfaceDark,
  bgHighlight: THEME.surfaceHighlight,
  bgPanel: THEME.surface,

  focus: THEME.borderFocus,
  success: THEME.success,
  error: THEME.error,
  warning: THEME.warning,
  muted: THEME.textMuted,
}

export const BOX = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  roundedTopLeft: '╭',
  roundedTopRight: '╮',
  roundedBottomLeft: '╰',
  roundedBottomRight: '╯',
  horizontal: '─',
  horizontalHeavy: '━',
  vertical: '│',
  verticalHeavy: '┃',
  teeLeft: '├',
  teeRight: '┤',
  teeTop: '┬',
  teeBottom: '┴',
  cross: '┼',
}

export const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
export const FRACTIONAL_BLOCKS = [' ', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█']

export function renderProgressBar(
  percent: number,
  width: number,
  filledColor = THEME.success,
  emptyColor = THEME.textDim
): string {
  const safePercent = Math.max(0, Math.min(100, percent))
  const innerWidth = Math.max(3, width)
  const fullBlocks = Math.floor((safePercent / 100) * innerWidth)
  const remainder = ((safePercent / 100) * innerWidth) - fullBlocks
  const partialIdx = Math.floor(remainder * (FRACTIONAL_BLOCKS.length - 1))
  const partialChar = partialIdx > 0 ? FRACTIONAL_BLOCKS[partialIdx] : ''

  const emptyCount = Math.max(0, innerWidth - fullBlocks - (partialChar ? 1 : 0))

  const filledPart = '█'.repeat(fullBlocks)
  const emptyPart = '░'.repeat(emptyCount)

  return `${filledColor}${filledPart}${partialChar}${emptyColor}${emptyPart}${ANSI.reset}`
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
  return `${Array.from(plain)
    .slice(0, maxWidth - 1)
    .join('')}…`
}

export function padRight(text: string, width: number): string {
  const current = stringWidth(text)
  if (current >= width) return text
  return text + ' '.repeat(width - current)
}

export function padLeft(text: string, width: number): string {
  const current = stringWidth(text)
  if (current >= width) return text
  return ' '.repeat(width - current) + text
}

export function padCenter(text: string, width: number): string {
  const current = stringWidth(text)
  if (current >= width) return text
  const totalSpaces = width - current
  const left = Math.floor(totalSpaces / 2)
  const right = totalSpaces - left
  return ' '.repeat(left) + text + ' '.repeat(right)
}
