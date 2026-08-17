import { ANSI, padRight, truncate } from './ansi.js';
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
    showNotification(message, durationMs = 3500) {
        this.notification = message;
        if (this.notificationTimer)
            clearTimeout(this.notificationTimer);
        this.notificationTimer = setTimeout(() => {
            this.notification = null;
            this.notificationTimer = null;
        }, durationMs);
    }
    render(width) {
        const userLabel = this.user
            ? `${ANSI.brightGreen}@ ${this.user.username}${ANSI.reset}`
            : `${ANSI.yellow}Non connecté${ANSI.reset}`;
        const panel = (label, panelName) => this.activePanel === panelName
            ? `${ANSI.bgBlue}${ANSI.white}${ANSI.bold} ${label} ${ANSI.reset}`
            : `${ANSI.bgDarkGray}${ANSI.gray} ${label} ${ANSI.reset}`;
        const panels = [
            panel('1 Exercices', 'tree'),
            panel('2 Consignes', 'instructions'),
            panel('3 Éditeur', 'editor'),
            panel('4 Tests', 'results'),
        ].join(' ');
        let shortcuts = '';
        if (this.notification) {
            shortcuts = `${ANSI.bgYellow}${ANSI.black}${ANSI.bold} ! ${this.notification} ${ANSI.reset}`;
        }
        else if (this.activePanel === 'editor') {
            shortcuts = `${ANSI.dim}[Tab] focus  [Ctrl+T/F5] vérifier  [Ctrl+S/F6] soumettre  [?] aide${ANSI.reset}`;
        }
        else if (this.activePanel === 'results') {
            shortcuts = `${ANSI.dim}[↑↓/j k] défiler  [Ctrl+T/F5] relancer  [Ctrl+S/F6] soumettre  [?] aide${ANSI.reset}`;
        }
        else {
            shortcuts = `${ANSI.dim}[↑↓/j k] naviguer  [Tab] focus  [Entrée] ouvrir  [?] aide  [Ctrl+Q] quitter${ANSI.reset}`;
        }
        return `${ANSI.bgBlack}${padRight(truncate(` ${userLabel} │ ${panels} │ ${shortcuts} `, width), width)}${ANSI.reset}`;
    }
}
//# sourceMappingURL=status_bar.js.map