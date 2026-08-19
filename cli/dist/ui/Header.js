import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { COLORS } from './theme.js';
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
export const Header = ({ user, challenges, activeTab, apiBaseUrl }) => {
    const total = challenges.length;
    const completed = challenges.filter((c) => c.isCompleted).length;
    const totalPoints = challenges.filter((c) => c.isCompleted).reduce((sum, c) => sum + c.points, 0);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const progressBars = Math.round((percent / 100) * 16);
    const barFilled = '█'.repeat(progressBars);
    const barEmpty = '░'.repeat(16 - progressBars);
    const endpoint = apiStatus(apiBaseUrl);
    return (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsxs(Box, { justifyContent: "space-between", borderStyle: "round", borderColor: COLORS.border, paddingX: 1, children: [_jsx(Box, { children: _jsxs(Text, { children: [_jsx(Text, { color: COLORS.primary, bold: true, children: "\uD83E\uDD4B CODOJO" }), _jsx(Text, { color: COLORS.textMuted, children: " \u2502 Terminal Edition" })] }) }), _jsx(Box, { children: user ? (_jsxs(Text, { children: [_jsx(Text, { color: COLORS.success, children: "\u25CF " }), _jsx(Text, { color: COLORS.text, bold: true, children: user.username }), _jsxs(Text, { color: COLORS.warning, children: [" (", totalPoints, " pts)"] })] })) : (_jsx(Text, { color: COLORS.warning, children: "\u25CB D\u00E9connect\u00E9" })) })] }), _jsx(Box, { paddingX: 1, children: _jsxs(Text, { color: endpoint.color, children: ["\u25CF ", endpoint.label] }) }), _jsxs(Box, { justifyContent: "space-between", paddingX: 1, marginTop: 0, children: [_jsx(Box, { children: _jsxs(Text, { children: [_jsx(Text, { color: activeTab === 'list' ? COLORS.primary : COLORS.textMuted, bold: activeTab === 'list', children: "[1: D\u00E9fis]" }), _jsx(Text, { children: " " }), _jsx(Text, { color: activeTab === 'details' ? COLORS.primary : COLORS.textMuted, bold: activeTab === 'details', children: "[2: Consignes]" }), _jsx(Text, { children: " " }), _jsx(Text, { color: activeTab === 'editor' ? COLORS.primary : COLORS.textMuted, bold: activeTab === 'editor', children: "[3: \u00C9diteur]" }), _jsx(Text, { children: " " }), _jsx(Text, { color: activeTab === 'test' ? COLORS.primary : COLORS.textMuted, bold: activeTab === 'test', children: "[4: Tests]" }), _jsx(Text, { children: " " }), _jsx(Text, { color: activeTab === 'help' ? COLORS.primary : COLORS.textMuted, bold: activeTab === 'help', children: "[?: Aide]" })] }) }), _jsx(Box, { children: _jsxs(Text, { children: [_jsx(Text, { color: COLORS.textMuted, children: "Progression: " }), _jsxs(Text, { color: COLORS.cyan, children: ["[", barFilled, barEmpty, "] "] }), _jsxs(Text, { color: COLORS.text, bold: true, children: [completed, "/", total, " (", percent, "%)"] })] }) })] })] }));
};
//# sourceMappingURL=Header.js.map