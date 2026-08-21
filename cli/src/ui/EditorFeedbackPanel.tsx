import React from 'react'
import { Box, Text } from 'ink'

import { editorFeedbackLines, type EditorFeedbackState } from './editor_feedback.js'
import { COLORS } from './theme.js'

interface EditorFeedbackPanelProps {
  feedback: EditorFeedbackState
}

export const EditorFeedbackPanel: React.FC<EditorFeedbackPanelProps> = ({ feedback }) => {
  const lines = editorFeedbackLines(feedback)

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={feedbackColor(feedback)}
      paddingX={1}
    >
      {lines.map((line, index) => (
        <Text
          key={index}
          color={index === 0 ? feedbackColor(feedback) : COLORS.textMuted}
          wrap="truncate-end"
        >
          {line}
        </Text>
      ))}
    </Box>
  )
}

function feedbackColor(feedback: EditorFeedbackState): string {
  if (feedback.isStale) return COLORS.warning
  if (feedback.phase === 'running') return COLORS.cyan
  if (feedback.phase === 'error') return COLORS.error
  if (feedback.result?.submission.status === 'passed') return COLORS.success
  if (feedback.result) return COLORS.error
  return COLORS.border
}
