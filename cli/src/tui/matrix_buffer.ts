import { ANSI, BOX, stringWidth, THEME } from './ansi.js'

export interface CellStyle {
  fg?: string
  bg?: string
  bold?: boolean
  dim?: boolean
  italic?: boolean
  underline?: boolean
}

export interface Cell {
  char: string
  fg: string
  bg: string
  bold: boolean
  dim: boolean
  italic: boolean
  underline: boolean
}

function createEmptyCell(bg = ''): Cell {
  return {
    char: ' ',
    fg: '',
    bg: bg,
    bold: false,
    dim: false,
    italic: false,
    underline: false,
  }
}

function areCellsEqual(a: Cell, b: Cell): boolean {
  return (
    a.char === b.char &&
    a.fg === b.fg &&
    a.bg === b.bg &&
    a.bold === b.bold &&
    a.dim === b.dim &&
    a.italic === b.italic &&
    a.underline === b.underline
  )
}

export class MatrixBuffer {
  cells: Cell[][] = []

  constructor(
    public rows: number,
    public cols: number
  ) {
    this.resize(rows, cols)
  }

  resize(rows: number, cols: number): void {
    this.rows = Math.max(1, rows)
    this.cols = Math.max(1, cols)
    this.cells = []
    for (let r = 0; r < this.rows; r += 1) {
      const row: Cell[] = []
      for (let c = 0; c < this.cols; c += 1) {
        row.push(createEmptyCell())
      }
      this.cells.push(row)
    }
  }

  clear(bg = ''): void {
    for (let r = 0; r < this.rows; r += 1) {
      for (let c = 0; c < this.cols; c += 1) {
        const cell = this.cells[r][c]
        cell.char = ' '
        cell.fg = ''
        cell.bg = bg
        cell.bold = false
        cell.dim = false
        cell.italic = false
        cell.underline = false
      }
    }
  }

  setCell(x: number, y: number, char: string, style: CellStyle = {}): void {
    if (y < 0 || y >= this.rows || x < 0 || x >= this.cols) return
    const cell = this.cells[y][x]
    cell.char = char || ' '
    if (style.fg !== undefined) cell.fg = style.fg
    if (style.bg !== undefined) cell.bg = style.bg
    if (style.bold !== undefined) cell.bold = style.bold
    if (style.dim !== undefined) cell.dim = style.dim
    if (style.italic !== undefined) cell.italic = style.italic
    if (style.underline !== undefined) cell.underline = style.underline
  }

  writeString(x: number, y: number, text: string, style: CellStyle = {}): void {
    if (y < 0 || y >= this.rows) return
    let curX = x
    for (const char of text) {
      if (curX >= this.cols) break
      this.setCell(curX, y, char, style)
      curX += 1
    }
  }

