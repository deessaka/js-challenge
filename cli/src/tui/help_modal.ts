import { ANSI, BOX, padCenter, padRight, stringWidth, THEME } from './ansi.js'

export class HelpModal {
  isOpen = false

  toggle(): void {
    this.isOpen = !this.isOpen
  }

  render(screenHeight: number, screenWidth: number): string[] {
    const width = Math.min(68, Math.max(50, screenWidth - 6))
    const innerWidth = width - 4

    const row = (key: string, desc: string) => {
      const k = `${THEME.primary}${ANSI.bold}${key.padEnd(16)}${ANSI.reset}`
      const d = `${THEME.text}${desc}${ANSI.reset}`
      return ` ${k} ${d}`
    }

    const section = (title: string) => `${THEME.secondary}${ANSI.bold}■ ${title}${ANSI.reset}`

    const contentLines: string[] = [
      section('NAVIGATION & PANNEAUX'),
      row('Tab / Shift+Tab', 'Circuler entre les panneaux (1 à 3)'),
      row('1 / 2 / 3', 'Aller directement au panneau spécifique'),
      row('Souris / Clic', 'Sélectionner un panneau ou positionner le curseur'),
      row('Molette souris', 'Faire défiler l’arbre ou les consignes'),
      '',
      section('ARBRE & RECHERCHE (Panneau 1)'),
      row('/ ou Ctrl+F', 'Ouvrir la recherche instantanée'),
      row('f', 'Filtrer : Tous / Disponibles / Terminés / Bloqués'),
      row('↑ / ↓ ou j / k', 'Parcourir les challenges'),
      row('Entrée', 'Ouvrir le challenge et focus l’éditeur'),
      '',
      section('ÉDITEUR DE CODE (Panneau 3)'),
      row('Écriture directe', 'Tapez votre code (Tab = 2 espaces)'),
      row('Flèches / Clic', 'Déplacer le curseur de saisie'),
      row('Échap', 'Revenir à l’arbre des exercices'),
      '',
      section('MODAL DE TESTS & SOUMISSION'),
      row('Ctrl + T ou F5', '▶ Ouvrir la modal de test local (dry-run)'),
      row('Ctrl + S ou F6', '✓ Valider & Soumettre officiellement'),
      row('Échap / Entrée', 'Fermer la modal de résultat de test'),
      row('Ctrl + R', 'Actualiser les challenges et points'),
      '',
      section('GÉNÉRAL'),
      row('? ou F1', 'Ouvrir / Fermer cette fenêtre d’aide'),
      row('Ctrl + Q / C', 'Quitter Codojo proprement'),
    ]

    const rendered: string[] = []

    // Top border
    const titleStr = ' 💡 AIDE & RACCOURCIS JS-CH '
    const topBarLen = Math.max(0, innerWidth - stringWidth(titleStr) + 2)
    const leftBar = Math.floor(topBarLen / 2)
    const rightBar = topBarLen - leftBar

    rendered.push(
      `${THEME.borderFocus}${BOX.roundedTopLeft}${BOX.horizontal.repeat(leftBar)}${THEME.primary}${ANSI.bold}${titleStr}${THEME.borderFocus}${BOX.horizontal.repeat(rightBar)}${BOX.roundedTopRight}${ANSI.reset}`
    )

    // Content rows
    for (const line of contentLines) {
      const padded = padRight(line, innerWidth + 2)
      rendered.push(
        `${THEME.borderFocus}${BOX.vertical}${THEME.surface}${padded}${THEME.borderFocus}${BOX.vertical}${ANSI.reset}`
      )
    }

    // Footer hint inside modal
    const footerHint = ' [Échap ou ?] Fermer cette fenêtre '
    const botBarLen = Math.max(0, innerWidth - stringWidth(footerHint) + 2)
    const bLeft = Math.floor(botBarLen / 2)
    const bRight = botBarLen - bLeft

    rendered.push(
      `${THEME.borderFocus}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(bLeft)}${THEME.textMuted}${footerHint}${THEME.borderFocus}${BOX.horizontal.repeat(bRight)}${BOX.roundedBottomRight}${ANSI.reset}`
    )

    return rendered
  }
}
