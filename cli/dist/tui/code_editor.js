import { ANSI, BOX, padCenter, padRight, THEME } from './ansi.js';
const JS_KEYWORDS = new Set([
    'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
    'do', 'switch', 'case', 'default', 'break', 'continue', 'try', 'catch',
    'finally', 'throw', 'async', 'await', 'class', 'extends', 'super', 'this',
    'new', 'typeof', 'instanceof', 'import', 'export', 'from', 'as', 'yield',
    'null', 'undefined', 'true', 'false', 'NaN', 'Infinity'
]);
export class CodeEditor {
    lines = [''];
    cursorRow = 0;
    cursorCol = 0;
    scrollRow = 0;
    scrollCol = 0;
    isModified = false;
    isLocked = false;
    lockedMessage = 'Cet exercice est verrouillé.';
    setText(text, isLocked = false, lockedMessage = 'Cet exercice est verrouillé.') {
        this.lines = text.split(/\r?\n/);
        if (this.lines.length === 0)
            this.lines = [''];
        this.cursorRow = 0;
        this.cursorCol = 0;
        this.scrollRow = 0;
        this.scrollCol = 0;
        this.isModified = false;
        this.isLocked = isLocked;
        this.lockedMessage = lockedMessage;
    }
    getText() {
        return this.lines.join('\n');
    }
    insertChar(char) {
        if (this.isLocked)
            return false;
        const currentLine = this.lines[this.cursorRow] || '';
        this.lines[this.cursorRow] =
            currentLine.slice(0, this.cursorCol) + char + currentLine.slice(this.cursorCol);
        this.cursorCol += char.length;
        this.isModified = true;
        return true;
    }
    insertTab() {
        if (this.isLocked)
            return false;
        return this.insertChar('  ');
    }
    handleEnter() {
        if (this.isLocked)
            return false;
        const currentLine = this.lines[this.cursorRow] || '';
        const leadingWhitespace = currentLine.match(/^\s*/)?.[0] || '';
        const beforeCursor = currentLine.slice(0, this.cursorCol);
        const afterCursor = currentLine.slice(this.cursorCol);
        let nextIndent = leadingWhitespace;
        if (beforeCursor.trimEnd().endsWith('{') || beforeCursor.trimEnd().endsWith('(')) {
            nextIndent += '  ';
        }
        this.lines[this.cursorRow] = beforeCursor;
        this.lines.splice(this.cursorRow + 1, 0, nextIndent + afterCursor);
        this.cursorRow += 1;
        this.cursorCol = nextIndent.length;
        this.isModified = true;
        return true;
    }
    handleBackspace() {
        if (this.isLocked)
            return false;
        if (this.cursorCol > 0) {
            const currentLine = this.lines[this.cursorRow];
            if (this.cursorCol >= 2 &&
                currentLine.slice(this.cursorCol - 2, this.cursorCol) === '  ' &&
                /^\s*$/.test(currentLine.slice(0, this.cursorCol))) {
                this.lines[this.cursorRow] =
                    currentLine.slice(0, this.cursorCol - 2) + currentLine.slice(this.cursorCol);
                this.cursorCol -= 2;
            }
            else {
                this.lines[this.cursorRow] =
                    currentLine.slice(0, this.cursorCol - 1) + currentLine.slice(this.cursorCol);
                this.cursorCol -= 1;
            }
            this.isModified = true;
            return true;
        }
        else if (this.cursorRow > 0) {
            const prevLine = this.lines[this.cursorRow - 1];
            const currentLine = this.lines[this.cursorRow];
            this.cursorCol = prevLine.length;
            this.lines[this.cursorRow - 1] = prevLine + currentLine;
            this.lines.splice(this.cursorRow, 1);
            this.cursorRow -= 1;
            this.isModified = true;
            return true;
        }
        return false;
    }
    handleDelete() {
        if (this.isLocked)
            return false;
        const currentLine = this.lines[this.cursorRow];
        if (this.cursorCol < currentLine.length) {
            this.lines[this.cursorRow] =
                currentLine.slice(0, this.cursorCol) + currentLine.slice(this.cursorCol + 1);
            this.isModified = true;
            return true;
        }
        else if (this.cursorRow < this.lines.length - 1) {
            const nextLine = this.lines[this.cursorRow + 1];
            this.lines[this.cursorRow] = currentLine + nextLine;
            this.lines.splice(this.cursorRow + 1, 1);
            this.isModified = true;
            return true;
        }
        return false;
    }
    handleClick(lineOffset, colOffset, gutterWidth) {
        const targetLine = this.scrollRow + lineOffset;
        if (targetLine >= 0 && targetLine < this.lines.length) {
            this.cursorRow = targetLine;
            const targetCol = Math.max(0, this.scrollCol + colOffset - gutterWidth - 2);
            this.cursorCol = Math.min(targetCol, (this.lines[this.cursorRow] || '').length);
        }
    }
    moveLeft() {
        if (this.cursorCol > 0) {
            this.cursorCol -= 1;
        }
        else if (this.cursorRow > 0) {
            this.cursorRow -= 1;
            this.cursorCol = this.lines[this.cursorRow].length;
        }
    }
    moveRight() {
        const currentLine = this.lines[this.cursorRow] || '';
        if (this.cursorCol < currentLine.length) {
            this.cursorCol += 1;
        }
        else if (this.cursorRow < this.lines.length - 1) {
            this.cursorRow += 1;
            this.cursorCol = 0;
        }
    }
    moveUp() {
        if (this.cursorRow > 0) {
            this.cursorRow -= 1;
            this.cursorCol = Math.min(this.cursorCol, this.lines[this.cursorRow].length);
        }
    }
    moveDown() {
        if (this.cursorRow < this.lines.length - 1) {
            this.cursorRow += 1;
            this.cursorCol = Math.min(this.cursorCol, this.lines[this.cursorRow].length);
        }
    }
    moveHome() {
        const currentLine = this.lines[this.cursorRow] || '';
        const firstNonSpace = currentLine.search(/\S/);
        if (firstNonSpace !== -1 && this.cursorCol !== firstNonSpace) {
            this.cursorCol = firstNonSpace;
        }
        else {
            this.cursorCol = 0;
        }
    }
    moveEnd() {
        this.cursorCol = (this.lines[this.cursorRow] || '').length;
    }
    pageUp(pageSize) {
        this.cursorRow = Math.max(0, this.cursorRow - pageSize);
        this.cursorCol = Math.min(this.cursorCol, (this.lines[this.cursorRow] || '').length);
    }
    pageDown(pageSize) {
        this.cursorRow = Math.min(this.lines.length - 1, this.cursorRow + pageSize);
        this.cursorCol = Math.min(this.cursorCol, (this.lines[this.cursorRow] || '').length);
    }
    ensureCursorVisible(viewHeight, viewWidth, gutterWidth) {
        const codeAreaWidth = Math.max(10, viewWidth - gutterWidth - 2);
        if (this.cursorRow < this.scrollRow) {
            this.scrollRow = this.cursorRow;
        }
        else if (this.cursorRow >= this.scrollRow + viewHeight) {
            this.scrollRow = this.cursorRow - viewHeight + 1;
        }
        if (this.cursorCol < this.scrollCol) {
            this.scrollCol = this.cursorCol;
        }
        else if (this.cursorCol >= this.scrollCol + codeAreaWidth) {
            this.scrollCol = this.cursorCol - codeAreaWidth + 1;
        }
    }
    highlightLine(line) {
        if (!line)
            return '';
        let result = '';
        let idx = 0;
        const len = line.length;
        while (idx < len) {
            // Comments
            if (line[idx] === '/' && line[idx + 1] === '/') {
                result += `${THEME.textMuted}${ANSI.italic}${line.slice(idx)}${ANSI.reset}`;
                break;
            }
            // Strings
            if (line[idx] === "'" || line[idx] === '"' || line[idx] === '`') {
                const quote = line[idx];
                let str = quote;
                idx += 1;
                while (idx < len && line[idx] !== quote) {
                    if (line[idx] === '\\' && idx + 1 < len) {
                        str += line[idx] + line[idx + 1];
                        idx += 2;
                    }
                    else {
                        str += line[idx];
                        idx += 1;
                    }
                }
                if (idx < len) {
                    str += line[idx];
                    idx += 1;
                }
                result += `${THEME.success}${str}${ANSI.reset}`;
                continue;
            }
            // Numbers
            if (/\d/.test(line[idx])) {
                let num = '';
                while (idx < len && /[\d._xb]/.test(line[idx])) {
                    num += line[idx];
                    idx += 1;
                }
                result += `${THEME.orange}${num}${ANSI.reset}`;
                continue;
            }
            // Identifiers / Keywords
            if (/[a-zA-Z_$]/.test(line[idx])) {
                let word = '';
                while (idx < len && /[a-zA-Z0-9_$]/.test(line[idx])) {
                    word += line[idx];
                    idx += 1;
                }
                if (JS_KEYWORDS.has(word)) {
                    result += `${THEME.secondary}${ANSI.bold}${word}${ANSI.reset}`;
                }
                else if (idx < len && line[idx] === '(') {
                    result += `${THEME.primary}${word}${ANSI.reset}`;
                }
                else {
                    result += `${THEME.text}${word}${ANSI.reset}`;
                }
                continue;
            }
            // Symbols & Operators
            if (/[=+\-*/%&|^!<>?:;.,{}()[\]]/.test(line[idx])) {
                result += `${THEME.cyan}${line[idx]}${ANSI.reset}`;
                idx += 1;
                continue;
            }
            result += line[idx];
            idx += 1;
        }
        return result;
    }
    render(height, width, isFocused) {
        const gutterWidth = Math.max(3, String(this.lines.length).length + 1);
        this.ensureCursorVisible(height, width, gutterWidth);
        const renderedLines = [];
        const codeAreaWidth = Math.max(5, width - gutterWidth - 2);
        if (this.isLocked) {
            const bannerHeight = 7;
            const startPad = Math.max(0, Math.floor((height - bannerHeight) / 2));
            for (let i = 0; i < startPad; i += 1) {
                renderedLines.push(' '.repeat(width));
            }
            renderedLines.push(padCenter(`${THEME.badgeWarning} 🔒 CHALLENGE ACTUELLEMENT VERROUILLÉ ${ANSI.reset}`, width));
            renderedLines.push(padCenter(`${THEME.textMuted}${this.lockedMessage}${ANSI.reset}`, width));
            renderedLines.push(padCenter(`${THEME.borderDim}${BOX.horizontal.repeat(Math.min(48, width - 4))}${ANSI.reset}`, width));
            renderedLines.push(padCenter(`${THEME.text}Résolvez les exercices précédents pour débloquer l'écriture.${ANSI.reset}`, width));
            renderedLines.push(padCenter(`${THEME.textDim}[Tab] Arbre │ [Entrée] Sélectionner un exercice débloqué${ANSI.reset}`, width));
            while (renderedLines.length < height) {
                renderedLines.push(' '.repeat(width));
            }
            return renderedLines.map((l) => padRight(l, width));
        }
        for (let i = 0; i < height; i += 1) {
            const lineIndex = this.scrollRow + i;
            if (lineIndex < this.lines.length) {
                const isCurrentLine = isFocused && lineIndex === this.cursorRow;
                const rawLine = this.lines[lineIndex];
                const visibleSlice = rawLine.slice(this.scrollCol, this.scrollCol + codeAreaWidth);
                const lineNumStr = String(lineIndex + 1).padStart(gutterWidth - 1, ' ');
                const gutter = isCurrentLine
                    ? `${THEME.warning}${ANSI.bold}${lineNumStr} │${ANSI.reset}`
                    : `${THEME.textDim}${lineNumStr} │${ANSI.reset}`;
                let lineContent = '';
                if (isCurrentLine) {
                    const colInSlice = this.cursorCol - this.scrollCol;
                    if (colInSlice >= 0 && colInSlice <= visibleSlice.length) {
                        const before = visibleSlice.slice(0, colInSlice);
                        const cursorChar = visibleSlice[colInSlice] || ' ';
                        const after = visibleSlice.slice(colInSlice + 1);
                        const highlightedBefore = this.highlightLine(before);
                        const highlightedAfter = this.highlightLine(after);
                        const highlightedCursor = `${ANSI.bgWhite}${ANSI.black}${cursorChar}${ANSI.reset}`;
                        lineContent = `${highlightedBefore}${highlightedCursor}${highlightedAfter}`;
                    }
                    else {
                        lineContent = this.highlightLine(visibleSlice);
                    }
                }
                else {
                    lineContent = this.highlightLine(visibleSlice);
                }
                const paddedContent = padRight(lineContent, codeAreaWidth);
                const linePrefix = isCurrentLine ? THEME.surfaceHighlight : '';
                renderedLines.push(`${linePrefix} ${gutter} ${paddedContent}${ANSI.reset}`);
            }
            else {
                const emptyGutter = `${THEME.textDim}${' '.repeat(gutterWidth - 1)} │${ANSI.reset}`;
                renderedLines.push(` ${emptyGutter} ${' '.repeat(codeAreaWidth)}`);
            }
        }
        return renderedLines;
    }
}
//# sourceMappingURL=code_editor.js.map