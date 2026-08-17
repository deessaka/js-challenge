import type { Submission } from '../types.js'
import {
  ANSI,
  BOX,
  padCenter,
  padRight,
  SPINNER_FRAMES,
  stringWidth,
  THEME,
  truncate,
} from './ansi.js'

export class TestModal {
  isOpen = false
  isLoading = false
  isDryRun = true
  submission: Submission | null = null
  statusMessage: string | null = null
  spinnerIndex = 0
  executionTimeMs: number | null = null
  scrollOffset = 0

  open(isDryRun: boolean, message = 'Exécution des tests...'): void {
    this.isOpen = true
    this.isLoading = true
    this.isDryRun = isDryRun
    this.statusMessage = message
    this.submission = null
    this.executionTimeMs = null
    this.scrollOffset = 0
  }

  setSubmission(submission: Submission, isDryRun = false, executionTimeMs?: number): void {
    this.isLoading = false
    this.submission = submission
    this.isDryRun = isDryRun
    this.statusMessage = null
    this.scrollOffset = 0
    this.executionTimeMs = executionTimeMs ?? null
  }

  setError(error: string): void {
    this.isLoading = false
    this.statusMessage = `Erreur: ${error}`
    this.submission = null
  }

  close(): void {
    this.isOpen = false
    this.isLoading = false
  }

  tickSpinner(): void {
    this.spinnerIndex = (this.spinnerIndex + 1) % SPINNER_FRAMES.length
  }

  scrollUp(step = 1): void {
    this.scrollOffset = Math.max(0, this.scrollOffset - step)
  }

  scrollDown(step = 1): void {
    this.scrollOffset += step
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const lines: string[] = []
    const words = text.split(/\s+/)
    let current = ''
    for (const w of words) {
      if (!current) {
        current = w
      } else if (current.length + 1 + w.length <= maxWidth) {
        current += ` ${w}`
      } else {
        lines.push(current)
        current = w
      }
    }
    if (current) lines.push(current)
    return lines
  }

