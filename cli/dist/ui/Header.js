import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Text } from 'ink';
import { COLORS } from './theme.js';
import { GLOBAL_VIEW_SHORTCUTS } from './terminal_view_state.js';
function apiStatus(apiBaseUrl) {
    try {
        const url = new URL(apiBaseUrl);
        const isLive = url.protocol === 'https:' && url.hostname === 'codojo.ekodevs.com';
        return {
            label: `${isLive ? 'LIVE' : 'DEV'} · ${url.host}`,
            color: isLive ? COLORS.success : COLORS.warning,
        };
    }
    catch {
        return { label: `API · ${apiBaseUrl}`, color: COLORS.error };
    }
}
export const Header = ({ user, challenges, activeView, apiBaseUrl }) => {
    const total = challenges.length;
    const completed = challenges.filter((c) => c.isCompleted).length;
    const totalPoints = challenges.filter((c) => c.isCompleted).reduce((sum, c) => sum + c.points, 0);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const progressBars = Math.round((percent / 100) * 16);
    const barFilled = '█'.repeat(progressBars);
    const barEmpty = '░'.repeat(16 - progressBars);
    const endpoint = apiStatus(apiBaseUrl);
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsxs(Box, { justifyContent: "space-between", borderStyle: "round", borderColor: COLORS.border, paddingX: 1, children: [_jsx(Box, { children: _jsxs(Text, { children: [_jsx(Text, { color: COLORS.primary, bold: true, children: "\uD83E\uDD4B CODOJO" }), _jsx(Text, { color: COLORS.textMuted, children: " \u2502 Terminal Edition" })] }) }), _jsx(Box, { children: user ? (_jsxs(Text, { children: [_jsx(Text, { color: COLORS.success, children: "\u25CF " }), _jsx(Text, { color: COLORS.text, bold: true, children: user.username }), _jsxs(Text, { color: COLORS.warning, children: [" (", totalPoints, " pts)"] })] })) : (_jsx(Text, { color: COLORS.warning, children: "\u25CB D\u00E9connect\u00E9" })) })] }), _jsx(Box, { paddingX: 1, children: _jsxs(Text, { color: endpoint.color, children: ["\u25CF ", endpoint.label] }) }), _jsxs(Box, { justifyContent: "space-between", paddingX: 1, marginTop: 0, children: [_jsx(Box, { children: _jsx(Text, { children: GLOBAL_VIEW_SHORTCUTS.map((shortcut, index) => (_jsxs(React.Fragment, { children: [index > 0 && _jsx(Text, { children: " " }), _jsxs(Text, { color: activeView === shortcut.view ? COLORS.primary : COLORS.textMuted, bold: activeView === shortcut.view, children: ["[", shortcut.input === '?' ? '?' : `Ctrl+${shortcut.input}`, ": ", shortcut.label, "]"] })] }, shortcut.view))) }) }), _jsx(Box, { children: _jsxs(Text, { children: [_jsx(Text, { color: COLORS.textMuted, children: "Progression: " }), _jsxs(Text, { color: COLORS.cyan, children: ["[", barFilled, barEmpty, "] "] }), _jsxs(Text, { color: COLORS.text, bold: true, children: [completed, "/", total, " (", percent, "%)"] })] }) })] })] }));
};
//# sourceMappingURL=Header.js.map