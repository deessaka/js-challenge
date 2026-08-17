import { ANSI, BOX, padCenter } from './ansi.js'

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
    const modalWidth = Math.min(76, termWidth - 4)
    const innerWidth = modalWidth - 2
    const lines: string[] = []
    const line = (content = '') => `${BOX.vertical}${padCenter(content, innerWidth)}${BOX.vertical}`

    lines.push(
      `${BOX.topLeft}${BOX.horizontalHeavy.repeat(4)} Connexion terminal JS Challenge ${BOX.horizontalHeavy.repeat(Math.max(0, innerWidth - 34))}${BOX.topRight}`
    )
    lines.push(line())
    lines.push(line(`${ANSI.focus}${ANSI.bold}Obtenir votre token en 3 étapes${ANSI.reset}`))
    lines.push(line(`${ANSI.brightWhite}1.${ANSI.reset} Ouvrez votre profil dans le dashboard.`))
    lines.push(line(`${ANSI.brightWhite}2.${ANSI.reset} Cliquez sur « Générer un token CLI ».`))
    lines.push(line(`${ANSI.brightWhite}3.${ANSI.reset} Copiez le secret et collez-le ci-dessous.`))
    lines.push(line())
    lines.push(line(`${ANSI.brightCyan}${this.tokenUrl}${ANSI.reset}`))
    lines.push(
      line(
        `${ANSI.muted}Vous pouvez aussi lancer « js-challenge login » dans un autre terminal.${ANSI.reset}`
      )
    )
    lines.push(line())
    lines.push(line(`${ANSI.brightWhite}${ANSI.bold}Token API${ANSI.reset}`))

    const masked = '*'.repeat(this.token.length)
    const cursor = `${ANSI.bgWhite}${ANSI.black} ${ANSI.reset}`
    const inputDisplay = `[ ${masked}${cursor}${' '.repeat(Math.max(0, innerWidth - 8 - this.token.length))} ]`
    lines.push(line(inputDisplay))
    lines.push(line())

    if (this.isLoading) {
      lines.push(line(`${ANSI.warning}[~] Vérification du token…${ANSI.reset}`))
    } else if (this.errorMessage) {
      lines.push(line(`${ANSI.error}[ERR] ${this.errorMessage}${ANSI.reset}`))
    } else {
      lines.push(
        line(
          `${ANSI.muted}[Entrée] Valider | [Ctrl+Shift+V] Coller | [Ctrl+Q] Quitter${ANSI.reset}`
        )
      )
    }

    lines.push(line())
    lines.push(`${BOX.bottomLeft}${BOX.horizontalHeavy.repeat(innerWidth)}${BOX.bottomRight}`)

    return lines.map((entry) => `${ANSI.panelSurface}${ANSI.brightWhite}${entry}${ANSI.reset}`)
  }
}
