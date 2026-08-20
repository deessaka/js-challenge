export function editorEventFromInk(input, key, mode) {
    if (mode === 'normal' && key.ctrl && input === 'r')
        return { type: 'redo' };
    if (key.escape)
        return { type: 'enter-normal' };
    if (key.upArrow)
        return { type: 'move-visual', direction: 'up' };
    if (key.downArrow)
        return { type: 'move-visual', direction: 'down' };
    if (key.leftArrow)
        return { type: 'move-visual', direction: 'left' };
    if (key.rightArrow)
        return { type: 'move-visual', direction: 'right' };
    if (mode === 'insert') {
        if (key.return)
            return { type: 'insert-line-break' };
        if (key.backspace || key.delete)
            return { type: 'backspace' };
        if (input && !/[\r\n]/.test(input) && (!key.ctrl || key.meta)) {
            return { type: 'insert-text', text: input };
        }
        return null;
    }
    if (mode === 'replace') {
        if (input && !/[\r\n]/.test(input) && (!key.ctrl || key.meta)) {
            return { type: 'replace-text', text: input };
        }
        return null;
    }
    if (input === 'u' && !key.ctrl && !key.meta)
        return { type: 'undo' };
    if (input && !/[\r\n]/.test(input) && (!key.ctrl || key.meta)) {
        return { type: 'normal-key', key: input };
    }
    return null;
}
//# sourceMappingURL=editor_input.js.map