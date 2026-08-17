import type { Submission } from '../types.js'
import { ANSI, BOX, padRight, SPINNER_FRAMES, stringWidth, THEME, truncate } from './ansi.js'

export class TestRunnerView {
  submission: Submission | null = null
  statusMessage: string | null = null
  isLoading = false
  isDryRun = false
  scrollOffset = 0
  spinnerIndex = 0
  executionTimeMs: number | null = null

  tickSpinner(): void {
    this.spinnerIndex = (this.spinnerIndex + 1) % SPINNER_FRAMES.length
  }

  setLoading(loading: boolean, isDryRun = false, message = 'Exécution des tests...'): void {
    this.isLoading = loading
    this.isDryRun = isDryRun
    this.statusMessage = message
    if (loading) {
      this.submission = null
      this.executionTimeMs = null
    }
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

  scrollUp(step = 1): void {
    this.scrollOffset = Math.max(0, this.scrollOffset - step)
  }

  scrollDown(step = 1): void {
    this.scrollOffset += step
  }

  render(height: number, width: number, isFocused: boolean): string[] {
    const lines: string[] = []
    const contentWidth = Math.max(10, width - 4)

    if (this.isLoading) {
      const spinner = `${THEME.primary}${ANSI.bold}${SPINNER_FRAMES[this.spinnerIndex]}${ANSI.reset}`
      const modeText = this.isDryRun
        ? `${THEME.badgePrimary} TEST CONSOLE EN COURS ${ANSI.reset}`
        : `${THEME.badgeSecondary} SOUMISSION EN COURS ${ANSI.reset}`

      lines.push(` ${spinner} ${modeText} ${THEME.textBold}${this.statusMessage || 'Exécution dans le bac à sable V8...'}${ANSI.reset}`)
      lines.push(`   ${THEME.textMuted}Isolation sécurisée & exécution des assertions Jest/Mocha...${ANSI.reset}`)
      while (lines.length < height) lines.push(' '.repeat(width))
      return lines.map((l) => ` ${padRight(l, width - 2)}`)
    }

    if (this.statusMessage && !this.submission) {
      lines.push(`${THEME.badgeError} ERREUR ${ANSI.reset} ${THEME.error}${this.statusMessage}${ANSI.reset}`)
      while (lines.length < height) lines.push(' '.repeat(width))
      return lines.map((l) => ` ${padRight(l, width - 2)}`)
    }

    if (!this.submission) {
      lines.push(
        ` ${THEME.badgePrimary} [Ctrl+T / F5] ▶ Tester ${ANSI.reset} ${THEME.textMuted}Vérification instantanée console (sans valider)${ANSI.reset}`
      )
      lines.push(
        ` ${THEME.badgeSuccess} [Ctrl+S / F6] ✓ Soumettre ${ANSI.reset} ${THEME.textMuted}Validation officielle, points & déblocage${ANSI.reset}`
      )
      while (lines.length < height) lines.push(' '.repeat(width))
      return lines.map((l) => ` ${padRight(l, width - 2)}`)
    }

    const sub = this.submission
    const isPassed = sub.status === 'passed' && sub.accepted
    const timeStr = this.executionTimeMs ? `${THEME.textDim}(${this.executionTimeMs}ms)${ANSI.reset}` : ''

    const totalTests = sub.results?.length || 0
    const passedTests = sub.results?.filter((r) => r.passed).length || 0

    const modeTag = this.isDryRun
      ? `${THEME.badgePrimary} TEST CONSOLE ${ANSI.reset}`
      : `${THEME.badgeSecondary} SOUMISSION OFFICIELLE ${ANSI.reset}`

    // Status line
    if (isPassed) {
      const summaryTag = `${THEME.badgeSuccess} ✓ ${passedTests}/${totalTests} RÉUSSIS ${ANSI.reset}`
      if (this.isDryRun) {
        lines.push(` ${modeTag} ${summaryTag} ${THEME.success}${ANSI.bold}Succès local ! Appuyez sur [Ctrl+S] pour valider.${ANSI.reset} ${timeStr}`)
      } else {
        lines.push(` ${modeTag} ${summaryTag} ${THEME.success}${ANSI.bold}🎉 Félicitations ! Exercice validé avec succès.${ANSI.reset} ${timeStr}`)
      }
    } else if (sub.status === 'failed') {
      const summaryTag = `${THEME.badgeError} ✗ ${totalTests - passedTests}/${totalTests} ÉCHOUÉS ${ANSI.reset}`
      lines.push(` ${modeTag} ${summaryTag} ${THEME.error}${ANSI.bold}Certaines assertions n'ont pas été vérifiées.${ANSI.reset} ${timeStr}`)
    } else {
      lines.push(` ${modeTag} ${THEME.badgeWarning} ⚠️ ERREUR ${ANSI.reset} ${THEME.warning}${sub.errorMessage || 'Erreur d’exécution'}${ANSI.reset}`)
    }

    // Results list
    if (sub.results && sub.results.length > 0) {
      for (const res of sub.results) {
        if (res.passed) {
          lines.push(
            `   ${THEME.success}PASS${ANSI.reset} ${THEME.text}${truncate(res.description, contentWidth - 10)}${ANSI.reset}`
          )
        } else {
          lines.push(
            `   ${THEME.error}${ANSI.bold}FAIL${ANSI.reset} ${THEME.textBold}${truncate(res.description, contentWidth - 10)}${ANSI.reset}`
          )
          if (res.error) {
            // Formatted Diff Box
            lines.push(
              `     ${THEME.borderDim}${BOX.roundedTopLeft}${BOX.horizontal.repeat(Math.min(40, contentWidth - 8))}${BOX.roundedTopRight}${ANSI.reset}`
            )
            lines.push(
              `     ${THEME.borderDim}${BOX.vertical}${ANSI.reset} ${THEME.error}${truncate(res.error, contentWidth - 10)}${ANSI.reset}`
            )
            lines.push(
              `     ${THEME.borderDim}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(Math.min(40, contentWidth - 8))}${BOX.roundedBottomRight}${ANSI.reset}`
            )
          }
        }
      }
    } else if (sub.errorMessage) {
      lines.push(`   ${THEME.error}${truncate(sub.errorMessage, contentWidth - 4)}${ANSI.reset}`)
    }

    // Viewport slicing
    const visibleLines = lines.slice(this.scrollOffset, this.scrollOffset + height)
    while (visibleLines.length < height) {
      visibleLines.push(' '.repeat(width))
    }

    return visibleLines.map((l) => ` ${padRight(l, width - 2)}`)
  }
}
