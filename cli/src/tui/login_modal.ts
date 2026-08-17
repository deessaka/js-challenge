import { ANSI, BOX, padCenter, stringWidth, THEME } from './ansi.js'

export class LoginModal {
  token = ''
  errorMessage: string | null = null
  isLoading = false

  constructor(public tokenUrl = 'http://localhost:3333/profile#api-token') {}

  insertChar(char: string): void {
    this.token += char
    this.errorMessage = null
  }

  handleBackspace(): void {
    if (this.token.length > 0) {
      this.token = this.token.slice(0, -1)
      this.errorMessage = null
    }
  }

  clear(): void {
    this.token = ''
    this.errorMessage = null
    this.isLoading = false
  }

  render(_termHeight: number, termWidth: number): string[] {
    const modalWidth = Math.min(74, Math.max(52, termWidth - 6))
    const innerWidth = modalWidth - 4
    const lines: string[] = []

    const border = THEME.borderFocus
    const bg = THEME.surface

    const renderRow = (content: string) => {
      const padded = padCenter(content, innerWidth)
      return `${border}${BOX.vertical}${bg} ${padded} ${border}${BOX.vertical}${ANSI.reset}`
    }

    // Top border
    const title = ` ${THEME.primary}${ANSI.bold}Connexion terminal JS Challenge${border} `
    const titleWidth = stringWidth(title)
    const topBarLen = Math.max(0, innerWidth + 2 - titleWidth)
    const leftBar = 4
    const rightBar = Math.max(0, topBarLen - leftBar)
    lines.push(
      `${border}${BOX.roundedTopLeft}${BOX.horizontal.repeat(leftBar)}${title}${BOX.horizontal.repeat(rightBar)}${BOX.roundedTopRight}${ANSI.reset}`
    )

    lines.push(renderRow(''))
    lines.push(renderRow(`${THEME.cyan}${ANSI.bold}Obtenir votre token en 3 étapes${ANSI.reset}`))
    lines.push(renderRow(`${THEME.textBold}1.${ANSI.reset} Ouvrez votre profil dans le dashboard.`))
    lines.push(renderRow(`${THEME.textBold}2.${ANSI.reset} Cliquez sur « Générer un token CLI ».`))
    lines.push(renderRow(`${THEME.textBold}3.${ANSI.reset} Copiez le secret et collez-le ci-dessous.`))
    lines.push(renderRow(''))
    lines.push(renderRow(`${THEME.primary}${ANSI.underline}${this.tokenUrl}${ANSI.reset}`))
    lines.push(renderRow(`${THEME.textMuted}Ou lancez « js-challenge login » dans un autre terminal.${ANSI.reset}`))
    lines.push(renderRow(''))
    lines.push(renderRow(`${THEME.textBold}Token API${ANSI.reset}`))

    const maxMasked = Math.min(this.token.length, innerWidth - 8)
    const masked = '*'.repeat(maxMasked)
    const cursor = `${ANSI.bgWhite}${ANSI.black} ${ANSI.reset}`
    const inputDisplay = `[ ${masked}${cursor} ]`
    lines.push(renderRow(inputDisplay))
    lines.push(renderRow(''))

    if (this.isLoading) {
      lines.push(renderRow(`${THEME.warning}⏳ Vérification du token…${ANSI.reset}`))
    } else if (this.errorMessage) {
      lines.push(renderRow(`${THEME.error}✗ ${this.errorMessage}${ANSI.reset}`))
    } else {
      lines.push(
        renderRow(
          `${THEME.textMuted}[Entrée] Valider │ [Ctrl+Shift+V] Coller │ [Ctrl+Q] Quitter${ANSI.reset}`
        )
      )
    }

    lines.push(renderRow(''))
    lines.push(
      `${border}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(innerWidth + 2)}${BOX.roundedBottomRight}${ANSI.reset}`
    )

    return lines
  }
}
