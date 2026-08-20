import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Box, Text } from 'ink';
import { shortcutHint, shortcutHints } from './shortcut_catalog.js';
import { COLORS } from './theme.js';
import { getVisibleExercises } from './terminal_view_state.js';
export const ChallengeList = ({ exercises, selectedExerciseId, searchQuery, filterMode, visibleCount = 12, }) => {
    const filtered = useMemo(() => {
        return getVisibleExercises({ filterMode, searchQuery }, exercises);
    }, [exercises, filterMode, searchQuery]);
    // Scroll window calculation
    const selectedIndex = filtered.findIndex((exercise) => exercise.id === selectedExerciseId);
    const safeIndex = selectedIndex < 0 ? 0 : selectedIndex;
    const startIdx = Math.max(0, Math.min(safeIndex - Math.floor(visibleCount / 2), Math.max(0, filtered.length - visibleCount)));
    const visibleItems = filtered.slice(startIdx, startIdx + visibleCount);
    const filterLabel = filterMode === 'all'
        ? 'Tous'
        : filterMode === 'unlocked'
            ? 'Disponibles'
            : filterMode === 'completed'
                ? 'Terminés'
                : 'Verrouillés';
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.borderFocus, paddingX: 1, paddingY: 0, children: [_jsxs(Box, { justifyContent: "space-between", marginBottom: 1, children: [_jsx(Box, { children: _jsxs(Text, { children: [_jsx(Text, { color: COLORS.primary, bold: true, children: "\uD83D\uDCC2 CATALOGUE PUBLIC" }), _jsxs(Text, { color: COLORS.textMuted, children: [" (", filtered.length, " affich\u00E9s)"] })] }) }), _jsx(Box, { children: _jsxs(Text, { children: [_jsxs(Text, { color: COLORS.textDim, children: [shortcutHint('catalog-filter'), " : "] }), _jsx(Text, { color: COLORS.cyan, bold: true, children: filterLabel })] }) })] }), searchQuery !== '' && (_jsx(Box, { marginBottom: 1, children: _jsxs(Text, { children: [_jsx(Text, { color: COLORS.warning, children: "\uD83D\uDD0D Recherche: " }), _jsxs(Text, { color: COLORS.text, bold: true, children: ["\"", searchQuery, "\""] })] }) })), visibleItems.length === 0 ? (_jsx(Box, { paddingY: 1, children: _jsx(Text, { color: COLORS.textMuted, children: "Aucun exercice ne correspond \u00E0 ce filtre." }) })) : (visibleItems.map((c, i) => {
                const actualIndex = startIdx + i;
                const isSelected = actualIndex === safeIndex;
                const statusIcon = c.isCompleted ? (_jsx(Text, { color: COLORS.success, children: "\u2713 " })) : c.progressStatus === 'in_progress' ? (_jsx(Text, { color: COLORS.warning, children: "\u25D0 " })) : c.isUnlocked ? (_jsx(Text, { color: COLORS.primary, children: "\u25CF " })) : (_jsx(Text, { color: COLORS.textDim, children: "\uD83D\uDD12 " }));
                const diffBadge = c.difficultyLabel === 'easy' ? (_jsx(Text, { color: COLORS.success, children: "Facile" })) : c.difficultyLabel === 'medium' ? (_jsx(Text, { color: COLORS.warning, children: "Moyen" })) : (_jsx(Text, { color: COLORS.error, children: "Difficile" }));
                return (_jsxs(Box, { justifyContent: "space-between", children: [_jsx(Box, { children: _jsxs(Text, { children: [_jsx(Text, { color: isSelected ? COLORS.primary : COLORS.textDim, children: isSelected ? '➔ ' : '  ' }), statusIcon, _jsxs(Text, { color: COLORS.textMuted, children: ["#", String(c.number).padStart(2, '0'), " "] }), _jsx(Text, { color: isSelected ? COLORS.text : c.isUnlocked ? COLORS.text : COLORS.textDim, bold: isSelected, children: c.title })] }) }), _jsx(Box, { children: _jsxs(Text, { children: ["[", diffBadge, "] ", _jsxs(Text, { color: COLORS.warning, children: ["+", c.points, "p"] })] }) })] }, c.id || c.slug));
            })), _jsxs(Box, { marginTop: 1, borderStyle: "single", borderColor: COLORS.border, paddingX: 1, justifyContent: "space-between", children: [_jsx(Text, { color: COLORS.textMuted, children: shortcutHints(['catalog-move', 'catalog-search', 'catalog-filter', 'catalog-open']) }), _jsxs(Text, { color: COLORS.textDim, children: [safeIndex + 1, "/", filtered.length] })] })] }));
};
//# sourceMappingURL=ChallengeList.js.map