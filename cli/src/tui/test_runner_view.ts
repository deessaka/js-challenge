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
      const modeText = this.isDryRun ? 'Vérification locale (sans soumission)' : 'Soumission officielle'
      lines.push(`${ANSI.brightYellow}${ANSI.bold}⏳ [EN COURS - ${modeText}] ${this.statusMessage || 'Exécution...'}${ANSI.reset}`)
      lines.push(`${ANSI.dim}Bac à sable V8 isolé en cours d'exécution...${ANSI.reset}`)
      while (lines.length < height) lines.push(' '.repeat(width))
      return lines.map((l) => ` ${padRight(l, width - 2)}`)
    }

    if (this.statusMessage && !this.submission) {
      lines.push(`${ANSI.brightRed}${ANSI.bold}✗ ${this.statusMessage}${ANSI.reset}`)
      while (lines.length < height) lines.push(' '.repeat(width))
      return lines.map((l) => ` ${padRight(l, width - 2)}`)
    }

    if (!this.submission) {
      lines.push(
        `${ANSI.dim}[Ctrl+T] ou [F5] : ${ANSI.bold}▶ Vérifier en console${ANSI.reset}${ANSI.dim} (sans soumettre)  │  [Ctrl+S] ou [F6] : ${ANSI.bold}✓ Soumettre & Valider${ANSI.reset}`
      )
      while (lines.length < height) lines.push(' '.repeat(width))
      return lines.map((l) => ` ${padRight(l, width - 2)}`)
    }

    const sub = this.submission
    const isPassed = sub.status === 'passed' && sub.accepted
    const modeTag = this.isDryRun
      ? `${ANSI.bgBlue}${ANSI.white}${ANSI.bold} TEST CONSOLE ${ANSI.reset}`
      : `${ANSI.bgMagenta}${ANSI.white}${ANSI.bold} SOUMISSION ${ANSI.reset}`

    // Status line
    if (isPassed) {
      if (this.isDryRun) {
        lines.push(
          `${modeTag} ${ANSI.brightGreen}${ANSI.bold}✓ Tests réussis ! Vous pouvez maintenant soumettre avec [Ctrl+S].${ANSI.reset}`
        )
      } else {
        lines.push(
          `${modeTag} ${ANSI.bgGreen}${ANSI.black}${ANSI.bold} ✓ EXERCICE VALIDÉ ${ANSI.reset} ${ANSI.brightGreen}${ANSI.bold}Challenge enregistré avec succès !${ANSI.reset}`
        )
      }
    } else if (sub.status === 'failed') {
      lines.push(
        `${modeTag} ${ANSI.bgRed}${ANSI.white}${ANSI.bold} ✗ ÉCHEC ${ANSI.reset} ${ANSI.brightRed}${ANSI.bold}Certains tests ont échoué. Ajustez votre code ci-dessus.${ANSI.reset}`
      )
    } else {
      lines.push(
        `${modeTag} ${ANSI.bgYellow}${ANSI.black}${ANSI.bold} ⚠️ ERREUR ${ANSI.reset} ${ANSI.yellow}${sub.errorMessage || 'Erreur lors de l’exécution'}${ANSI.reset}`
      )
    }

    // Results list
    if (sub.results && sub.results.length > 0) {
      for (const res of sub.results) {
        if (res.passed) {
          lines.push(
            `  ${ANSI.brightGreen}PASS${ANSI.reset} ${ANSI.white}${truncate(res.description, contentWidth - 10)}${ANSI.reset}`
          )
        } else {
          lines.push(
            `  ${ANSI.brightRed}FAIL${ANSI.reset} ${ANSI.bold}${ANSI.white}${truncate(res.description, contentWidth - 10)}${ANSI.reset}`
          )
          if (res.error) {
            lines.push(
              `    ${ANSI.gray}↳ ${ANSI.brightRed}${truncate(res.error, contentWidth - 8)}${ANSI.reset}`
            )
          }
        }
      }
    } else if (sub.errorMessage) {
      lines.push(`  ${ANSI.red}${truncate(sub.errorMessage, contentWidth - 4)}${ANSI.reset}`)
    }

    // Viewport slicing
    const visibleLines = lines.slice(this.scrollOffset, this.scrollOffset + height)
    while (visibleLines.length < height) {
      visibleLines.push(' '.repeat(width))
    }

    return visibleLines.map((l) => ` ${padRight(l, width - 2)}`)
  }
}
