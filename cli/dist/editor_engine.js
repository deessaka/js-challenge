import { graphemeCount, graphemeIndexToUtf16Offset, splitGraphemes } from './unicode_text.js';
export function createEditorState(text) {
    const lines = text.split(/\r?\n/);
    return {
        lines: lines.length > 0 ? lines : [''],
        cursor: { row: 0, grapheme: 0 },
        mode: 'normal',
        pendingNormal: null,
        preferredGrapheme: null,
        undoStack: [],
        redoStack: [],
        transactionBase: null,
    };
}
export function editorText(state) {
    return state.lines.join('\n');
}
export function reduceEditor(state, command) {
    if (command.type === 'enter-normal') {
        return finishOrCancelTransaction(state);
    }
    if (command.type === 'undo' && state.mode === 'normal') {
        return undo(state);
    }
    if (command.type === 'redo' && state.mode === 'normal') {
        return redo(state);
    }
    if (command.type === 'normal-key' && state.mode === 'normal') {
        return handleNormalKey(state, command.key);
    }
    if (command.type === 'replace-text' && state.mode === 'replace') {
        const replacement = splitGraphemes(command.text)[0];
        if (!replacement) {
            return unchanged({ ...state, mode: 'normal', transactionBase: null });
        }
        const line = currentLine(state);
        if (state.cursor.grapheme >= graphemeCount(line)) {
            return unchanged({ ...state, mode: 'normal', transactionBase: null });
        }
        const nextLine = replaceGraphemeRange(line, state.cursor.grapheme, state.cursor.grapheme + 1, replacement);
        const update = changed(replaceCurrentLine({ ...state, mode: 'normal' }, nextLine, state.cursor.grapheme));
        return commitTransactionBase(update);
    }
    if (command.type === 'move' && state.mode === 'insert') {
        return unchanged(moveCursor(state, command.direction));
    }
    if (command.type === 'insert-text' &&
        state.mode === 'insert' &&
        command.text.length > 0 &&
        !/[\r\n]/.test(command.text)) {
        const line = currentLine(state);
        const offset = graphemeIndexToUtf16Offset(line, state.cursor.grapheme);
        const nextLine = line.slice(0, offset) + command.text + line.slice(offset);
        return changed(replaceCurrentLine(state, nextLine, state.cursor.grapheme + graphemeCount(command.text)));
    }
    if (command.type === 'insert-line-break' && state.mode === 'insert') {
        const line = currentLine(state);
        const offset = graphemeIndexToUtf16Offset(line, state.cursor.grapheme);
        const before = line.slice(0, offset);
        const after = line.slice(offset);
        const lines = [...state.lines];
        lines.splice(state.cursor.row, 1, before, after);
        return changed({
            ...state,
            lines,
            cursor: { row: state.cursor.row + 1, grapheme: 0 },
        });
    }
    if (command.type === 'backspace' && state.mode === 'insert') {
        if (state.cursor.grapheme > 0) {
            const line = currentLine(state);
            const previousOffset = graphemeIndexToUtf16Offset(line, state.cursor.grapheme - 1);
            const offset = graphemeIndexToUtf16Offset(line, state.cursor.grapheme);
            const nextLine = line.slice(0, previousOffset) + line.slice(offset);
            return changed(replaceCurrentLine(state, nextLine, state.cursor.grapheme - 1));
        }
        if (state.cursor.row > 0) {
            const previous = state.lines[state.cursor.row - 1] ?? '';
            const line = currentLine(state);
            const lines = [...state.lines];
            lines.splice(state.cursor.row - 1, 2, previous + line);
            return changed({
                ...state,
                lines,
                cursor: { row: state.cursor.row - 1, grapheme: graphemeCount(previous) },
            });
        }
    }
    return unchanged(state);
}
function handleNormalKey(state, key) {
    if (state.pendingNormal === 'g') {
        if (key === 'g') {
            return unchanged(moveToRow({ ...state, pendingNormal: null }, 0));
        }
        if (key === 'j' || key === 'k') {
            return unchanged(moveNormalCursor({ ...state, pendingNormal: null }, key === 'j' ? 'down' : 'up'));
        }
        return unchanged({ ...state, pendingNormal: null });
    }
    if (state.pendingNormal === 'd' || state.pendingNormal === 'c') {
        const update = applyOperator(state, state.pendingNormal, key);
        return update.state.mode === 'insert'
            ? beginChangedTransaction(state, update)
            : commitImmediate(state, update);
    }
    if (key === 'g' || key === 'd' || key === 'c') {
        return unchanged({ ...state, pendingNormal: key });
    }
    if (key === 'h')
        return unchanged(moveNormalCursor(state, 'left'));
    if (key === 'j')
        return unchanged(moveNormalCursor(state, 'down'));
    if (key === 'k')
        return unchanged(moveNormalCursor(state, 'up'));
    if (key === 'l')
        return unchanged(moveNormalCursor(state, 'right'));
    if (key === '0') {
        return unchanged({
            ...state,
            cursor: { ...state.cursor, grapheme: 0 },
            preferredGrapheme: null,
        });
    }
    if (key === '$') {
        return unchanged({
            ...state,
            cursor: { ...state.cursor, grapheme: normalLineEnd(currentLine(state)) },
            preferredGrapheme: null,
        });
    }
    if (key === 'w')
        return unchanged(moveToNextWord(state));
    if (key === 'b')
        return unchanged(moveToPreviousWord(state));
    if (key === 'G')
        return unchanged(moveToRow(state, state.lines.length - 1));
    if (key === 'i')
        return beginInsertion(state, state.cursor.grapheme);
    if (key === 'I') {
        return beginInsertion(state, firstNonBlank(currentLine(state)));
    }
    if (key === 'a') {
        return beginInsertion(state, Math.min(graphemeCount(currentLine(state)), state.cursor.grapheme + 1));
    }
    if (key === 'A') {
        return beginInsertion(state, graphemeCount(currentLine(state)));
    }
    if (key === 'o' || key === 'O') {
        return beginChangedTransaction(state, openLine(state, key));
    }
    if (key === 'x')
        return commitImmediate(state, deleteNormalCharacter(state));
    if (key === 'r' && graphemeCount(currentLine(state)) > 0) {
        return unchanged({
            ...state,
            mode: 'replace',
            transactionBase: snapshot(state),
        });
    }
    return unchanged(state);
}
function beginInsertion(state, grapheme) {
    return unchanged({
        ...state,
        mode: 'insert',
        cursor: { ...state.cursor, grapheme },
        preferredGrapheme: null,
        transactionBase: snapshot(state),
    });
}
function beginChangedTransaction(before, update) {
    if (update.effects.length === 0)
        return update;
    return {
        ...update,
        state: { ...update.state, transactionBase: snapshot(before) },
    };
}
function finishOrCancelTransaction(state) {
    if (state.mode !== 'insert') {
        return unchanged({
            ...state,
            mode: 'normal',
            pendingNormal: null,
            transactionBase: null,
        });
    }
    const line = currentLine(state);
    const normalCursor = graphemeCount(line) === 0
        ? 0
        : Math.min(normalLineEnd(line), Math.max(0, state.cursor.grapheme - 1));
    const next = {
        ...state,
        mode: 'normal',
        pendingNormal: null,
        preferredGrapheme: null,
        transactionBase: null,
        cursor: { ...state.cursor, grapheme: normalCursor },
    };
    if (!state.transactionBase || sameDocument(state, state.transactionBase)) {
        return unchanged(next);
    }
    return unchanged({
        ...next,
        undoStack: [...state.undoStack, state.transactionBase],
        redoStack: [],
    });
}
function commitImmediate(before, update) {
    if (update.effects.length === 0)
        return update;
    return {
        ...update,
        state: {
            ...update.state,
            undoStack: [...before.undoStack, snapshot(before)],
            redoStack: [],
            transactionBase: null,
        },
    };
}
function commitTransactionBase(update) {
    const base = update.state.transactionBase;
    if (!base || update.effects.length === 0) {
        return { ...update, state: { ...update.state, transactionBase: null } };
    }
    return {
        ...update,
        state: {
            ...update.state,
            undoStack: [...update.state.undoStack, base],
            redoStack: [],
            transactionBase: null,
        },
    };
}
function undo(state) {
    const previous = state.undoStack.at(-1);
    if (!previous)
        return unchanged({ ...state, pendingNormal: null });
    const next = restoreSnapshot(state, previous);
    return changed({
        ...next,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, snapshot(state)],
    });
}
function redo(state) {
    const nextSnapshot = state.redoStack.at(-1);
    if (!nextSnapshot)
        return unchanged({ ...state, pendingNormal: null });
    const next = restoreSnapshot(state, nextSnapshot);
    return changed({
        ...next,
        undoStack: [...state.undoStack, snapshot(state)],
        redoStack: state.redoStack.slice(0, -1),
    });
}
function snapshot(state) {
    return {
        lines: [...state.lines],
        cursor: { ...state.cursor },
    };
}
function restoreSnapshot(state, value) {
    return {
        ...state,
        lines: [...value.lines],
        cursor: { ...value.cursor },
        mode: 'normal',
        pendingNormal: null,
        preferredGrapheme: null,
        transactionBase: null,
    };
}
function sameDocument(state, value) {
    return editorText(state) === value.lines.join('\n');
}
function applyOperator(state, operator, motion) {
    const base = { ...state, pendingNormal: null };
    if (motion === operator) {
        if (operator === 'd')
            return deleteCurrentLine(base);
        const lines = [...base.lines];
        lines[base.cursor.row] = '';
        return changed({
            ...base,
            lines,
            mode: 'insert',
            cursor: { ...base.cursor, grapheme: 0 },
        });
    }
    if (motion !== 'w' && motion !== '$')
        return unchanged(base);
    const line = currentLine(base);
    const start = base.cursor.grapheme;
    let end = graphemeCount(line);
    if (motion === 'w') {
        end = operator === 'c' ? endOfWord(line, start) : nextWordStart(line, start);
    }
    if (end <= start)
        return unchanged(base);
    const nextLine = replaceGraphemeRange(line, start, end, '');
    const next = replaceCurrentLine(base, nextLine, Math.min(start, normalLineEnd(nextLine)));
    if (operator === 'c') {
        return changed({ ...next, mode: 'insert', cursor: { ...next.cursor, grapheme: start } });
    }
    return changed(next);
}
function openLine(state, key) {
    const lines = [...state.lines];
    const row = key === 'o' ? state.cursor.row + 1 : state.cursor.row;
    lines.splice(row, 0, '');
    return changed({
        ...state,
        lines,
        mode: 'insert',
        cursor: { row, grapheme: 0 },
    });
}
function deleteCurrentLine(state) {
    const lines = [...state.lines];
    if (lines.length === 1)
        lines[0] = '';
    else
        lines.splice(state.cursor.row, 1);
    const row = Math.min(state.cursor.row, lines.length - 1);
    return changed({
        ...state,
        lines,
        cursor: { row, grapheme: Math.min(state.cursor.grapheme, normalLineEnd(lines[row] ?? '')) },
    });
}
function deleteNormalCharacter(state) {
    const line = currentLine(state);
    if (state.cursor.grapheme >= graphemeCount(line))
        return unchanged(state);
    const nextLine = replaceGraphemeRange(line, state.cursor.grapheme, state.cursor.grapheme + 1, '');
    return changed(replaceCurrentLine(state, nextLine, Math.min(state.cursor.grapheme, normalLineEnd(nextLine))));
}
function moveNormalCursor(state, direction) {
    if (direction === 'up' || direction === 'down') {
        const preferred = state.preferredGrapheme ?? state.cursor.grapheme;
        const row = Math.min(state.lines.length - 1, Math.max(0, state.cursor.row + (direction === 'up' ? -1 : 1)));
        return {
            ...state,
            cursor: {
                row,
                grapheme: Math.min(preferred, normalLineEnd(state.lines[row] ?? '')),
            },
            preferredGrapheme: preferred,
        };
    }
    const next = moveCursor(state, direction);
    return {
        ...next,
        cursor: {
            ...next.cursor,
            grapheme: Math.min(next.cursor.grapheme, normalLineEnd(currentLine(next))),
        },
        preferredGrapheme: null,
    };
}
function moveToRow(state, row) {
    const nextRow = Math.min(state.lines.length - 1, Math.max(0, row));
    return {
        ...state,
        cursor: {
            row: nextRow,
            grapheme: Math.min(state.cursor.grapheme, normalLineEnd(state.lines[nextRow] ?? '')),
        },
        preferredGrapheme: state.cursor.grapheme,
    };
}
function moveToNextWord(state) {
    const graphemes = splitGraphemes(currentLine(state));
    let index = state.cursor.grapheme;
    const kind = wordKind(graphemes[index] ?? '');
    while (index < graphemes.length && wordKind(graphemes[index] ?? '') === kind)
        index += 1;
    while (index < graphemes.length && wordKind(graphemes[index] ?? '') === 'space')
        index += 1;
    if (index < graphemes.length) {
        return {
            ...state,
            cursor: { ...state.cursor, grapheme: index },
            preferredGrapheme: null,
        };
    }
    for (let row = state.cursor.row + 1; row < state.lines.length; row += 1) {
        const next = splitGraphemes(state.lines[row] ?? '');
        const first = next.findIndex((grapheme) => wordKind(grapheme) !== 'space');
        if (first >= 0) {
            return { ...state, cursor: { row, grapheme: first }, preferredGrapheme: null };
        }
    }
    return state;
}
function moveToPreviousWord(state) {
    const graphemes = splitGraphemes(currentLine(state));
    let index = state.cursor.grapheme - 1;
    while (index >= 0 && wordKind(graphemes[index] ?? '') === 'space')
        index -= 1;
    if (index >= 0) {
        const kind = wordKind(graphemes[index] ?? '');
        while (index > 0 && wordKind(graphemes[index - 1] ?? '') === kind)
            index -= 1;
        return {
            ...state,
            cursor: { ...state.cursor, grapheme: index },
            preferredGrapheme: null,
        };
    }
    for (let row = state.cursor.row - 1; row >= 0; row -= 1) {
        const previous = splitGraphemes(state.lines[row] ?? '');
        let last = previous.length - 1;
        while (last >= 0 && wordKind(previous[last] ?? '') === 'space')
            last -= 1;
        if (last >= 0) {
            const kind = wordKind(previous[last] ?? '');
            while (last > 0 && wordKind(previous[last - 1] ?? '') === kind)
                last -= 1;
            return { ...state, cursor: { row, grapheme: last }, preferredGrapheme: null };
        }
    }
    return state;
}
function wordKind(grapheme) {
    if (/^\s$/u.test(grapheme))
        return 'space';
    if (/^[\p{L}\p{N}_]/u.test(grapheme))
        return 'word';
    return 'punctuation';
}
function firstNonBlank(line) {
    const index = splitGraphemes(line).findIndex((grapheme) => !/^\s$/u.test(grapheme));
    return index < 0 ? 0 : index;
}
function nextWordStart(line, start) {
    const graphemes = splitGraphemes(line);
    let index = start;
    const kind = wordKind(graphemes[index] ?? '');
    while (index < graphemes.length && wordKind(graphemes[index] ?? '') === kind)
        index += 1;
    while (index < graphemes.length && wordKind(graphemes[index] ?? '') === 'space')
        index += 1;
    return index;
}
function endOfWord(line, start) {
    const graphemes = splitGraphemes(line);
    let index = start;
    const kind = wordKind(graphemes[index] ?? '');
    while (index < graphemes.length && wordKind(graphemes[index] ?? '') === kind)
        index += 1;
    return index;
}
function replaceGraphemeRange(line, start, end, replacement) {
    const graphemes = splitGraphemes(line);
    return [...graphemes.slice(0, start), replacement, ...graphemes.slice(end)].join('');
}
function normalLineEnd(line) {
    return Math.max(0, graphemeCount(line) - 1);
}
function moveCursor(state, direction) {
    if (direction === 'left') {
        return {
            ...state,
            cursor: { ...state.cursor, grapheme: Math.max(0, state.cursor.grapheme - 1) },
        };
    }
    if (direction === 'right') {
        return {
            ...state,
            cursor: {
                ...state.cursor,
                grapheme: Math.min(graphemeCount(currentLine(state)), state.cursor.grapheme + 1),
            },
        };
    }
    const row = Math.min(state.lines.length - 1, Math.max(0, state.cursor.row + (direction === 'up' ? -1 : 1)));
    return {
        ...state,
        cursor: {
            row,
            grapheme: Math.min(state.cursor.grapheme, graphemeCount(state.lines[row] ?? '')),
        },
    };
}
function currentLine(state) {
    return state.lines[state.cursor.row] ?? '';
}
function replaceCurrentLine(state, line, grapheme) {
    const lines = [...state.lines];
    lines[state.cursor.row] = line;
    return { ...state, lines, cursor: { ...state.cursor, grapheme } };
}
function unchanged(state) {
    return { state, effects: [] };
}
function changed(state) {
    return {
        state,
        effects: [{ type: 'document-changed', text: editorText(state) }],
    };
}
//# sourceMappingURL=editor_engine.js.map