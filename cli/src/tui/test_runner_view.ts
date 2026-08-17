import type { Submission } from '../types.js'
import { ANSI, padRight, truncate } from './ansi.js'

export class TestRunnerView {
  submission: Submission | null = null
  statusMessage: string | null = null
  isLoading = false
  isDryRun = false
  scrollOffset = 0

  setLoading(loading: boolean, isDryRun = false, message = 'Exécution des tests...'): void {
    this.isLoading = loading
    this.isDryRun = isDryRun
    this.statusMessage = message
    if (loading) this.submission = null
  }

  setSubmission(submission: Submission, isDryRun = false): void {
    this.isLoading = false
    this.submission = submission
    this.isDryRun = isDryRun
    this.statusMessage = null
    this.scrollOffset = 0
  }

  setError(message: string): void {
    this.isLoading = false
    this.statusMessage = message
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
    const mode = this.isDryRun ? 'VÉRIFICATION' : 'SOUMISSION'
    const sectionTitle = (title: string, color: string): string =>
      `${color}${ANSI.bold}▸ ${title}${ANSI.reset}`

    if (this.isLoading) {
      lines.push(`${ANSI.warning}${ANSI.bold}... ${mode} EN COURS${ANSI.reset}`)
      lines.push(
        `${ANSI.muted}${this.statusMessage || 'Exécution des tests serveur...'}${ANSI.reset}`
      )
      lines.push(
        `${ANSI.muted}Aucune progression n’est modifiée pendant une vérification.${ANSI.reset}`
      )
      return this.fill(lines, height, width)
    }

    if (this.statusMessage && !this.submission) {
      lines.push(`${ANSI.error}${ANSI.bold}[ERR] ${this.statusMessage}${ANSI.reset}`)
      return this.fill(lines, height, width)
    }

    if (!this.submission) {
      lines.push(`${ANSI.muted}Ctrl+T/F5 vérifier · Ctrl+S/F6 soumettre · ? aide${ANSI.reset}`)
      return this.fill(lines, height, width)
    }

    const submission = this.submission
    const passed = submission.status === 'passed' && submission.accepted
    const modeTag = this.isDryRun
      ? `${ANSI.panelFocus}${ANSI.white}${ANSI.bold} VÉRIFICATION ${ANSI.reset}`
      : `${ANSI.bgMagenta}${ANSI.white}${ANSI.bold} OFFICIELLE ${ANSI.reset}`

    if (passed) {
      lines.push(
        `${modeTag} ${ANSI.success}${ANSI.bold}[OK] ${
          this.isDryRun
            ? 'Tests réussis — soumettez avec Ctrl+S/F6.'
            : 'Challenge validé — progression synchronisée.'
        }${ANSI.reset}`
      )
    } else if (submission.status === 'failed') {
      lines.push(
        `${modeTag} ${ANSI.error}${ANSI.bold}[FAIL] Certains tests ont échoué.${ANSI.reset}`
      )
    } else {
      lines.push(
        `${modeTag} ${ANSI.warning}${ANSI.bold}[WARN] ${submission.errorMessage || 'Erreur lors de l’exécution.'}${ANSI.reset}`
      )
    }

    lines.push('')
    lines.push(sectionTitle('SORTIE CONSOLE', ANSI.focus))
    if (submission.consoleLogs?.length) {
      for (const log of submission.consoleLogs) {
        lines.push(`  ${ANSI.brightWhite}${truncate(log, contentWidth - 4)}${ANSI.reset}`)
      }
    } else {
      lines.push(`  ${ANSI.muted}Aucun log produit par votre code.${ANSI.reset}`)
    }

    if (submission.errorMessage) {
      lines.push(
        `  ${ANSI.error}${truncate(submission.errorMessage, contentWidth - 4)}${ANSI.reset}`
      )
    }

    lines.push('')
    lines.push(
      sectionTitle('RÉSULTATS DE VALIDATION', isFocused ? ANSI.brightMagenta : ANSI.brightBlue)
    )
    if (submission.results?.length) {
      for (const result of submission.results) {
        if (result.passed) {
          lines.push(
            `  ${ANSI.success}PASS${ANSI.reset} ${truncate(result.description, contentWidth - 10)}`
          )
        } else {
          lines.push(
            `  ${ANSI.error}FAIL${ANSI.reset} ${ANSI.bold}${truncate(result.description, contentWidth - 10)}${ANSI.reset}`
          )
          if (result.error)
            lines.push(
              `    ${ANSI.muted}> ${truncate(result.error, contentWidth - 8)}${ANSI.reset}`
            )
        }
      }
    } else {
      lines.push(`  ${ANSI.muted}Aucun résultat de validation.${ANSI.reset}`)
    }

    const visibleLines = lines.slice(this.scrollOffset, this.scrollOffset + height)
    return this.fill(visibleLines, height, width)
  }

  private fill(lines: string[], height: number, width: number): string[] {
    const visible = lines.slice(0, height)
    while (visible.length < height) visible.push(' '.repeat(width))
    return visible.map((line) => ` ${padRight(line, width - 2)}`)
  }
}
