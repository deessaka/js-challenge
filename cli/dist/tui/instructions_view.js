import { ANSI, padRight } from './ansi.js';
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
        for (const paragraph of text.split(/\r?\n/)) {
            if (!paragraph.trim()) {
                lines.push('');
                continue;
            }
            let currentLine = '';
            for (const word of paragraph.split(/\s+/)) {
                if (word.length > maxWidth) {
                    if (currentLine) {
                        lines.push(currentLine);
                        currentLine = '';
                    }
                    for (let index = 0; index < word.length; index += maxWidth) {
                        lines.push(word.slice(index, index + maxWidth));
                    }
                    continue;
                }
                if (!currentLine)
                    currentLine = word;
                else if (currentLine.length + 1 + word.length <= maxWidth)
                    currentLine += ` ${word}`;
                else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine)
                lines.push(currentLine);
        }
        return lines;
    }
    render(height, width, isFocused) {
        const contentWidth = Math.max(10, width - 4);
        if (!this.challenge) {
            const empty = `${ANSI.dim}Sélectionnez un exercice dans la liste.${ANSI.reset}`;
            return [empty, ...Array(Math.max(0, height - 1)).fill(' ')].map((line) => padRight(line, width));
        }
        const challenge = this.challenge;
        const difficultyColor = challenge.difficultyLabel === 'easy'
            ? ANSI.brightGreen
            : challenge.difficultyLabel === 'medium'
                ? ANSI.brightYellow
                : ANSI.brightRed;
        const state = challenge.isCompleted
            ? `${ANSI.brightGreen}[OK] COMPLÉTÉ${ANSI.reset}`
            : challenge.isUnlocked
                ? `${ANSI.brightBlue}[>>] DISPONIBLE${ANSI.reset}`
                : `${ANSI.gray}[--] VERROUILLÉ${ANSI.reset}`;
        const headingColor = isFocused ? ANSI.brightCyan : ANSI.brightWhite;
        const heading = `${headingColor}${ANSI.bold}#${challenge.number} ${challenge.title}${ANSI.reset}`;
        const badges = `${state} ${difficultyColor}[${challenge.difficultyLabel}]${ANSI.reset} ${ANSI.cyan}[${challenge.points} pts]${ANSI.reset} ${ANSI.gray}[${challenge.category}]${ANSI.reset}`;
        const allLines = [
            heading,
            badges,
            `${ANSI.gray}${'─'.repeat(contentWidth)}${ANSI.reset}`,
            `${ANSI.bold}${ANSI.yellow}ÉNONCÉ${ANSI.reset}`,
            ...this.wrapText(challenge.description, contentWidth).map((line) => `${ANSI.white}${line}${ANSI.reset}`),
        ];
        if (challenge.hint) {
            allLines.push('');
            allLines.push(`${ANSI.bold}${ANSI.brightCyan}INDICE${ANSI.reset}`);
            allLines.push(...this.wrapText(challenge.hint, contentWidth).map((line) => `${ANSI.italic}${ANSI.cyan}${line}${ANSI.reset}`));
        }
        const maxScroll = Math.max(0, allLines.length - height);
        this.scrollOffset = Math.min(this.scrollOffset, maxScroll);
        const visibleLines = allLines.slice(this.scrollOffset, this.scrollOffset + height);
        while (visibleLines.length < height)
            visibleLines.push(' '.repeat(width));
        return visibleLines.map((line) => ` ${padRight(line, width - 1)}`);
    }
}
//# sourceMappingURL=instructions_view.js.map