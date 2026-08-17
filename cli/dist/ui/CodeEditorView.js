import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import { COLORS } from './theme.js';
const JS_KEYWORDS = new Set([
    'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'while',
    'do', 'switch', 'case', 'default', 'break', 'continue', 'try', 'catch',
    'finally', 'throw', 'async', 'await', 'class', 'extends', 'super', 'this',
    'new', 'typeof', 'instanceof', 'import', 'export', 'from', 'as', 'yield',
    'null', 'undefined', 'true', 'false', 'NaN', 'Infinity'
]);
export const CodeEditorView = ({ challenge, initialCode, onSaveCode, onTestLocally, onSubmitSolution, onBack, visibleLinesCount = 16, }) => {
    const [mode, setMode] = useState('NORMAL');
    const [lines, setLines] = useState(() => {
        const split = initialCode.split(/\r?\n/);
        return split.length > 0 ? split : [''];
    });
    const [cursorRow, setCursorRow] = useState(0);
    const [cursorCol, setCursorCol] = useState(0);
    const [scrollRow, setScrollRow] = useState(0);
    const [isSaved, setIsSaved] = useState(true);
    const [pendingKey, setPendingKey] = useState(null);
    // Undo / Redo history stacks
    const historyRef = useRef([
        {
            lines: initialCode.split(/\r?\n/).length > 0 ? initialCode.split(/\r?\n/) : [''],
            cursorRow: 0,
            cursorCol: 0,
        },
    ]);
    const historyIndexRef = useRef(0);
    const saveTimerRef = useRef(null);
    const currentCodeRef = useRef(initialCode);
    const pushHistory = useCallback((newLines, r, c) => {
        const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
        nextHistory.push({ lines: [...newLines], cursorRow: r, cursorCol: c });
        if (nextHistory.length > 50)
            nextHistory.shift();
        historyRef.current = nextHistory;
        historyIndexRef.current = nextHistory.length - 1;
    }, []);
    // Reset editor when challenge changes
    useEffect(() => {
        const split = initialCode.split(/\r?\n/);
        const initial = split.length > 0 ? split : [''];
        setLines(initial);
        setCursorRow(0);
        setCursorCol(0);
        setScrollRow(0);
        setMode('NORMAL');
        setPendingKey(null);
        setIsSaved(true);
        currentCodeRef.current = initialCode;
        historyRef.current = [{ lines: [...initial], cursorRow: 0, cursorCol: 0 }];
        historyIndexRef.current = 0;
    }, [challenge.id]);
    // Auto-scroll viewport
    useEffect(() => {
        if (cursorRow < scrollRow) {
            setScrollRow(cursorRow);
        }
        else if (cursorRow >= scrollRow + visibleLinesCount) {
            setScrollRow(cursorRow - visibleLinesCount + 1);
        }
    }, [cursorRow, scrollRow, visibleLinesCount]);
    // Debounced save
    const scheduleSave = useCallback((newLines) => {
        const code = newLines.join('\n');
        currentCodeRef.current = code;
        setIsSaved(false);
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }
        saveTimerRef.current = setTimeout(async () => {
            await onSaveCode(code);
            setIsSaved(true);
        }, 300);
    }, [onSaveCode]);
    const flushSave = useCallback(async () => {
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
        }
        await onSaveCode(currentCodeRef.current);
        setIsSaved(true);
    }, [onSaveCode]);
    // Word navigation helpers
    const getNextWordCol = useCallback((line, col) => {
        let i = col;
        const len = line.length;
        if (i >= len)
            return len;
        // Skip current word
        while (i < len && /[a-zA-Z0-9_$]/.test(line[i]))
            i++;
        // Skip spaces
        while (i < len && /\s/.test(line[i]))
            i++;
        return Math.min(len, i);
    }, []);
    const getPrevWordCol = useCallback((line, col) => {
        let i = col - 1;
        if (i <= 0)
            return 0;
        // Skip spaces
        while (i > 0 && /\s/.test(line[i]))
            i--;
        // Skip word
        while (i > 0 && /[a-zA-Z0-9_$]/.test(line[i - 1]))
            i--;
        return Math.max(0, i);
    }, []);
    // Syntax highlighter for line segments
    const renderHighlightedSegment = useCallback((text, keyPrefix) => {
        if (!text)
            return null;
        const tokens = [];
        let idx = 0;
        const len = text.length;
        while (idx < len) {
            // Comments
            if (text[idx] === '/' && text[idx + 1] === '/') {
                tokens.push(_jsx(Text, { color: COLORS.textMuted, italic: true, children: text.slice(idx) }, `${keyPrefix}-c-${idx}`));
                break;
            }
            // Strings
            if (text[idx] === "'" || text[idx] === '"' || text[idx] === '`') {
                const quote = text[idx];
                let str = quote;
                idx += 1;
                while (idx < len && text[idx] !== quote) {
                    if (text[idx] === '\\' && idx + 1 < len) {
                        str += text[idx] + text[idx + 1];
                        idx += 2;
                    }
                    else {
                        str += text[idx];
                        idx += 1;
                    }
                }
                if (idx < len) {
                    str += text[idx];
                    idx += 1;
                }
                tokens.push(_jsx(Text, { color: COLORS.success, children: str }, `${keyPrefix}-s-${idx}`));
                continue;
            }
            // Numbers
            if (/\d/.test(text[idx])) {
                let num = '';
                while (idx < len && /[\d._xb]/.test(text[idx])) {
                    num += text[idx];
                    idx += 1;
                }
                tokens.push(_jsx(Text, { color: COLORS.warning, children: num }, `${keyPrefix}-n-${idx}`));
                continue;
            }
            // Identifiers / Keywords
            if (/[a-zA-Z_$]/.test(text[idx])) {
                let word = '';
                while (idx < len && /[a-zA-Z0-9_$]/.test(text[idx])) {
                    word += text[idx];
                    idx += 1;
                }
                if (JS_KEYWORDS.has(word)) {
                    tokens.push(_jsx(Text, { color: COLORS.secondary, bold: true, children: word }, `${keyPrefix}-kw-${idx}`));
                }
                else if (idx < len && text[idx] === '(') {
                    tokens.push(_jsx(Text, { color: COLORS.primary, children: word }, `${keyPrefix}-fn-${idx}`));
                }
                else {
                    tokens.push(_jsx(Text, { color: COLORS.text, children: word }, `${keyPrefix}-id-${idx}`));
                }
                continue;
            }
            // Symbols & Operators
            if (/[=+\-*/%&|^!<>?:;.,{}()[\]]/.test(text[idx])) {
                tokens.push(_jsx(Text, { color: COLORS.cyan, children: text[idx] }, `${keyPrefix}-sym-${idx}`));
                idx += 1;
                continue;
            }
            tokens.push(_jsx(Text, { color: COLORS.text, children: text[idx] }, `${keyPrefix}-raw-${idx}`));
            idx += 1;
        }
        return tokens;
    }, []);
    // Main Input & Vim Controller
    useInput((input, key) => {
        // Global Action: Ctrl+T (Déboguer & Logs)
        if (key.ctrl && input === 't') {
            flushSave();
            onTestLocally(currentCodeRef.current);
            return;
        }
        // Global Action: Ctrl+S (Valider & Soumettre)
        if (key.ctrl && input === 's') {
            flushSave();
            onSubmitSolution(currentCodeRef.current);
            return;
        }
        if (!challenge.isUnlocked) {
            if (key.escape)
                onBack();
            return;
        }
        // ================= REPLACE SINGLE CHAR MODE ('r') =================
        if (mode === 'REPLACE_CHAR') {
            if (key.escape) {
                setMode('NORMAL');
                return;
            }
            if (input && input.length === 1 && input.charCodeAt(0) >= 32) {
                const curLine = lines[cursorRow] || '';
                const before = curLine.slice(0, cursorCol);
                const after = curLine.slice(cursorCol + 1);
                const nextLines = [
                    ...lines.slice(0, cursorRow),
                    before + input + after,
                    ...lines.slice(cursorRow + 1),
                ];
                setLines(nextLines);
                pushHistory(nextLines, cursorRow, cursorCol);
                scheduleSave(nextLines);
                setMode('NORMAL');
            }
            return;
        }
        // ================= INSERT MODE =================
        if (mode === 'INSERT') {
            if (key.escape) {
                setMode('NORMAL');
                setCursorCol((c) => Math.max(0, c - 1));
                pushHistory(lines, cursorRow, Math.max(0, cursorCol - 1));
                return;
            }
            // Navigation in Insert mode
            if (key.upArrow) {
                setCursorRow((r) => Math.max(0, r - 1));
                return;
            }
            if (key.downArrow) {
                setCursorRow((r) => Math.min(lines.length - 1, r + 1));
                return;
            }
            if (key.leftArrow) {
                setCursorCol((c) => Math.max(0, c - 1));
                return;
            }
            if (key.rightArrow) {
                setCursorCol((c) => Math.min((lines[cursorRow] || '').length, c + 1));
                return;
            }
            // Enter -> New line with auto-indent
            if (key.return) {
                const curLine = lines[cursorRow] || '';
                const leadingSpaces = curLine.match(/^\s*/)?.[0] || '';
                const before = curLine.slice(0, cursorCol);
                const after = curLine.slice(cursorCol);
                let nextIndent = leadingSpaces;
                if (before.trimEnd().endsWith('{') || before.trimEnd().endsWith('(')) {
                    nextIndent += '  ';
                }
                const nextLines = [
                    ...lines.slice(0, cursorRow),
                    before,
                    nextIndent + after,
                    ...lines.slice(cursorRow + 1),
                ];
                setLines(nextLines);
                setCursorRow((r) => r + 1);
                setCursorCol(nextIndent.length);
                scheduleSave(nextLines);
                return;
            }
            // Backspace
            if (key.backspace || key.delete) {
                const curLine = lines[cursorRow] || '';
                if (cursorCol > 0) {
                    if (cursorCol >= 2 &&
                        curLine.slice(cursorCol - 2, cursorCol) === '  ' &&
                        /^\s*$/.test(curLine.slice(0, cursorCol))) {
                        const nextLines = [
                            ...lines.slice(0, cursorRow),
                            curLine.slice(0, cursorCol - 2) + curLine.slice(cursorCol),
                            ...lines.slice(cursorRow + 1),
                        ];
                        setLines(nextLines);
                        setCursorCol((c) => c - 2);
                        scheduleSave(nextLines);
                    }
                    else {
                        const nextLines = [
                            ...lines.slice(0, cursorRow),
                            curLine.slice(0, cursorCol - 1) + curLine.slice(cursorCol),
                            ...lines.slice(cursorRow + 1),
                        ];
                        setLines(nextLines);
                        setCursorCol((c) => c - 1);
                        scheduleSave(nextLines);
                    }
                }
                else if (cursorRow > 0) {
                    const prevLine = lines[cursorRow - 1] || '';
                    const prevLen = prevLine.length;
                    const nextLines = [
                        ...lines.slice(0, cursorRow - 1),
                        prevLine + curLine,
                        ...lines.slice(cursorRow + 1),
                    ];
                    setLines(nextLines);
                    setCursorRow((r) => r - 1);
                    setCursorCol(prevLen);
                    scheduleSave(nextLines);
                }
                return;
            }
            // Tab -> 2 spaces
            if (key.tab) {
                const curLine = lines[cursorRow] || '';
                const nextLines = [
                    ...lines.slice(0, cursorRow),
                    curLine.slice(0, cursorCol) + '  ' + curLine.slice(cursorCol),
                    ...lines.slice(cursorRow + 1),
                ];
                setLines(nextLines);
                setCursorCol((c) => c + 2);
                scheduleSave(nextLines);
                return;
            }
            // Direct Typing
            if (input && input.charCodeAt(0) >= 32) {
                const curLine = lines[cursorRow] || '';
                const nextLines = [
                    ...lines.slice(0, cursorRow),
                    curLine.slice(0, cursorCol) + input + curLine.slice(cursorCol),
                    ...lines.slice(cursorRow + 1),
                ];
                setLines(nextLines);
                setCursorCol((c) => c + input.length);
                scheduleSave(nextLines);
                return;
            }
            return;
        }
        // ================= NORMAL MODE =================
        if (mode === 'NORMAL') {
            // Escape / q -> Exit editor to Level 2 (Consignes)
            if (key.escape || input === 'q') {
                if (pendingKey) {
                    setPendingKey(null);
                    return;
                }
                flushSave();
                onBack();
                return;
            }
            // Undo / Redo
            if (input === 'u') {
                if (historyIndexRef.current > 0) {
                    historyIndexRef.current -= 1;
                    const snap = historyRef.current[historyIndexRef.current];
                    setLines([...snap.lines]);
                    setCursorRow(snap.cursorRow);
                    setCursorCol(snap.cursorCol);
                    scheduleSave(snap.lines);
                }
                return;
            }
            if (key.ctrl && input === 'r') {
                if (historyIndexRef.current < historyRef.current.length - 1) {
                    historyIndexRef.current += 1;
                    const snap = historyRef.current[historyIndexRef.current];
                    setLines([...snap.lines]);
                    setCursorRow(snap.cursorRow);
                    setCursorCol(snap.cursorCol);
                    scheduleSave(snap.lines);
                }
                return;
            }
            // Switch to Insert Mode
            if (input === 'i') {
                setMode('INSERT');
                return;
            }
            if (input === 'I') {
                const curLine = lines[cursorRow] || '';
                const firstCharCol = curLine.search(/\S/);
                setCursorCol(firstCharCol !== -1 ? firstCharCol : 0);
                setMode('INSERT');
                return;
            }
            if (input === 'a') {
                const curLine = lines[cursorRow] || '';
                setCursorCol((c) => Math.min(curLine.length, c + 1));
                setMode('INSERT');
                return;
            }
            if (input === 'A') {
                const curLine = lines[cursorRow] || '';
                setCursorCol(curLine.length);
                setMode('INSERT');
                return;
            }
            if (input === 'o') {
                const curLine = lines[cursorRow] || '';
                const leadingSpaces = curLine.match(/^\s*/)?.[0] || '';
                const nextLines = [
                    ...lines.slice(0, cursorRow + 1),
                    leadingSpaces,
                    ...lines.slice(cursorRow + 1),
                ];
                setLines(nextLines);
                setCursorRow((r) => r + 1);
                setCursorCol(leadingSpaces.length);
                setMode('INSERT');
                scheduleSave(nextLines);
                return;
            }
            if (input === 'O') {
                const curLine = lines[cursorRow] || '';
                const leadingSpaces = curLine.match(/^\s*/)?.[0] || '';
                const nextLines = [
                    ...lines.slice(0, cursorRow),
                    leadingSpaces,
                    ...lines.slice(cursorRow),
                ];
                setLines(nextLines);
                setCursorCol(leadingSpaces.length);
                setMode('INSERT');
                scheduleSave(nextLines);
                return;
            }
            // Replace single char 'r'
            if (input === 'r') {
                setMode('REPLACE_CHAR');
                return;
            }
            // Single char deletion 'x'
            if (input === 'x') {
                const curLine = lines[cursorRow] || '';
                if (curLine.length > 0) {
                    const before = curLine.slice(0, cursorCol);
                    const after = curLine.slice(cursorCol + 1);
                    const nextLines = [
                        ...lines.slice(0, cursorRow),
                        before + after,
                        ...lines.slice(cursorRow + 1),
                    ];
                    setLines(nextLines);
                    const nextCol = Math.max(0, Math.min(cursorCol, (before + after).length - 1));
                    setCursorCol(nextCol);
                    pushHistory(nextLines, cursorRow, nextCol);
                    scheduleSave(nextLines);
                }
                return;
            }
            // Motions: h, j, k, l, arrows
            if (input === 'h' || key.leftArrow) {
                setCursorCol((c) => Math.max(0, c - 1));
                return;
            }
            if (input === 'l' || key.rightArrow) {
                const curLine = lines[cursorRow] || '';
                setCursorCol((c) => Math.min(Math.max(0, curLine.length - 1), c + 1));
                return;
            }
            if (input === 'k' || key.upArrow) {
                setCursorRow((r) => {
                    const nextR = Math.max(0, r - 1);
                    const targetLine = lines[nextR] || '';
                    setCursorCol((c) => Math.min(c, Math.max(0, targetLine.length - 1)));
                    return nextR;
                });
                return;
            }
            if (input === 'j' || key.downArrow) {
                setCursorRow((r) => {
                    const nextR = Math.min(lines.length - 1, r + 1);
                    const targetLine = lines[nextR] || '';
                    setCursorCol((c) => Math.min(c, Math.max(0, targetLine.length - 1)));
                    return nextR;
                });
                return;
            }
            // Word motions: w, b
            if (input === 'w') {
                const curLine = lines[cursorRow] || '';
                const nextCol = getNextWordCol(curLine, cursorCol);
                if (nextCol < curLine.length) {
                    setCursorCol(nextCol);
                }
                else if (cursorRow < lines.length - 1) {
                    setCursorRow((r) => r + 1);
                    setCursorCol(0);
                }
                return;
            }
            if (input === 'b') {
                const curLine = lines[cursorRow] || '';
                if (cursorCol > 0) {
                    setCursorCol(getPrevWordCol(curLine, cursorCol));
                }
                else if (cursorRow > 0) {
                    const prevLine = lines[cursorRow - 1] || '';
                    setCursorRow((r) => r - 1);
                    setCursorCol(Math.max(0, prevLine.length - 1));
                }
                return;
            }
            // Line motions: 0, $
            if (input === '0' || input === '\x1b[H') {
                setCursorCol(0);
                return;
            }
            if (input === '$' || input === '\x1b[F') {
                const curLine = lines[cursorRow] || '';
                setCursorCol(Math.max(0, curLine.length - 1));
                return;
            }
            // File motions: gg, G
            if (input === 'G') {
                const lastRow = Math.max(0, lines.length - 1);
                const lastLine = lines[lastRow] || '';
                setCursorRow(lastRow);
                setCursorCol(Math.max(0, lastLine.length - 1));
                return;
            }
            if (input === 'g') {
                if (pendingKey === 'g') {
                    setCursorRow(0);
                    setCursorCol(0);
                    setPendingKey(null);
                }
                else {
                    setPendingKey('g');
                }
                return;
            }
            // Compound Operations: dd, dw, d$
            if (input === 'd') {
                if (pendingKey === 'd') {
                    // 'dd' -> delete entire line
                    if (lines.length > 1) {
                        const nextLines = [...lines.slice(0, cursorRow), ...lines.slice(cursorRow + 1)];
                        setLines(nextLines);
                        const nextRow = Math.min(cursorRow, nextLines.length - 1);
                        const nextCol = Math.min(cursorCol, Math.max(0, (nextLines[nextRow] || '').length - 1));
                        setCursorRow(nextRow);
                        setCursorCol(nextCol);
                        pushHistory(nextLines, nextRow, nextCol);
                        scheduleSave(nextLines);
                    }
                    else {
                        const nextLines = [''];
                        setLines(nextLines);
                        setCursorRow(0);
                        setCursorCol(0);
                        pushHistory(nextLines, 0, 0);
                        scheduleSave(nextLines);
                    }
                    setPendingKey(null);
                }
                else {
                    setPendingKey('d');
                }
                return;
            }
            if (pendingKey === 'd') {
                if (input === 'w') {
                    // 'dw' -> delete to next word
                    const curLine = lines[cursorRow] || '';
                    const nextCol = getNextWordCol(curLine, cursorCol);
                    const before = curLine.slice(0, cursorCol);
                    const after = curLine.slice(nextCol);
                    const nextLines = [
                        ...lines.slice(0, cursorRow),
                        before + after,
                        ...lines.slice(cursorRow + 1),
                    ];
                    setLines(nextLines);
                    const finalCol = Math.max(0, Math.min(cursorCol, (before + after).length - 1));
                    setCursorCol(finalCol);
                    pushHistory(nextLines, cursorRow, finalCol);
                    scheduleSave(nextLines);
                    setPendingKey(null);
                    return;
                }
                if (input === '$') {
                    // 'd$' -> delete to end of line
                    const curLine = lines[cursorRow] || '';
                    const before = curLine.slice(0, cursorCol);
                    const nextLines = [
                        ...lines.slice(0, cursorRow),
                        before,
                        ...lines.slice(cursorRow + 1),
                    ];
                    setLines(nextLines);
                    const finalCol = Math.max(0, before.length - 1);
                    setCursorCol(finalCol);
                    pushHistory(nextLines, cursorRow, finalCol);
                    scheduleSave(nextLines);
                    setPendingKey(null);
                    return;
                }
                setPendingKey(null);
            }
            // Compound Operations: cc, cw, c$
            if (input === 'c') {
                if (pendingKey === 'c') {
                    // 'cc' -> clear line, keep indent, go insert
                    const curLine = lines[cursorRow] || '';
                    const leadingSpaces = curLine.match(/^\s*/)?.[0] || '';
                    const nextLines = [
                        ...lines.slice(0, cursorRow),
                        leadingSpaces,
                        ...lines.slice(cursorRow + 1),
                    ];
                    setLines(nextLines);
                    setCursorCol(leadingSpaces.length);
                    setMode('INSERT');
                    scheduleSave(nextLines);
                    setPendingKey(null);
                }
                else {
                    setPendingKey('c');
                }
                return;
            }
            if (pendingKey === 'c') {
                if (input === 'w') {
                    // 'cw' -> delete word, go insert
                    const curLine = lines[cursorRow] || '';
                    const nextCol = getNextWordCol(curLine, cursorCol);
                    const before = curLine.slice(0, cursorCol);
                    const after = curLine.slice(nextCol);
                    const nextLines = [
                        ...lines.slice(0, cursorRow),
                        before + after,
                        ...lines.slice(cursorRow + 1),
                    ];
                    setLines(nextLines);
                    setCursorCol(cursorCol);
                    setMode('INSERT');
                    scheduleSave(nextLines);
                    setPendingKey(null);
                    return;
                }
                if (input === '$') {
                    // 'c$' -> delete to end of line, go insert
                    const curLine = lines[cursorRow] || '';
                    const before = curLine.slice(0, cursorCol);
                    const nextLines = [
                        ...lines.slice(0, cursorRow),
                        before,
                        ...lines.slice(cursorRow + 1),
                    ];
                    setLines(nextLines);
                    setCursorCol(cursorCol);
                    setMode('INSERT');
                    scheduleSave(nextLines);
                    setPendingKey(null);
                    return;
                }
                setPendingKey(null);
            }
        }
    });
    // Locked fallback
    if (!challenge.isUnlocked) {
        return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.error, paddingX: 1, paddingY: 1, children: [_jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsxs(Text, { color: COLORS.error, bold: true, children: ["\uD83D\uDD12 CHALLENGE VERROUILL\u00C9 (#", challenge.number, " ", challenge.title, ")"] }) }), _jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsxs(Text, { color: COLORS.textMuted, children: ["Vous devez terminer l'exercice #", Math.max(1, challenge.number - 1), " pour d\u00E9bloquer l'\u00E9diteur."] }) }), _jsx(Box, { borderStyle: "single", borderColor: COLORS.border, paddingX: 1, justifyContent: "space-between", children: _jsx(Text, { color: COLORS.textMuted, children: "[\u00C9chap] Retour aux consignes" }) })] }));
    }
    // Slicing viewport
    const visibleLines = useMemo(() => {
        return lines.slice(scrollRow, scrollRow + visibleLinesCount);
    }, [lines, scrollRow, visibleLinesCount]);
    const gutterWidth = Math.max(3, String(lines.length).length + 1);
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.borderFocus, paddingX: 1, paddingY: 0, children: [_jsxs(Box, { justifyContent: "space-between", marginBottom: 1, children: [_jsx(Box, { children: _jsxs(Text, { children: [_jsx(Text, { color: COLORS.primary, bold: true, children: "\uD83D\uDCBB \u00C9DITEUR JAVASCRIPT INT\u00C9GR\u00C9" }), _jsxs(Text, { color: COLORS.textMuted, children: [" \u2502 #", challenge.number, " ", challenge.title] })] }) }), _jsx(Box, { children: _jsx(Text, { color: COLORS.textDim, children: "[i] Insertion \u2502 [\u00C9chap/q] Normal/Retour \u2502 [u] Undo \u2502 [Ctrl+T] Logs \u2502 [Ctrl+S] Valider" }) })] }), _jsx(Box, { flexDirection: "column", marginBottom: 1, children: visibleLines.map((rawLine, i) => {
                    const lineIndex = scrollRow + i;
                    const isCurrent = lineIndex === cursorRow;
                    const lineNum = String(lineIndex + 1).padStart(gutterWidth - 1, ' ');
                    if (isCurrent) {
                        const before = rawLine.slice(0, cursorCol);
                        const cursorChar = rawLine[cursorCol] || ' ';
                        const after = rawLine.slice(cursorCol + 1);
                        return (_jsx(Box, { children: _jsxs(Text, { children: [_jsxs(Text, { color: COLORS.warning, bold: true, children: [lineNum, " \u2502", ' '] }), renderHighlightedSegment(before, `line-${lineIndex}-b`), _jsx(Text, { backgroundColor: mode === 'INSERT' ? COLORS.success : '#f7768e', color: "#1a1b26", bold: true, children: cursorChar }), renderHighlightedSegment(after, `line-${lineIndex}-a`)] }) }, lineIndex));
                    }
                    return (_jsx(Box, { children: _jsxs(Text, { children: [_jsxs(Text, { color: COLORS.textDim, children: [lineNum, " \u2502", ' '] }), renderHighlightedSegment(rawLine, `line-${lineIndex}`)] }) }, lineIndex));
                }) }), _jsxs(Box, { borderStyle: "single", borderColor: COLORS.border, paddingX: 0, justifyContent: "space-between", children: [_jsxs(Box, { children: [_jsx(Text, { backgroundColor: mode === 'INSERT' ? COLORS.success : mode === 'REPLACE_CHAR' ? COLORS.warning : COLORS.secondary, color: "#1a1b26", bold: true, children: mode === 'INSERT' ? ' INSERT ' : mode === 'REPLACE_CHAR' ? ' REPLACE ' : ' NORMAL ' }), _jsx(Text, { color: COLORS.textDim, children: " \u2502 " }), _jsxs(Text, { color: COLORS.textMuted, children: [challenge.slug, ".js"] }), pendingKey && (_jsxs(Text, { color: COLORS.warning, bold: true, children: [' ', "[", pendingKey, "]"] }))] }), _jsx(Box, { children: _jsxs(Text, { children: [isSaved ? (_jsx(Text, { color: COLORS.success, children: "\u25CF Enregistr\u00E9 " })) : (_jsx(Text, { color: COLORS.warning, children: "\u25CB \u00C9criture... " })), _jsxs(Text, { color: COLORS.textDim, children: ["Ln ", cursorRow + 1, "/", lines.length, ", Col ", cursorCol + 1] })] }) })] })] }));
};
//# sourceMappingURL=CodeEditorView.js.map