import type { Challenge } from '../types.js'
import { ANSI, BOX, padRight, stringWidth, THEME, truncate } from './ansi.js'

export function sanitizeDescription(raw: string): string {
  return raw
    .replace(/Le 2\s*e\s*nombre/gi, 'Le 2ème nombre')
    .replace(/1\s*ere/gi, '1ère')
    .replace(/(\d+)\s*\n\s*e\b/gi, '$1ème')
    .replace(/\r?\n\s*\d{1,3}\s*\n/g, '\n')
    .replace(/[\uF0E0\u2709\uE000-\uF8FF]/g, '➔')
    .replace(//g, '➔')
    .replace(/\s*->\s*/g, ' ➔ ')
    .replace(/[ \t]{2,}/g, ' ')
}

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
      const trimmed = paragraph.trim()
      if (!trimmed) {
        lines.push('')
        continue
      }

      const words = trimmed.split(/\s+/)
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
    const contentWidth = Math.max(10, width - 2)

    if (!this.challenge) {
      lines.push(`${THEME.textMuted}Sélectionnez un exercice dans la liste de gauche.${ANSI.reset}`)
      while (lines.length < height) lines.push(' '.repeat(width))
      return lines.map((l) => padRight(l, width))
    }

    const c = this.challenge

    const diffBadge =
      c.difficultyLabel === 'easy'
        ? `${THEME.badgeSuccess} Facile ${ANSI.reset}`
        : c.difficultyLabel === 'medium'
          ? `${THEME.badgeWarning} Moyen ${ANSI.reset}`
          : `${THEME.badgeError} Difficile ${ANSI.reset}`

    const lockBadge = c.isCompleted
      ? `${THEME.badgeSuccess} Complété ✓ ${ANSI.reset}`
      : c.isUnlocked
        ? `${THEME.badgePrimary} Débloqué ● ${ANSI.reset}`
        : `${THEME.badgeMuted} Verrouillé 🔒 ${ANSI.reset}`

    const pointsBadge = `${THEME.badgeSecondary} +${c.points} pts ${ANSI.reset}`
    const categoryBadge = `${THEME.textDim}[${c.category || 'JavaScript'}]${ANSI.reset}`

    const header = `${THEME.textBold}#${c.number} ${c.title}${ANSI.reset}`
    const badges = `${lockBadge} ${diffBadge} ${pointsBadge} ${categoryBadge}`

    const sanitized = sanitizeDescription(c.description)
    const rawParagraphs = sanitized.split(/\r?\n/)

    const textParagraphs: string[] = []
    const exampleLines: string[] = []

    for (const p of rawParagraphs) {
      const trimmed = p.trim()
      if (trimmed.includes('➔') || trimmed.includes('===')) {
        exampleLines.push(trimmed)
      } else if (trimmed) {
        textParagraphs.push(trimmed)
      }
    }

    const allLines: string[] = [
      header,
      badges,
      `${THEME.borderDim}${'─'.repeat(contentWidth)}${ANSI.reset}`,
      `${THEME.secondary}${ANSI.bold}📋 ÉNONCÉ DU CHALLENGE${ANSI.reset}`,
    ]

    for (const paragraph of textParagraphs) {
      allLines.push(...this.wrapText(paragraph, contentWidth).map((l) => `${THEME.text}${l}${ANSI.reset}`))
      allLines.push('')
    }

    if (exampleLines.length > 0) {
      allLines.push(`${THEME.cyan}${ANSI.bold}💡 EXEMPLES ATTENDUS${ANSI.reset}`)
      for (const ex of exampleLines) {
        const parts = ex.split('➔')
        if (parts.length === 2) {
          const call = parts[0].trim()
          const result = parts[1].trim()
          allLines.push(
            `  ${THEME.primary}${call}${ANSI.reset} ${THEME.warning}➔${ANSI.reset} ${THEME.success}${ANSI.bold}${result}${ANSI.reset}`
          )
        } else {
          allLines.push(`  ${THEME.cyan}${ex}${ANSI.reset}`)
        }
      }
      allLines.push('')
    }

    if (c.hint) {
      allLines.push(`${THEME.warning}${ANSI.bold}💡 INDICE / ASTUCE${ANSI.reset}`)
      allLines.push(
        ...this.wrapText(c.hint, contentWidth).map(
          (l) => `${THEME.textMuted}${ANSI.italic}  ${l}${ANSI.reset}`
        )
      )
    }

    // Scroll handling
    const maxScroll = Math.max(0, allLines.length - height)
    if (this.scrollOffset > maxScroll) this.scrollOffset = maxScroll

    const visibleLines = allLines.slice(this.scrollOffset, this.scrollOffset + height)
    while (visibleLines.length < height) {
      visibleLines.push(' '.repeat(contentWidth))
    }

    return visibleLines.map((l) => padRight(l, width))
  }
}
