export function editorEventFromInk(input, key, mode) {
    if (key.escape)
        return { type: 'enter-normal' };
    if (key.upArrow)
        return { type: 'move', direction: 'up' };
    if (key.downArrow)
        return { type: 'move', direction: 'down' };
    if (key.leftArrow)
        return { type: 'move', direction: 'left' };
    if (key.rightArrow)
        return { type: 'move', direction: 'right' };
    if (mode === 'insert') {
        if (key.return)
            return { type: 'insert-line-break' };
        if (key.backspace || key.delete)
            return { type: 'backspace' };
        if (input && !key.ctrl)
            return { type: 'insert-text', text: input };
        return null;
    }
    if (input === 'i')
        return { type: 'enter-insert' };
    if (input === 'h')
        return { type: 'move', direction: 'left' };
    if (input === 'j')
        return { type: 'move', direction: 'down' };
    if (input === 'k')
        return { type: 'move', direction: 'up' };
    if (input === 'l')
        return { type: 'move', direction: 'right' };
    if (input === '0')
        return { type: 'move-line-start' };
    if (input === '$')
        return { type: 'move-line-end' };
    if (input === 'x')
        return { type: 'delete-character' };
    return null;
}
//# sourceMappingURL=editor_input.js.map