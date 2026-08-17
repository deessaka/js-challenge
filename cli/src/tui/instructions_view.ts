import type { Challenge } from '../types.js'
import { ANSI, BOX, padRight, stringWidth } from './ansi.js'

export class InstructionsView {
  scrollOffset = 0
  challenge: Challenge | null = null

  setChallenge(challenge: Challenge | null): void {
    this.challenge = challenge
    this.scrollOffset = 0
  }

  scrollUp(step = 1): void {
    this.scrollOffset = Math.max(0, this.scrollOffset - step)
  }

  scrollDown(step = 1): void {
    this.scrollOffset += step
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const lines: string[] = []
    const rawParagraphs = text.split(/\r?\n/)

    for (const paragraph of rawParagraphs) {
      if (!paragraph.trim()) {
        lines.push('')
        continue
      }

      const words = paragraph.split(/\s+/)
      let currentLine = ''

      for (const word of words) {
        if (!currentLine) {
          currentLine = word
        } else if (currentLine.length + 1 + word.length <= maxWidth) {
          currentLine += ` ${word}`
        } else {
          lines.push(currentLine)
          currentLine = word
        }
      }
      if (currentLine) {
        lines.push(currentLine)
      }
    }

    return lines
  }

  render(height: number, width: number, isFocused: boolean): string[] {
    const lines: string[] = []
    const contentWidth = Math.max(10, width - 4)

    if (!this.challenge) {
      lines.push(`${ANSI.dim}Sélectionnez un exercice dans la liste de gauche.${ANSI.reset}`)
      while (lines.length < height) lines.push(' '.repeat(width))
      return lines.map((l) => padRight(l, width))
    }

    const c = this.challenge

    const diffColor =
      c.difficultyLabel === 'easy'
        ? ANSI.brightGreen
        : c.difficultyLabel === 'medium'
          ? ANSI.brightYellow
          : ANSI.brightRed

    const lockBadge = c.isCompleted
      ? `${ANSI.bgGreen}${ANSI.black}${ANSI.bold} COMPLÉTÉ ✓ ${ANSI.reset}`
      : c.isUnlocked
        ? `${ANSI.bgBlue}${ANSI.white}${ANSI.bold} DISPONIBLE ● ${ANSI.reset}`
        : `${ANSI.bgDarkGray}${ANSI.gray}${ANSI.bold} VERROUILLÉ 🔒 ${ANSI.reset}`

    const header = `${ANSI.bold}${ANSI.brightWhite}#${c.number} ${c.title}${ANSI.reset}`
    const badges = `${lockBadge} ${diffColor}[${c.difficultyLabel}]${ANSI.reset} ${ANSI.cyan}[+${c.points} pts]${ANSI.reset} ${ANSI.gray}[${c.category}]${ANSI.reset}`

    const allLines: string[] = [
      header,
      badges,
      `${ANSI.gray}${'─'.repeat(contentWidth)}${ANSI.reset}`,
      `${ANSI.bold}${ANSI.yellow}📋 ÉNONCÉ${ANSI.reset}`,
      ...this.wrapText(c.description, contentWidth).map((l) => {
        if (l.includes('') || l.includes('->') || l.includes('===')) {
          return `${ANSI.brightCyan}${ANSI.bold}${l}${ANSI.reset}`
        }
        return `${ANSI.white}${l}${ANSI.reset}`
      }),
    ]

    if (c.hint) {
      allLines.push('')
      allLines.push(`${ANSI.bold}${ANSI.brightCyan}💡 INDICE${ANSI.reset}`)
      allLines.push(
        ...this.wrapText(c.hint, contentWidth).map((l) => `${ANSI.italic}${ANSI.cyan}${l}${ANSI.reset}`)
      )
    }

    // Scroll handling
    const maxScroll = Math.max(0, allLines.length - height)
    if (this.scrollOffset > maxScroll) this.scrollOffset = maxScroll

    const visibleLines = allLines.slice(this.scrollOffset, this.scrollOffset + height)
    while (visibleLines.length < height) {
      visibleLines.push(' '.repeat(contentWidth))
    }

    return visibleLines.map((l) => ` ${padRight(l, width - 1)}`)
  }
}
