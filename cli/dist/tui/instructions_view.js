import { ANSI, padRight, THEME } from './ansi.js';
export class InstructionsView {
    scrollOffset = 0;
    challenge = null;
    setChallenge(challenge) {
        this.challenge = challenge;
        this.scrollOffset = 0;
    }
    scrollUp(step = 1) {
        this.scrollOffset = Math.max(0, this.scrollOffset - step);
    }
    scrollDown(step = 1) {
        this.scrollOffset += step;
    }
    wrapText(text, maxWidth) {
        const lines = [];
        const rawParagraphs = text.split(/\r?\n/);
        for (const paragraph of rawParagraphs) {
            if (!paragraph.trim()) {
                lines.push('');
                continue;
            }
            const words = paragraph.split(/\s+/);
            let currentLine = '';
            for (const word of words) {
                if (!currentLine) {
                    currentLine = word;
                }
                else if (currentLine.length + 1 + word.length <= maxWidth) {
                    currentLine += ` ${word}`;
                }
                else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine) {
                lines.push(currentLine);
            }
        }
        return lines;
    }
    render(height, width, isFocused) {
        const lines = [];
        const contentWidth = Math.max(10, width - 4);
        if (!this.challenge) {
            lines.push(`${THEME.textMuted}Sélectionnez un exercice dans la liste de gauche.${ANSI.reset}`);
            while (lines.length < height)
                lines.push(' '.repeat(width));
            return lines.map((l) => padRight(l, width));
        }
        const c = this.challenge;
        const diffBadge = c.difficultyLabel === 'easy'
            ? `${THEME.badgeSuccess} Facile ${ANSI.reset}`
            : c.difficultyLabel === 'medium'
                ? `${THEME.badgeWarning} Moyen ${ANSI.reset}`
                : `${THEME.badgeError} Difficile ${ANSI.reset}`;
        const lockBadge = c.isCompleted
            ? `${THEME.badgeSuccess} Complété ✓ ${ANSI.reset}`
            : c.isUnlocked
                ? `${THEME.badgePrimary} Débloqué ● ${ANSI.reset}`
                : `${THEME.badgeMuted} Verrouillé 🔒 ${ANSI.reset}`;
        const pointsBadge = `${THEME.badgeSecondary} +${c.points} pts ${ANSI.reset}`;
        const categoryBadge = `${THEME.textMuted}[${c.category || 'Général'}]${ANSI.reset}`;
        const header = `${THEME.textBold}#${c.number} ${c.title}${ANSI.reset}`;
        const badges = `${lockBadge} ${diffBadge} ${pointsBadge} ${categoryBadge}`;
        const allLines = [
            header,
            badges,
            `${THEME.borderDim}${'─'.repeat(contentWidth)}${ANSI.reset}`,
            `${THEME.secondary}${ANSI.bold}📋 ÉNONCÉ DU CHALLENGE${ANSI.reset}`,
            ...this.wrapText(c.description, contentWidth).map((l) => {
                if (l.includes('') || l.includes('->') || l.includes('===')) {
                    return `${THEME.cyan}${ANSI.bold}  ${l}${ANSI.reset}`;
                }
                return `${THEME.text}${l}${ANSI.reset}`;
            }),
        ];
        if (c.hint) {
            allLines.push('');
            allLines.push(`${THEME.warning}${ANSI.bold}💡 INDICE / ASTUCE${ANSI.reset}`);
            allLines.push(...this.wrapText(c.hint, contentWidth).map((l) => `${THEME.textMuted}${ANSI.italic}  ${l}${ANSI.reset}`));
        }
        // Scroll handling
        const maxScroll = Math.max(0, allLines.length - height);
        if (this.scrollOffset > maxScroll)
            this.scrollOffset = maxScroll;
        const visibleLines = allLines.slice(this.scrollOffset, this.scrollOffset + height);
        while (visibleLines.length < height) {
            visibleLines.push(' '.repeat(contentWidth));
        }
        return visibleLines.map((l) => ` ${padRight(l, width - 1)}`);
    }
}
//# sourceMappingURL=instructions_view.js.map