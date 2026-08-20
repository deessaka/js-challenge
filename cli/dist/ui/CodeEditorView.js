import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, measureElement, Text, useCursor, useInput, usePaste, useWindowSize, } from 'ink';
import { createEditorState, reduceEditor, } from '../editor_engine.js';
import { layoutViewport } from '../editor_viewport.js';
import { graphemeIndexToTerminalColumn } from '../unicode_text.js';
import { editorEventFromInk } from './editor_input.js';
import { COLORS } from './theme.js';
export const CodeEditorView = ({ challenge, initialCode, onSaveCode, onTestLocally, onSubmitSolution, onBack, visibleLinesCount, }) => {
    const [editor, setEditor] = useState(() => createEditorState(initialCode));
    const [scrollTop, setScrollTop] = useState(0);
    const [isSaved, setIsSaved] = useState(true);
    const [inputNotice, setInputNotice] = useState(null);
    const [bodyOrigin, setBodyOrigin] = useState({ x: 0, y: 0, measured: false });
    const saveTimerRef = useRef(null);
    const currentCodeRef = useRef(initialCode);
    const bodyRef = useRef(null);
    const { columns, rows } = useWindowSize();
    const { setCursorPosition } = useCursor();
    const isBlockedBySize = columns < 60 || rows < 16;
    const isCompact = columns < 80 || rows < 24;
    const contentWidth = Math.max(1, columns - 12);
    const viewportHeight = Math.max(1, visibleLinesCount ?? rows - (isCompact ? 7 : 10));
    useEffect(() => {
        const next = createEditorState(initialCode);
        setEditor(next);
        setScrollTop(0);
        setIsSaved(true);
        currentCodeRef.current = initialCode;
        // `initialCode` is echoed after autosave; only a different exercise starts a new buffer.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [challenge.id]);
    useEffect(() => {
        return () => {
            if (saveTimerRef.current)
                clearTimeout(saveTimerRef.current);
        };
    }, []);
    const scheduleSave = useCallback((code) => {
        currentCodeRef.current = code;
        setIsSaved(false);
        if (saveTimerRef.current)
            clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            void onSaveCode(code).then(() => setIsSaved(true));
        }, 300);
    }, [onSaveCode]);
    const runEffects = useCallback((effects) => {
        for (const effect of effects) {
            if (effect.type === 'document-changed')
                scheduleSave(effect.text);
        }
    }, [scheduleSave]);
    const dispatch = useCallback((command) => {
        setEditor((current) => {
            const update = reduceEditor(current, command);
            runEffects(update.effects);
            return update.state;
        });
    }, [runEffects]);
    useEffect(() => {
        dispatch({ type: 'set-viewport-width', width: contentWidth });
    }, [contentWidth, dispatch]);
    const viewport = useMemo(() => layoutViewport({
        lines: editor.lines,
        cursor: editor.cursor,
        mode: editor.mode,
        width: contentWidth,
        height: viewportHeight,
        scrollTop,
    }), [contentWidth, editor.cursor, editor.lines, editor.mode, scrollTop, viewportHeight]);
    useEffect(() => {
        if (scrollTop !== viewport.scrollTop)
            setScrollTop(viewport.scrollTop);
    }, [scrollTop, viewport.scrollTop]);
    useEffect(() => {
        if (!bodyRef.current)
            return;
        const measured = measureElement(bodyRef.current);
        setBodyOrigin((current) => current.measured && current.x === measured.x && current.y === measured.y
            ? current
            : { x: measured.x, y: measured.y, measured: true });
    }, [columns, rows, viewport.scrollTop, viewport.visibleLines]);
    setCursorPosition(!isBlockedBySize && challenge.isUnlocked && bodyOrigin.measured
        ? {
            x: bodyOrigin.x + 7 + viewport.cursor.column,
            y: bodyOrigin.y + viewport.cursor.row,
        }
        : undefined);
    const flushSave = useCallback(async () => {
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
        }
        await onSaveCode(currentCodeRef.current);
        setIsSaved(true);
    }, [onSaveCode]);
    useInput((input, key) => {
        setInputNotice(null);
        if (isBlockedBySize) {
            if (key.escape)
                onBack();
            return;
        }
        if (key.ctrl && input === 't') {
            void flushSave().then(() => onTestLocally(currentCodeRef.current));
            return;
        }
        if (key.ctrl && input === 's') {
            void flushSave().then(() => onSubmitSolution(currentCodeRef.current));
            return;
        }
        if (!challenge.isUnlocked) {
            if (key.escape)
                onBack();
            return;
        }
        if (editor.mode === 'normal' && editor.pendingNormal === null && key.escape) {
            void flushSave().then(onBack);
            return;
        }
        if (editor.mode === 'insert' && key.tab) {
            dispatch({ type: 'insert-text', text: '  ' });
            return;
        }
        const event = editorEventFromInk(input, key, editor.mode);
        if (event)
            dispatch(event);
    });
    usePaste(() => {
        setInputNotice('Collage désactivé — saisissez le code dans l’éditeur.');
    }, { isActive: challenge.isUnlocked });
    if (isBlockedBySize) {
        return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.warning, paddingX: 1, children: [_jsxs(Text, { color: COLORS.warning, bold: true, children: ["Terminal trop petit \u2014 ", columns, "\u00D7", rows] }), _jsx(Text, { children: "Agrandissez-le \u00E0 au moins 60\u00D716 pour reprendre l\u2019\u00E9dition." }), _jsx(Text, { color: COLORS.textMuted, children: "\u00C9chap : revenir \u2502 Ctrl+C : quitter" })] }));
    }
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.borderFocus, children: [_jsxs(Box, { justifyContent: "space-between", paddingX: 1, children: [_jsx(Text, { color: COLORS.primary, bold: true, children: isCompact ? `💻 ${challenge.title}` : `💻 ÉDITEUR — ${challenge.title}` }), _jsx(Text, { color: isSaved ? COLORS.success : COLORS.warning, children: isSaved ? '✓ Enregistré' : '● Écriture…' })] }), _jsx(Box, { ref: bodyRef, flexDirection: "column", paddingX: 1, minHeight: viewportHeight, children: viewport.visibleLines.map((line) => {
                    const lineNumber = line.continuation
                        ? '   '
                        : String(line.logicalRow + 1).padStart(3, ' ');
                    return (_jsxs(Box, { children: [_jsxs(Text, { color: COLORS.textDim, children: [lineNumber, " \u2502 "] }), _jsx(Text, { children: line.text || ' ' })] }, `${line.logicalRow}:${line.startGrapheme}:${line.endGrapheme}`));
                }) }), _jsxs(Box, { justifyContent: "space-between", paddingX: 1, children: [inputNotice ? (_jsx(Text, { color: COLORS.warning, children: inputNotice })) : (_jsxs(Text, { color: modeColor(editor.mode), bold: true, children: ["-- ", modeLabel(editor.mode), editor.pendingNormal ? ` (${editor.pendingNormal})` : '', " --"] })), _jsxs(Text, { color: COLORS.textMuted, children: [editor.cursor.row + 1, ":", graphemeIndexToTerminalColumn(editor.lines[editor.cursor.row] ?? '', editor.cursor.grapheme) + 1, ' ', isCompact ? '' : ' │ Ctrl+T tester │ Ctrl+S soumettre'] })] })] }));
};
function modeLabel(mode) {
    if (mode === 'insert')
        return 'INSERTION';
    if (mode === 'replace')
        return 'REMPLACEMENT';
    return 'NORMAL';
}
function modeColor(mode) {
    if (mode === 'insert')
        return COLORS.success;
    if (mode === 'replace')
        return COLORS.warning;
    return COLORS.primary;
}
//# sourceMappingURL=CodeEditorView.js.map