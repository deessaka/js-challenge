import { ANSI, BOX, padCenter, THEME } from './ansi.js';
export class LoginModal {
    tokenUrl;
    token = '';
    errorMessage = null;
    isLoading = false;
    constructor(tokenUrl = 'http://localhost:3333/profile#api-token') {
        this.tokenUrl = tokenUrl;
    }
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
        const modalWidth = Math.min(76, termWidth - 4);
        const innerWidth = modalWidth - 2;
        const lines = [];
        const line = (content = '') => `${THEME.borderFocus}${BOX.vertical}${THEME.surface}${padCenter(content, innerWidth)}${THEME.borderFocus}${BOX.vertical}${ANSI.reset}`;
        lines.push(`${THEME.borderFocus}${BOX.roundedTopLeft}${BOX.horizontal.repeat(4)} ${THEME.primary}${ANSI.bold}Connexion terminal JS Challenge${THEME.borderFocus} ${BOX.horizontal.repeat(Math.max(0, innerWidth - 34))}${BOX.roundedTopRight}${ANSI.reset}`);
        lines.push(line());
        lines.push(line(`${THEME.cyan}${ANSI.bold}Obtenir votre token en 3 étapes${ANSI.reset}`));
        lines.push(line(`${THEME.textBold}1.${ANSI.reset} Ouvrez votre profil dans le dashboard.`));
        lines.push(line(`${THEME.textBold}2.${ANSI.reset} Cliquez sur « Générer un token CLI ».`));
        lines.push(line(`${THEME.textBold}3.${ANSI.reset} Copiez le secret et collez-le ci-dessous.`));
        lines.push(line());
        lines.push(line(`${THEME.primary}${ANSI.underline}${this.tokenUrl}${ANSI.reset}`));
        lines.push(line(`${THEME.textMuted}Vous pouvez aussi lancer « js-challenge login » dans un autre terminal.${ANSI.reset}`));
        lines.push(line());
        lines.push(line(`${THEME.textBold}Token API${ANSI.reset}`));
        const masked = '*'.repeat(this.token.length);
        const cursor = `${ANSI.bgWhite}${ANSI.black} ${ANSI.reset}`;
        const inputDisplay = `[ ${masked}${cursor}${' '.repeat(Math.max(0, innerWidth - 8 - this.token.length))} ]`;
        lines.push(line(inputDisplay));
        lines.push(line());
        if (this.isLoading) {
            lines.push(line(`${THEME.warning}[~] Vérification du token…${ANSI.reset}`));
        }
        else if (this.errorMessage) {
            lines.push(line(`${THEME.error}[ERR] ${this.errorMessage}${ANSI.reset}`));
        }
        else {
            lines.push(line(`${THEME.textMuted}[Entrée] Valider │ [Ctrl+Shift+V] Coller │ [Ctrl+Q] Quitter${ANSI.reset}`));
        }
        lines.push(line());
        lines.push(`${THEME.borderFocus}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(innerWidth)}${BOX.roundedBottomRight}${ANSI.reset}`);
        return lines;
    }
}
//# sourceMappingURL=login_modal.js.map