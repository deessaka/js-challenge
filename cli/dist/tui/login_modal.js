import { ANSI, BOX, padCenter } from './ansi.js';
export class LoginModal {
    token = '';
    errorMessage = null;
    isLoading = false;
    insertChar(char) {
        this.token += char;
        this.errorMessage = null;
    }
    handleBackspace() {
        if (this.token.length > 0) {
            this.token = this.token.slice(0, -1);
            this.errorMessage = null;
        }
    }
    clear() {
        this.token = '';
        this.errorMessage = null;
        this.isLoading = false;
    }
    render(_termHeight, termWidth) {
        const modalWidth = Math.min(64, termWidth - 4);
        const innerWidth = modalWidth - 2;
        const lines = [];
        // Top border
        lines.push(`${BOX.topLeft}${BOX.horizontal.repeat(4)} Connexion JS Challenge ${BOX.horizontal.repeat(Math.max(0, innerWidth - 24))}${BOX.topRight}`);
        // Body
        lines.push(`${BOX.vertical}${padCenter('', innerWidth)}${BOX.vertical}`);
        lines.push(`${BOX.vertical}${padCenter('Veuillez entrer votre jeton API pour continuer :', innerWidth)}${BOX.vertical}`);
        lines.push(`${BOX.vertical}${padCenter('', innerWidth)}${BOX.vertical}`);
        // Input box
        const masked = '*'.repeat(this.token.length);
        const cursor = `${ANSI.bgWhite}${ANSI.black} ${ANSI.reset}`;
        const inputDisplay = `[ ${masked}${cursor}${' '.repeat(Math.max(0, innerWidth - 8 - this.token.length))} ]`;
        lines.push(`${BOX.vertical}${padCenter(inputDisplay, innerWidth)}${BOX.vertical}`);
        lines.push(`${BOX.vertical}${padCenter('', innerWidth)}${BOX.vertical}`);
        if (this.isLoading) {
            lines.push(`${BOX.vertical}${padCenter(`${ANSI.brightYellow}[~] Vérification du jeton...${ANSI.reset}`, innerWidth)}${BOX.vertical}`);
        }
        else if (this.errorMessage) {
            lines.push(`${BOX.vertical}${padCenter(`${ANSI.brightRed}[ERR] ${this.errorMessage}${ANSI.reset}`, innerWidth)}${BOX.vertical}`);
        }
        else {
            lines.push(`${BOX.vertical}${padCenter(`${ANSI.dim}[Entrée] Valider | [Ctrl+Shift+V] Coller | [Ctrl+Q] Quitter${ANSI.reset}`, innerWidth)}${BOX.vertical}`);
        }
        lines.push(`${BOX.vertical}${padCenter('', innerWidth)}${BOX.vertical}`);
        // Bottom border
        lines.push(`${BOX.bottomLeft}${BOX.horizontal.repeat(innerWidth)}${BOX.bottomRight}`);
        // Style the modal with bright border and background
        return lines.map((line) => `${ANSI.bgDarkGray}${ANSI.brightWhite}${ANSI.bold}${line}${ANSI.reset}`);
    }
}
//# sourceMappingURL=login_modal.js.map