import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { COLORS } from './theme.js';
import { terminalViewEventForKey } from './terminal_view_state.js';
export const RecoveryPrompt = ({ challengeTitle, mainCode, recoveryCode, onRestore, onIgnore, onSelectView, }) => {
    const [isInspecting, setIsInspecting] = useState(false);
    const [isResolving, setIsResolving] = useState(false);
    const [error, setError] = useState(null);
    const resolve = async (decision) => {
        setIsResolving(true);
        setError(null);
        try {
            await (decision === 'restore' ? onRestore() : onIgnore());
        }
        catch (caught) {
            setError(caught instanceof Error ? caught.message : String(caught));
            setIsResolving(false);
        }
    };
    useInput((input, key) => {
        if (isResolving)
            return;
        const viewEvent = terminalViewEventForKey(input, key.ctrl);
        if (viewEvent?.type === 'select-view' && input !== '?') {
            onSelectView?.(viewEvent.view);
            return;
        }
        if (input === 'r')
            void resolve('restore');
        if (input === 'v')
            setIsInspecting((value) => !value);
        if (input === 'i')
            void resolve('ignore');
    });
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.warning, paddingX: 1, children: [_jsxs(Text, { color: COLORS.warning, bold: true, children: ["R\u00E9cup\u00E9ration plus r\u00E9cente d\u00E9tect\u00E9e \u2014 ", challengeTitle] }), _jsx(Text, { children: "Le fichier principal n\u2019a pas \u00E9t\u00E9 modifi\u00E9." }), isInspecting && (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Text, { color: COLORS.textMuted, children: "Fichier principal :" }), _jsx(Text, { children: preview(mainCode) }), _jsx(Text, { color: COLORS.textMuted, children: "R\u00E9cup\u00E9ration :" }), _jsx(Text, { children: preview(recoveryCode) })] })), error && _jsxs(Text, { color: COLORS.error, children: ["Impossible d\u2019appliquer ce choix : ", error] }), _jsx(Text, { color: COLORS.primary, children: isResolving ? 'Traitement…' : '[R] Restaurer  [V] Inspecter  [I] Ignorer' })] }));
};
function preview(code) {
    const lines = code.split('\n').slice(0, 8);
    const suffix = code.split('\n').length > lines.length ? '\n…' : '';
    return `${lines.join('\n')}${suffix}` || '(vide)';
}
//# sourceMappingURL=RecoveryPrompt.js.map