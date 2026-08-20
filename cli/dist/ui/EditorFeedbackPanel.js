import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { editorFeedbackLines } from './editor_feedback.js';
import { COLORS } from './theme.js';
export const EditorFeedbackPanel = ({ feedback }) => {
    const lines = editorFeedbackLines(feedback);
    return (_jsx(Box, { flexDirection: "column", borderStyle: "single", borderColor: feedbackColor(feedback), paddingX: 1, children: lines.map((line, index) => (_jsx(Text, { color: index === 0 ? feedbackColor(feedback) : COLORS.textMuted, wrap: "truncate-end", children: line }, index))) }));
};
function feedbackColor(feedback) {
    if (feedback.isStale)
        return COLORS.warning;
    if (feedback.phase === 'running')
        return COLORS.cyan;
    if (feedback.phase === 'error')
        return COLORS.error;
    if (feedback.result?.submission.status === 'passed')
        return COLORS.success;
    if (feedback.result)
        return COLORS.error;
    return COLORS.border;
}
//# sourceMappingURL=EditorFeedbackPanel.js.map