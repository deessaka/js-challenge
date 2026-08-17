import type { User } from '../types.js'
import { ANSI, padRight } from './ansi.js'

export type FocusPanel = 'tree' | 'editor' | 'instructions' | 'results'

export class StatusBar {
  user: User | null = null
  activePanel: FocusPanel = 'tree'
  notification: string | null = null
  notificationTimer: NodeJS.Timeout | null = null

  setUser(user: User | null): void {
    this.user = user
  }

  setActivePanel(panel: FocusPanel): void {
    this.activePanel = panel
  }

  showNotification(msg: string, durationMs = 3500): void {
    this.notification = msg
    if (this.notificationTimer) clearTimeout(this.notificationTimer)
    this.notificationTimer = setTimeout(() => {
      this.notification = null
    }, durationMs)
  }

  render(width: number): string {
    const userStr = this.user ? `${ANSI.brightGreen}👤 ${this.user.username}${ANSI.reset}` : `${ANSI.yellow}Non connecté${ANSI.reset}`

    const pTree =
      this.activePanel === 'tree'
        ? `${ANSI.bgBlue}${ANSI.white}${ANSI.bold} 1: Exercices ${ANSI.reset}`
        : `${ANSI.bgDarkGray}${ANSI.gray} 1: Exercices ${ANSI.reset}`

    const pInstructions =
      this.activePanel === 'instructions'
        ? `${ANSI.bgBlue}${ANSI.white}${ANSI.bold} 2: Consignes ${ANSI.reset}`
        : `${ANSI.bgDarkGray}${ANSI.gray} 2: Consignes ${ANSI.reset}`

    const pEditor =
      this.activePanel === 'editor'
        ? `${ANSI.bgBlue}${ANSI.white}${ANSI.bold} 3: Éditeur ${ANSI.reset}`
        : `${ANSI.bgDarkGray}${ANSI.gray} 3: Éditeur ${ANSI.reset}`

    const pResults =
      this.activePanel === 'results'
        ? `${ANSI.bgBlue}${ANSI.white}${ANSI.bold} 4: Tests ${ANSI.reset}`
        : `${ANSI.bgDarkGray}${ANSI.gray} 4: Tests ${ANSI.reset}`

    const panels = `${pTree} ${pInstructions} ${pEditor} ${pResults}`

    let shortcuts = ''
    if (this.notification) {
      shortcuts = `${ANSI.bgYellow}${ANSI.black}${ANSI.bold} ℹ ${this.notification} ${ANSI.reset}`
    } else if (this.activePanel === 'tree') {
      shortcuts = `${ANSI.dim}[Souris/↑↓] Naviguer │ [Ctrl+T] ▶ Tester │ [Ctrl+S] ✓ Soumettre │ [Ctrl+Q] Quitter${ANSI.reset}`
    } else if (this.activePanel === 'editor') {
      shortcuts = `${ANSI.dim}[Édition directe] │ [Ctrl+T] ▶ Tester │ [Ctrl+S] ✓ Soumettre │ [Esc] Arbre${ANSI.reset}`
    } else if (this.activePanel === 'instructions') {
      shortcuts = `${ANSI.dim}[Souris/↑↓] Défiler énoncé │ [Tab] Éditeur │ [Ctrl+T] Tester │ [Ctrl+S] Soumettre${ANSI.reset}`
    } else {
      shortcuts = `${ANSI.dim}[Souris/↑↓] Défiler logs │ [Ctrl+T] Relancer test │ [Ctrl+S] Soumettre validation${ANSI.reset}`
    }

    const left = ` ${userStr} │ ${panels} `
    const right = `${shortcuts} `

    return `${ANSI.bgBlack}${padRight(left + right, width)}${ANSI.reset}`
  }
}
