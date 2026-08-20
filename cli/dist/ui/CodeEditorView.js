import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Text, useInput, usePaste } from 'ink';
import { createEditorState, reduceEditor, } from '../editor_engine.js';
import { graphemeIndexToTerminalColumn, graphemeSlice } from '../unicode_text.js';
import { editorEventFromInk } from './editor_input.js';
import { COLORS } from './theme.js';
export const CodeEditorView = ({ challenge, initialCode, onSaveCode, onTestLocally, onSubmitSolution, onBack, visibleLinesCount = 16, }) => {
    const [editor, setEditor] = useState(() => createEditorState(initialCode));
    const [scrollRow, setScrollRow] = useState(0);
    const [isSaved, setIsSaved] = useState(true);
    const [inputNotice, setInputNotice] = useState(null);
    const saveTimerRef = useRef(null);
    const currentCodeRef = useRef(initialCode);
    useEffect(() => {
        const next = createEditorState(initialCode);
        setEditor(next);
        setScrollRow(0);
        setIsSaved(true);
        currentCodeRef.current = initialCode;
    }, [challenge.id, initialCode]);
    useEffect(() => {
        return () => {
            if (saveTimerRef.current)
                clearTimeout(saveTimerRef.current);
        };
    }, []);
    useEffect(() => {
        if (editor.cursor.row < scrollRow) {
            setScrollRow(editor.cursor.row);
        }
        else if (editor.cursor.row >= scrollRow + visibleLinesCount) {
            setScrollRow(editor.cursor.row - visibleLinesCount + 1);
        }
    }, [editor.cursor.row, scrollRow, visibleLinesCount]);
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
        if (editor.mode === 'normal' && (key.escape || input === 'q')) {
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
    const visibleLines = useMemo(() => editor.lines.slice(scrollRow, scrollRow + visibleLinesCount), [editor.lines, scrollRow, visibleLinesCount]);
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.borderFocus, children: [_jsxs(Box, { justifyContent: "space-between", paddingX: 1, children: [_jsxs(Text, { color: COLORS.primary, bold: true, children: ["\uD83D\uDCBB \u00C9DITEUR \u2014 ", challenge.title] }), _jsx(Text, { color: isSaved ? COLORS.success : COLORS.warning, children: isSaved ? '✓ Enregistré' : '● Écriture…' })] }), _jsx(Box, { flexDirection: "column", paddingX: 1, minHeight: visibleLinesCount, children: visibleLines.map((line, visibleIndex) => {
                    const row = scrollRow + visibleIndex;
                    const selected = row === editor.cursor.row;
                    return (_jsxs(Box, { children: [_jsxs(Text, { color: COLORS.textDim, children: [String(row + 1).padStart(3, ' '), " \u2502 "] }), selected ? renderCursorLine(line, editor.cursor.grapheme) : _jsx(Text, { children: line || ' ' })] }, row));
                }) }), _jsxs(Box, { justifyContent: "space-between", paddingX: 1, children: [inputNotice ? (_jsx(Text, { color: COLORS.warning, children: inputNotice })) : (_jsxs(Text, { color: editor.mode === 'insert' ? COLORS.success : COLORS.primary, bold: true, children: ["-- ", editor.mode === 'insert' ? 'INSERTION' : 'NORMAL', " --"] })), _jsxs(Text, { color: COLORS.textMuted, children: [editor.cursor.row + 1, ":", graphemeIndexToTerminalColumn(editor.lines[editor.cursor.row] ?? '', editor.cursor.grapheme) + 1, ' ', "\u2502 Ctrl+T tester \u2502 Ctrl+S soumettre"] })] })] }));
};
function renderCursorLine(line, grapheme) {
    const before = graphemeSlice(line, 0, grapheme);
    const cursor = graphemeSlice(line, grapheme, grapheme + 1) || ' ';
    const after = graphemeSlice(line, grapheme + 1);
    return (_jsxs(Text, { children: [before, _jsx(Text, { inverse: true, children: cursor }), after] }));
}
//# sourceMappingURL=CodeEditorView.js.map