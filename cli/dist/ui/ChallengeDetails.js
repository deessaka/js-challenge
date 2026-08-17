import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { COLORS, sanitizeDescription } from './theme.js';
export const ChallengeDetails = ({ challenge }) => {
    if (!challenge) {
        return (_jsx(Box, { borderStyle: "round", borderColor: COLORS.border, padding: 1, children: _jsx(Text, { color: COLORS.textMuted, children: "S\u00E9lectionnez un d\u00E9fi pour afficher ses consignes." }) }));
    }
    const c = challenge;
    const sanitized = sanitizeDescription(c.description || '');
    const rawLines = sanitized.split(/\r?\n/);
    const narrativeParagraphs = [];
    const exampleLines = [];
    let currentNarrative = '';
    for (const line of rawLines) {
        const trimmed = line.trim();
        if (!trimmed) {
            if (currentNarrative) {
                narrativeParagraphs.push(currentNarrative);
                currentNarrative = '';
            }
            continue;
        }
        if (trimmed.includes('➔') || trimmed.includes('===')) {
            if (currentNarrative) {
                narrativeParagraphs.push(currentNarrative);
                currentNarrative = '';
            }
            exampleLines.push(trimmed);
        }
        else {
            if (currentNarrative) {
                currentNarrative += ' ' + trimmed;
            }
            else {
                currentNarrative = trimmed;
            }
        }
    }
    if (currentNarrative) {
        narrativeParagraphs.push(currentNarrative);
    }
    const lockBadge = c.isCompleted ? (_jsx(Text, { color: COLORS.success, bold: true, children: "[\u2713 Termin\u00E9]" })) : c.isUnlocked ? (_jsx(Text, { color: COLORS.primary, bold: true, children: "[\u25CF D\u00E9bloqu\u00E9]" })) : (_jsx(Text, { color: COLORS.error, bold: true, children: "[\uD83D\uDD12 Verrouill\u00E9]" }));
    const diffBadge = c.difficultyLabel === 'easy' ? (_jsx(Text, { color: COLORS.success, children: "Facile" })) : c.difficultyLabel === 'medium' ? (_jsx(Text, { color: COLORS.warning, children: "Moyen" })) : (_jsx(Text, { color: COLORS.error, children: "Difficile" }));
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: c.isUnlocked ? COLORS.borderFocus : COLORS.error, paddingX: 1, paddingY: 0, children: [_jsxs(Box, { justifyContent: "space-between", marginBottom: 1, children: [_jsx(Box, { children: _jsxs(Text, { color: COLORS.text, bold: true, children: ["#", c.number, " ", c.title] }) }), _jsx(Box, { children: _jsxs(Text, { children: [lockBadge, _jsx(Text, { color: COLORS.textDim, children: " \u2502 " }), _jsx(Text, { children: "[" }), diffBadge, _jsx(Text, { children: "]" }), _jsx(Text, { color: COLORS.textDim, children: " \u2502 " }), _jsxs(Text, { color: COLORS.warning, children: ["+", c.points, " pts"] })] }) })] }), !c.isUnlocked && (_jsxs(Box, { borderStyle: "round", borderColor: COLORS.error, paddingX: 1, marginBottom: 1, flexDirection: "column", children: [_jsx(Text, { color: COLORS.error, bold: true, children: "\uD83D\uDD12 CET EXERCICE EST VERROUILL\u00C9" }), _jsxs(Text, { color: COLORS.textMuted, children: ["Vous devez terminer l'exercice #", Math.max(1, c.number - 1), " pour d\u00E9bloquer l'\u00E9diteur et pouvoir tester votre code."] })] })), _jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { color: COLORS.secondary, bold: true, children: "\uD83D\uDCCB \u00C9NONC\u00C9 DU CHALLENGE" }), narrativeParagraphs.map((para, i) => (_jsx(Box, { marginTop: i > 0 ? 1 : 0, children: _jsx(Text, { color: COLORS.text, children: para }) }, i)))] }), exampleLines.length > 0 && (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.border, paddingX: 1, marginBottom: 1, children: [_jsx(Text, { color: COLORS.cyan, bold: true, children: "\uD83D\uDCA1 EXEMPLES ATTENDUS" }), exampleLines.map((ex, i) => {
                        const parts = ex.split('➔');
                        if (parts.length === 2) {
                            const call = parts[0].trim();
                            const result = parts[1].trim();
                            return (_jsx(Box, { marginTop: 0, children: _jsxs(Text, { children: [_jsxs(Text, { color: COLORS.primary, children: [call, " "] }), _jsx(Text, { color: COLORS.warning, children: "\u2794 " }), _jsx(Text, { color: COLORS.success, bold: true, children: result })] }) }, i));
                        }
                        return (_jsx(Box, { children: _jsx(Text, { color: COLORS.cyan, children: ex }) }, i));
                    })] })), c.hint && (_jsx(Box, { borderStyle: "single", borderColor: COLORS.warning, paddingX: 1, marginBottom: 1, children: _jsxs(Text, { children: [_jsx(Text, { color: COLORS.warning, children: "\uD83D\uDCA1 Astuce: " }), _jsx(Text, { color: COLORS.textMuted, children: c.hint })] }) })), _jsxs(Box, { borderStyle: "single", borderColor: c.isUnlocked ? COLORS.border : COLORS.error, paddingX: 1, justifyContent: "space-between", children: [_jsx(Text, { color: c.isUnlocked ? COLORS.textMuted : COLORS.error, children: c.isUnlocked
                            ? '[Entrée/e] Éditeur intégré │ [t] Tester │ [s] Soumettre │ [w] Watch Mode │ [Échap] Liste'
                            : '🔒 Exercice verrouillé : Édition désactivée │ [Échap] Retour liste' }), _jsx(Text, { color: COLORS.textDim, children: c.isUnlocked ? `Fichier: ${c.slug}.js` : 'Bloqué' })] })] }));
};
//# sourceMappingURL=ChallengeDetails.js.map