  writeFormatted(startX: number, y: number, formatted: string): void {
    if (y < 0 || y >= this.rows) return

    let curX = startX
    let curFg = ''
    let curBg = ''
    let bold = false
    let dim = false
    let italic = false
    let underline = false

    // ANSI escape parser regex
    const regex = /\x1b\[[0-9;]*[a-zA-Z]|./gu
    let match: RegExpExecArray | null

    while ((match = regex.exec(formatted)) !== null) {
      const token = match[0]
      if (token.startsWith('\x1b[')) {
        if (token === '\x1b[0m' || token === '\x1b[m') {
          curFg = ''
          curBg = ''
          bold = false
          dim = false
          italic = false
          underline = false
        } else if (token === '\x1b[1m') {
          bold = true
        } else if (token === '\x1b[2m') {
          dim = true
        } else if (token === '\x1b[3m') {
          italic = true
        } else if (token === '\x1b[4m') {
          underline = true
        } else if (token.startsWith('\x1b[38;2;')) {
          curFg = token
        } else if (token.startsWith('\x1b[48;2;')) {
          curBg = token
        }
      } else {
        if (curX < this.cols && curX >= 0) {
          this.setCell(curX, y, token, {
            fg: curFg,
            bg: curBg,
            bold,
            dim,
            italic,
            underline,
          })
        }
        curX += 1
      }
    }
  }

  drawBox(
    x: number,
    y: number,
    width: number,
    height: number,
    title = '',
    borderColor = THEME.border,
    bgColor = THEME.surface
  ): void {
    const maxX = Math.min(this.cols - 1, x + width - 1)
    const maxY = Math.min(this.rows - 1, y + height - 1)
    if (x > maxX || y > maxY) return

    const bStyle = { fg: borderColor, bg: bgColor }
    const bgStyle = { fg: '', bg: bgColor }

    // Top border
    this.setCell(x, y, BOX.roundedTopLeft, bStyle)
    for (let c = x + 1; c < maxX; c += 1) {
      this.setCell(c, y, BOX.horizontal, bStyle)
    }
    this.setCell(maxX, y, BOX.roundedTopRight, bStyle)

    // Title on top
    if (title) {
      this.writeFormatted(x + 2, y, title)
    }

    // Body rows
    for (let r = y + 1; r < maxY; r += 1) {
      this.setCell(x, r, BOX.vertical, bStyle)
      for (let c = x + 1; c < maxX; c += 1) {
        this.setCell(c, r, ' ', bgStyle)
      }
      this.setCell(maxX, r, BOX.vertical, bStyle)
    }

    // Bottom border
    this.setCell(x, maxY, BOX.roundedBottomLeft, bStyle)
    for (let c = x + 1; c < maxX; c += 1) {
      this.setCell(c, maxY, BOX.horizontal, bStyle)
    }
    this.setCell(maxX, maxY, BOX.roundedBottomRight, bStyle)
  }

  drawDropShadow(x: number, y: number, width: number, height: number): void {
    const shadowBg = '\x1b[48;2;15;17;26m' // Deep shadow tone
    const shadowFg = '\x1b[38;2;60;64;90m'

    // Right shadow column (x + width, y + 1 .. y + height)
    const shadowX = x + width
    for (let r = y + 1; r <= y + height; r += 1) {
      if (r >= 0 && r < this.rows && shadowX >= 0 && shadowX < this.cols) {
        const cell = this.cells[r][shadowX]
        cell.bg = shadowBg
        cell.fg = shadowFg
        cell.dim = true
      }
      if (r >= 0 && r < this.rows && shadowX + 1 >= 0 && shadowX + 1 < this.cols) {
        const cell = this.cells[r][shadowX + 1]
        cell.bg = shadowBg
        cell.fg = shadowFg
        cell.dim = true
      }
    }

    // Bottom shadow row (x + 2 .. x + width + 1, y + height)
    const shadowY = y + height
    if (shadowY >= 0 && shadowY < this.rows) {
      for (let c = x + 2; c <= x + width + 1; c += 1) {
        if (c >= 0 && c < this.cols) {
          const cell = this.cells[shadowY][c]
          cell.bg = shadowBg
          cell.fg = shadowFg
          cell.dim = true
        }
      }
    }
  }

  dimBackdrop(): void {
    const dimBg = '\x1b[48;2;18;19;30m'
    const dimFg = '\x1b[38;2;80;85;110m'

    for (let r = 0; r < this.rows; r += 1) {
      for (let c = 0; c < this.cols; c += 1) {
        const cell = this.cells[r][c]
        cell.bg = dimBg
        cell.fg = dimFg
        cell.dim = true
      }
    }
  }

  drawScrollbar(
    x: number,
    y: number,
    height: number,
    totalItems: number,
    visibleItems: number,
    currentOffset: number
  ): void {
    if (height <= 0 || totalItems <= visibleItems) return

    const thumbSize = Math.max(1, Math.round((visibleItems / totalItems) * height))
    const maxOffset = totalItems - visibleItems
    const thumbPosition = Math.min(
      height - thumbSize,
      Math.round((currentOffset / maxOffset) * (height - thumbSize))
    )

    for (let i = 0; i < height; i += 1) {
      const curY = y + i
      if (curY >= 0 && curY < this.rows && x >= 0 && x < this.cols) {
        if (i >= thumbPosition && i < thumbPosition + thumbSize) {
          this.setCell(x, curY, '█', { fg: THEME.primary })
        } else {
          this.setCell(x, curY, '│', { fg: THEME.borderDim })
        }
      }
    }
  }

  clone(): MatrixBuffer {
    const next = new MatrixBuffer(this.rows, this.cols)
    for (let r = 0; r < this.rows; r += 1) {
      for (let c = 0; c < this.cols; c += 1) {
        const src = this.cells[r][c]
        next.cells[r][c] = { ...src }
      }
    }
    return next
  }

  renderDiff(prev: MatrixBuffer | null): string {
    let output = ''
    let lastFg = ''
    let lastBg = ''
    let lastBold = false
    let lastDim = false
    let lastItalic = false
    let lastUnderline = false

    const resetStyle = () => {
      output += ANSI.reset
      lastFg = ''
      lastBg = ''
      lastBold = false
      lastDim = false
      lastItalic = false
      lastUnderline = false
    }

    const applyStyle = (cell: Cell) => {
      if (
        cell.bold !== lastBold ||
        cell.dim !== lastDim ||
        cell.italic !== lastItalic ||
        cell.underline !== lastUnderline
      ) {
        resetStyle()
      }

      if (cell.fg !== lastFg) {
        output += cell.fg || '\x1b[39m'
        lastFg = cell.fg
      }
      if (cell.bg !== lastBg) {
        output += cell.bg || '\x1b[49m'
        lastBg = cell.bg
      }
      if (cell.bold && !lastBold) {
        output += '\x1b[1m'
        lastBold = true
      }
      if (cell.dim && !lastDim) {
        output += '\x1b[2m'
        lastDim = true
      }
      if (cell.italic && !lastItalic) {
        output += '\x1b[3m'
        lastItalic = true
      }
      if (cell.underline && !lastUnderline) {
        output += '\x1b[4m'
        lastUnderline = true
      }
    }

    const fullRedraw = !prev || prev.rows !== this.rows || prev.cols !== this.cols

    for (let r = 0; r < this.rows; r += 1) {
      let isDrawingRun = false

      for (let c = 0; c < this.cols; c += 1) {
        const curCell = this.cells[r][c]
        const prevCell = fullRedraw ? null : prev.cells[r][c]

        const isChanged = !prevCell || !areCellsEqual(curCell, prevCell)

        if (isChanged) {
          if (!isDrawingRun) {
            output += `\x1b[${r + 1};${c + 1}H`
            isDrawingRun = true
          }
          applyStyle(curCell)
          output += curCell.char
        } else {
          isDrawingRun = false
        }
      }
    }

    resetStyle()
    return output
  }
}
