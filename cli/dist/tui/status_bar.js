import { ANSI, padRight, THEME } from './ansi.js';
export class StatusBar {
    user = null;
    activePanel = 'tree';
    notification = null;
    notificationTimer = null;
    setUser(user) {
        this.user = user;
    }
    setActivePanel(panel) {
        this.activePanel = panel;
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
        const userStr = this.user
            ? `${THEME.success}● ${THEME.textBold}${this.user.username}${ANSI.reset}`
            : `${THEME.warning}○ Déconnecté${ANSI.reset}`;
        const pTree = this.activePanel === 'tree'
            ? `${THEME.badgePrimary} 1: Exercices ${ANSI.reset}`
            : `${THEME.badgeMuted} 1: Exercices ${ANSI.reset}`;
        const pInstructions = this.activePanel === 'instructions'
            ? `${THEME.badgePrimary} 2: Consignes ${ANSI.reset}`
            : `${THEME.badgeMuted} 2: Consignes ${ANSI.reset}`;
        const pEditor = this.activePanel === 'editor'
            ? `${THEME.badgePrimary} 3: Éditeur ${ANSI.reset}`
            : `${THEME.badgeMuted} 3: Éditeur ${ANSI.reset}`;
        const pResults = this.activePanel === 'results'
            ? `${THEME.badgePrimary} 4: Tests ${ANSI.reset}`
            : `${THEME.badgeMuted} 4: Tests ${ANSI.reset}`;
        const panels = `${pTree} ${pInstructions} ${pEditor} ${pResults}`;
        let shortcuts = '';
        if (this.notification) {
            shortcuts = `${THEME.badgeWarning} ℹ ${this.notification} ${ANSI.reset}`;
        }
        else if (this.activePanel === 'tree') {
            shortcuts = `${THEME.textMuted}[↑↓/jk] Naviguer │ [/] Chercher │ [f] Filtrer │ [Ctrl+T] ▶ Tester │ [Ctrl+S] ✓ Valider │ [?] Aide${ANSI.reset}`;
        }
        else if (this.activePanel === 'editor') {
            shortcuts = `${THEME.textMuted}[Saisie directe] │ [Ctrl+T] ▶ Tester │ [Ctrl+S] ✓ Valider │ [Échap] Arbre │ [?] Aide${ANSI.reset}`;
        }
        else if (this.activePanel === 'instructions') {
            shortcuts = `${THEME.textMuted}[↑↓/Molette] Défiler énoncé │ [Tab] Éditeur │ [Ctrl+T] Tester │ [Ctrl+S] Valider │ [?] Aide${ANSI.reset}`;
        }
        else {
            shortcuts = `${THEME.textMuted}[↑↓/Molette] Défiler logs │ [Ctrl+T] Relancer test │ [Ctrl+S] Valider │ [?] Aide${ANSI.reset}`;
        }
        const left = ` ${userStr} │ ${panels} `;
        const right = `${shortcuts} `;
        return [`${THEME.surface}${padRight(left + right, width)}${ANSI.reset}`];
    }
}
//# sourceMappingURL=status_bar.js.map