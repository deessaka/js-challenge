import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, measureElement, Text, useApp, useCursor, useInput, usePaste, useWindowSize, } from 'ink';
import { createEditorState, reduceEditor, } from '../editor_engine.js';
import { layoutViewport } from '../editor_viewport.js';
import { graphemeIndexToTerminalColumn } from '../unicode_text.js';
import { editorEventFromInk } from './editor_input.js';
import { EditorFeedbackPanel } from './EditorFeedbackPanel.js';
import { createEditorFeedbackState } from './editor_feedback.js';
import { matchesShortcut, shortcutHints, shortcutKeys } from './shortcut_catalog.js';
import { terminalViewEventForKey } from './terminal_view_state.js';
import { COLORS } from './theme.js';
import { tokenizeDocumentLines, tokenize } from '../tokenizer.js';
export const CodeEditorView = ({ challenge, initialCode, feedback = createEditorFeedbackState(), onSaveCode, onCodeChange, onTestLocally, onSubmitSolution, onSelectView, onBack, visibleLinesCount, }) => {
    const [editor, setEditor] = useState(() => createEditorState(initialCode));
    const { exit } = useApp();
    const [scrollTop, setScrollTop] = useState(0);
    const [saveState, setSaveState] = useState('saved');
    const [inputNotice, setInputNotice] = useState(null);
    const [bodyOrigin, setBodyOrigin] = useState({ x: 0, y: 0, measured: false });
    const saveTimerRef = useRef(null);
    const saveAttemptRef = useRef(0);
    const currentCodeRef = useRef(initialCode);
    const bodyRef = useRef(null);
    const { columns, rows } = useWindowSize();
    const { setCursorPosition } = useCursor();
    const isBlockedBySize = columns < 60 || rows < 16;
    const isCompact = columns < 80 || rows < 24;
    const contentWidth = Math.max(1, columns - 12);
    const viewportHeight = Math.max(1, visibleLinesCount ?? rows - (isCompact ? 13 : 16));
    useEffect(() => {
        const next = createEditorState(initialCode);
        setEditor(next);
        setScrollTop(0);
        setSaveState('saved');
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
    const performSave = useCallback(async (code) => {
        const attempt = saveAttemptRef.current + 1;
        saveAttemptRef.current = attempt;
        setSaveState('writing');
        try {
            await onSaveCode(code);
            if (saveAttemptRef.current === attempt)
                setSaveState('saved');
            return true;
        }
        catch {
            if (saveAttemptRef.current === attempt) {
                setSaveState('error');
                setInputNotice(`Échec de sauvegarde — ${shortcutKeys('editor-save')} pour réessayer. Le tampon reste disponible.`);
            }
            return false;
        }
    }, [onSaveCode]);
    const scheduleSave = useCallback((code) => {
        currentCodeRef.current = code;
        onCodeChange?.(code);
        saveAttemptRef.current += 1;
        setSaveState('writing');
        if (saveTimerRef.current)
            clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            saveTimerRef.current = null;
            void performSave(code);
        }, 300);
    }, [onCodeChange, performSave]);
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
    const tokenizedLinesState = useMemo(() => tokenizeDocumentLines(editor.lines), [editor.lines]);
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
    useEffect(() => {
        if (editor.mode === 'insert') {
            process.stdout.write('\x1b[6 q'); // Steady bar
        }
        else {
            process.stdout.write('\x1b[2 q'); // Steady block
        }
        return () => {
            process.stdout.write('\x1b[0 q'); // Reset
        };
    }, [editor.mode]);
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
        return performSave(currentCodeRef.current);
    }, [performSave]);
    useInput((input, key) => {
        setInputNotice(null);
        if (matchesShortcut('quit', input, key)) {
            exit();
            return;
        }
        const viewEvent = terminalViewEventForKey(input, key.ctrl);
        if (viewEvent?.type === 'select-view') {
            onSelectView?.(viewEvent.view);
            return;
        }
        if (isBlockedBySize) {
            if (matchesShortcut('back', input, key))
                onBack();
            return;
        }
        if (matchesShortcut('editor-submit', input, key)) {
            void flushSave().then(async (saved) => {
                if (!saved)
                    return;
                try {
                    await onSubmitSolution(currentCodeRef.current);
                }
                catch (caught) {
                    setInputNotice(caught instanceof Error
                        ? caught.message
                        : `Soumission bloquée — sauvegardez avec ${shortcutKeys('editor-save')} puis réessayez.`);
                }
            });
            return;
        }
        if (matchesShortcut('editor-test', input, key)) {
            void flushSave().then(() => onTestLocally(currentCodeRef.current));
            return;
        }
        if (matchesShortcut('editor-save', input, key)) {
            void flushSave();
            return;
        }
        if (!challenge.isUnlocked) {
            if (matchesShortcut('back', input, key))
                onBack();
            return;
        }
        if (editor.mode === 'normal' &&
            editor.pendingNormal === null &&
            matchesShortcut('editor-back', input, key)) {
            void flushSave().then((saved) => {
                if (saved)
                    onBack();
            });
            return;
        }
        if (editor.mode === 'insert' && matchesShortcut('editor-tab', input, key)) {
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
        return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.warning, paddingX: 1, children: [_jsxs(Text, { color: COLORS.warning, bold: true, children: ["Terminal trop petit \u2014 ", columns, "\u00D7", rows] }), _jsx(Text, { children: "Agrandissez-le \u00E0 au moins 60\u00D716 pour reprendre l\u2019\u00E9dition." }), _jsx(Text, { color: COLORS.textMuted, children: shortcutHints(['back', 'quit']) })] }));
    }
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.borderFocus, children: [_jsxs(Box, { justifyContent: "space-between", paddingX: 1, paddingBottom: 1, children: [_jsx(Text, { color: COLORS.primary, bold: true, children: isCompact ? `💻 ${challenge.title}` : `💻 ÉDITEUR — ${challenge.title}` }), _jsx(Text, { color: saveStateColor(saveState), children: saveStateLabel(saveState) })] }), _jsx(Box, { ref: bodyRef, flexDirection: "column", paddingX: 1, minHeight: viewportHeight, children: viewport.visibleLines.map((line) => {
                    const lineNumber = line.continuation
                        ? '   '
                        : String(line.logicalRow + 1).padStart(3, ' ');
                    return (_jsxs(Box, { children: [_jsxs(Text, { color: COLORS.textDim, children: [lineNumber, " \u2502 "] }), _jsx(Text, { wrap: "truncate-end", children: line.text ? (tokenize(line.text, tokenizedLinesState.states[line.logicalRow]).map((token, idx) => (_jsx(Text, { color: token.color, children: token.text.replace(/ /g, '\u00A0') }, idx)))) : ('\u00A0') })] }, `${line.logicalRow}:${line.startGrapheme}:${line.endGrapheme}`));
                }) }), _jsx(EditorFeedbackPanel, { feedback: feedback }), _jsxs(Box, { justifyContent: "space-between", paddingX: 1, children: [inputNotice ? (_jsx(Text, { color: COLORS.warning, children: inputNotice })) : (_jsxs(Text, { color: modeColor(editor.mode), bold: true, children: ["-- ", modeLabel(editor.mode), editor.pendingNormal ? ` (${editor.pendingNormal})` : '', " --"] })), _jsxs(Text, { color: COLORS.textMuted, children: [editor.cursor.row + 1, ":", graphemeIndexToTerminalColumn(editor.lines[editor.cursor.row] ?? '', editor.cursor.grapheme) + 1, ' ', isCompact ? '' : ` │ ${shortcutHints(['editor-save', 'editor-test', 'editor-submit'])}`] })] })] }));
};
function saveStateLabel(state) {
    if (state === 'saved')
        return '✓ Enregistré';
    if (state === 'writing')
        return '● Écriture…';
    return `✗ Erreur d’écriture — ${shortcutKeys('editor-save')} pour réessayer`;
}
function saveStateColor(state) {
    if (state === 'saved')
        return COLORS.success;
    if (state === 'writing')
        return COLORS.warning;
    return COLORS.error;
}
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