  render(screenHeight: number, screenWidth: number): string[] {
    const modalWidth = Math.min(84, Math.max(56, screenWidth - 8))
    const innerWidth = modalWidth - 4
    const modalHeight = Math.min(22, Math.max(12, screenHeight - 6))
    const contentHeight = modalHeight - 4 // top border (1) + header (1) + footer (1) + bottom border (1)

    const border = this.isLoading
      ? THEME.borderFocus
      : this.submission?.status === 'passed' && this.submission.accepted
        ? THEME.success
        : THEME.error

    const bg = THEME.surface

    const contentLines: string[] = []

    if (this.isLoading) {
      const spinner = `${THEME.primary}${ANSI.bold}${SPINNER_FRAMES[this.spinnerIndex]}${ANSI.reset}`
      const modeText = this.isDryRun ? 'VÉRIFICATION CONSOLE (TEST LOCAL)' : 'SOUMISSION OFFICIELLE'
      contentLines.push('')
      contentLines.push(padCenter(`${spinner} ${THEME.textBold}${modeText}${ANSI.reset}`, innerWidth))
      contentLines.push(padCenter(`${THEME.textMuted}${this.statusMessage || 'Exécution dans le bac à sable...'}${ANSI.reset}`, innerWidth))
      contentLines.push(padCenter(`${THEME.textDim}Isolation sécurisée V8 & exécution des assertions...${ANSI.reset}`, innerWidth))
      contentLines.push('')
    } else if (this.statusMessage && !this.submission) {
      contentLines.push('')
      contentLines.push(padCenter(`${THEME.badgeError} ERREUR SYSTÈME ${ANSI.reset}`, innerWidth))
      contentLines.push(padCenter(`${THEME.error}${this.statusMessage}${ANSI.reset}`, innerWidth))
      contentLines.push('')
    } else if (this.submission) {
      const sub = this.submission
      const isPassed = sub.status === 'passed' && sub.accepted
      const timeStr = this.executionTimeMs ? `${THEME.textDim}(${this.executionTimeMs}ms)${ANSI.reset}` : ''
      const totalTests = sub.results?.length || 0
      const passedTests = sub.results?.filter((r) => r.passed).length || 0

      // Header status banner
      if (isPassed) {
        const badge = this.isDryRun
          ? `${THEME.badgeSuccess} ✓ TOUS LES TESTS PASSENT EN CONSOLE ${ANSI.reset}`
          : `${THEME.badgeSuccess} 🎉 CHALLENGE VALIDÉ AVEC SUCCÈS ! ${ANSI.reset}`
        contentLines.push(padCenter(`${badge} ${timeStr}`, innerWidth))
        if (this.isDryRun) {
          contentLines.push(padCenter(`${THEME.textMuted}Votre solution est prête pour la validation officielle.${ANSI.reset}`, innerWidth))
        } else {
          contentLines.push(padCenter(`${THEME.success}${ANSI.bold}Points attribués & progression enregistrée.${ANSI.reset}`, innerWidth))
        }
      } else {
        const badge = `${THEME.badgeError} ✗ ${totalTests - passedTests}/${totalTests} TESTS ÉCHOUÉS ${ANSI.reset}`
        contentLines.push(padCenter(`${badge} ${timeStr}`, innerWidth))
        contentLines.push(padCenter(`${THEME.error}Ajustez votre code ci-dessous puis relancez le test.${ANSI.reset}`, innerWidth))
      }

      contentLines.push(`${THEME.borderDim}${'─'.repeat(innerWidth)}${ANSI.reset}`)

      // Test cases list
      if (sub.results && sub.results.length > 0) {
        for (const res of sub.results) {
          if (res.passed) {
            contentLines.push(`  ${THEME.success}${ANSI.bold}✓ PASS${ANSI.reset} ${THEME.text}${truncate(res.description, innerWidth - 10)}${ANSI.reset}`)
          } else {
            contentLines.push(`  ${THEME.error}${ANSI.bold}✗ FAIL${ANSI.reset} ${THEME.textBold}${truncate(res.description, innerWidth - 10)}${ANSI.reset}`)
            if (res.error) {
              const errLines = this.wrapText(res.error, innerWidth - 8)
              contentLines.push(`    ${THEME.borderDim}${BOX.roundedTopLeft}${BOX.horizontal.repeat(Math.min(48, innerWidth - 6))}${BOX.roundedTopRight}${ANSI.reset}`)
              for (const el of errLines) {
                contentLines.push(`    ${THEME.borderDim}${BOX.vertical}${ANSI.reset} ${THEME.error}${padRight(el, Math.min(48, innerWidth - 8))}${THEME.borderDim}${BOX.vertical}${ANSI.reset}`)
              }
              contentLines.push(`    ${THEME.borderDim}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(Math.min(48, innerWidth - 6))}${BOX.roundedBottomRight}${ANSI.reset}`)
            }
          }
        }
      } else if (sub.errorMessage) {
        contentLines.push(`  ${THEME.error}${truncate(sub.errorMessage, innerWidth - 4)}${ANSI.reset}`)
      }
    }

    // Viewport slicing
    const maxScroll = Math.max(0, contentLines.length - contentHeight)
    if (this.scrollOffset > maxScroll) this.scrollOffset = maxScroll

    const visibleBody = contentLines.slice(this.scrollOffset, this.scrollOffset + contentHeight)
    while (visibleBody.length < contentHeight) {
      visibleBody.push(' '.repeat(innerWidth))
    }

    // Frame assembly
    const rendered: string[] = []

    // Top border
    const titleStr = this.isDryRun ? ' 🧪 RÉSULTATS DU TEST (CONSOLE) ' : ' 🏆 VALIDATION OFFICIELLE '
    const titleWidth = stringWidth(titleStr)
    const topBarLen = Math.max(0, innerWidth + 2 - titleWidth)
    const leftBar = 4
    const rightBar = Math.max(0, topBarLen - leftBar)
    rendered.push(
      `${border}${BOX.roundedTopLeft}${BOX.horizontal.repeat(leftBar)}${border}${ANSI.bold}${titleStr}${border}${BOX.horizontal.repeat(rightBar)}${BOX.roundedTopRight}${ANSI.reset}`
    )

    // Body rows
    for (const line of visibleBody) {
      const padded = padRight(line, innerWidth)
      rendered.push(
        `${border}${BOX.vertical}${bg} ${padded} ${border}${BOX.vertical}${ANSI.reset}`
      )
    }

    // Bottom border with actions
    let actionHint = ' [Échap / Entrée] Fermer '
    if (this.submission?.status === 'passed' && this.submission.accepted && this.isDryRun) {
      actionHint = ' [Ctrl+S] Soumettre & Valider │ [Échap] Fermer '
    } else if (this.submission?.status === 'passed' && this.submission.accepted && !this.isDryRun) {
      actionHint = ' [Entrée] Défi suivant │ [Échap] Fermer '
    }

    const botBarLen = Math.max(0, innerWidth + 2 - stringWidth(actionHint))
    const bLeft = Math.floor(botBarLen / 2)
    const bRight = botBarLen - bLeft
    rendered.push(
      `${border}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(bLeft)}${THEME.textMuted}${actionHint}${border}${BOX.horizontal.repeat(bRight)}${BOX.roundedBottomRight}${ANSI.reset}`
    )

    return rendered
  }
}
