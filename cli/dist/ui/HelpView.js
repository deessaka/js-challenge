import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, useWindowSize } from 'ink';
import { HELP_SHORTCUT_GROUPS, TERMINAL_SHORTCUTS, shortcutHints } from './shortcut_catalog.js';
import { COLORS } from './theme.js';
const GROUP_COLORS = [COLORS.primary, COLORS.secondary, COLORS.cyan, COLORS.warning, COLORS.success];
export const HelpView = () => {
    const { columns, rows } = useWindowSize();
    const isCompact = columns < 100 || rows < 46;
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.secondary, paddingX: 1, paddingY: 0, children: [_jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsx(Text, { color: COLORS.secondary, bold: true, children: "\uD83D\uDCA1 AIDE DES VUES TERMINAL & DE L\u2019\u00C9DITEUR INT\u00C9GR\u00C9" }) }), HELP_SHORTCUT_GROUPS.map((group, groupIndex) => (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsxs(Text, { color: GROUP_COLORS[groupIndex % GROUP_COLORS.length], bold: true, children: ["\u25A0 ", group.title] }), isCompact ? (_jsxs(Text, { color: COLORS.text, children: [" ", shortcutHints(group.shortcuts)] })) : (group.shortcuts.map((id) => {
                        const shortcut = TERMINAL_SHORTCUTS[id];
                        return (_jsxs(Text, { color: COLORS.text, children: [' ', shortcut.keys, " : ", shortcut.description] }, id));
                    }))] }, group.title))), _jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { color: COLORS.warning, bold: true, children: "\u25A0 SAISIE, WRAPPING & COLLAGE" }), _jsxs(Text, { color: COLORS.text, children: [' ', "Les lignes longues reviennent visuellement \u00E0 la ligne, sans modifier la solution."] }), _jsxs(Text, { color: COLORS.text, children: [' ', "Le collage identifiable est d\u00E9sactiv\u00E9 et ne modifie ni le document ni son historique."] })] }), _jsx(Box, { borderStyle: "single", borderColor: COLORS.border, paddingX: 1, children: _jsx(Text, { color: COLORS.textMuted, children: shortcutHints(['view-catalog', 'back']) }) })] }));
};
//# sourceMappingURL=HelpView.js.map