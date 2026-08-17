import { ANSI, padRight, THEME } from './ansi.js';
export class StatusBar {
    user = null;
    activePanel = 'tree';
    notification = null;
    notificationTimer = null;
    cursorRow = 0;
    cursorCol = 0;
    setUser(user) {
        this.user = user;
    }
    setActivePanel(panel) {
        this.activePanel = panel;
    }
    setCursor(row, col) {
        this.cursorRow = row;
        this.cursorCol = col;
    }
    showNotification(msg, durationMs = 3500) {
        this.notification = msg;
        if (this.notificationTimer)
            clearTimeout(this.notificationTimer);
        this.notificationTimer = setTimeout(() => {
            this.notification = null;
        }, durationMs);
    }
    render(width) {
        // Mode pill (Lualine style)
        const modePill = this.activePanel === 'editor'
            ? `\x1b[48;2;158;206;106m\x1b[38;2;26;27;38m\x1b[1m INSERT \x1b[0m`
            : `\x1b[48;2;122;162;247m\x1b[38;2;26;27;38m\x1b[1m NORMAL \x1b[0m`;
        // Tab pills
        const pTree = this.activePanel === 'tree'
            ? `${THEME.badgePrimary} 1: Exercices ${ANSI.reset}`
            : `${THEME.badgeMuted} 1: Exercices ${ANSI.reset}`;
        const pInstructions = this.activePanel === 'instructions'
            ? `${THEME.badgePrimary} 2: Consignes ${ANSI.reset}`
            : `${THEME.badgeMuted} 2: Consignes ${ANSI.reset}`;
        const pEditor = this.activePanel === 'editor'
            ? `${THEME.badgePrimary} 3: Éditeur ${ANSI.reset}`
            : `${THEME.badgeMuted} 3: Éditeur ${ANSI.reset}`;
        const userPill = this.user
            ? `${THEME.success}● ${THEME.textBold}${this.user.username}${ANSI.reset}`
            : `${THEME.warning}○ Déconnecté${ANSI.reset}`;
        const posPill = `\x1b[48;2;36;40;59m\x1b[38;2;192;202;245m Ln ${this.cursorRow + 1}, Col ${this.cursorCol + 1} \x1b[0m`;
        let actionHint = '';
        if (this.notification) {
            actionHint = `${THEME.badgeWarning} ℹ ${this.notification} ${ANSI.reset}`;
        }
        else if (this.activePanel === 'tree') {
            actionHint = `${THEME.textMuted}[↑↓/jk] Naviguer │ [/] Chercher │ [f] Filtrer │ [Ctrl+T] Tester │ [?] Aide${ANSI.reset}`;
        }
        else if (this.activePanel === 'editor') {
            actionHint = `${THEME.textMuted}[Ctrl+T] ▶ Tester │ [Ctrl+S] ✓ Valider │ [Échap] Arbre │ [?] Aide${ANSI.reset}`;
        }
        else if (this.activePanel === 'instructions') {
            actionHint = `${THEME.textMuted}[↑↓/Molette] Défiler │ [Tab] Éditeur │ [Ctrl+T] Tester │ [?] Aide${ANSI.reset}`;
        }
        const left = ` ${modePill} ${pTree} ${pInstructions} ${pEditor} `;
        const right = ` ${actionHint} │ ${posPill} │ ${userPill} `;
        return [`${THEME.surface}${padRight(left + right, width)}${ANSI.reset}`];
    }
}
//# sourceMappingURL=status_bar.js.map