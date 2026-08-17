import React from 'react'
import { Box, Text } from 'ink'
import type { Challenge } from '../types.js'
import { COLORS, sanitizeDescription } from './theme.js'

interface ChallengeDetailsProps {
  challenge: Challenge | null
}

export const ChallengeDetails: React.FC<ChallengeDetailsProps> = ({ challenge }) => {
  if (!challenge) {
    return (
      <Box borderStyle="round" borderColor={COLORS.border} padding={1}>
        <Text color={COLORS.textMuted}>Sélectionnez un défi pour afficher ses consignes.</Text>
      </Box>
    )
  }

  const c = challenge
  const sanitized = sanitizeDescription(c.description || '')
  const rawLines = sanitized.split(/\r?\n/)

  const narrativeParagraphs: string[] = []
  const exampleLines: string[] = []
  let currentNarrative = ''

  for (const line of rawLines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (currentNarrative) {
        narrativeParagraphs.push(currentNarrative)
        currentNarrative = ''
      }
      continue
    }

    if (trimmed.includes('➔') || trimmed.includes('===')) {
      if (currentNarrative) {
        narrativeParagraphs.push(currentNarrative)
        currentNarrative = ''
      }
      exampleLines.push(trimmed)
    } else {
      if (currentNarrative) {
        currentNarrative += ' ' + trimmed
      } else {
        currentNarrative = trimmed
      }
    }
  }
  if (currentNarrative) {
    narrativeParagraphs.push(currentNarrative)
  }

  const lockBadge = c.isCompleted ? (
    <Text color={COLORS.success} bold>
      [✓ Terminé]
    </Text>
  ) : c.isUnlocked ? (
    <Text color={COLORS.primary} bold>
      [● Débloqué]
    </Text>
  ) : (
    <Text color={COLORS.error} bold>
      [🔒 Verrouillé]
    </Text>
  )

  const diffBadge =
    c.difficultyLabel === 'easy' ? (
      <Text color={COLORS.success}>Facile</Text>
    ) : c.difficultyLabel === 'medium' ? (
      <Text color={COLORS.warning}>Moyen</Text>
    ) : (
      <Text color={COLORS.error}>Difficile</Text>
    )

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={COLORS.borderFocus} paddingX={1} paddingY={0}>
      {/* Title & Badges */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Box>
          <Text color={COLORS.text} bold>
            #{c.number} {c.title}
          </Text>
        </Box>
        <Box>
          {lockBadge} <Text color={COLORS.textDim}>│</Text> [{diffBadge}] <Text color={COLORS.textDim}>│</Text>{' '}
          <Text color={COLORS.warning}>+{c.points} pts</Text>
        </Box>
      </Box>

      {/* Narrative Section */}
      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.secondary} bold>
          📋 ÉNONCÉ DU CHALLENGE
        </Text>
        {narrativeParagraphs.map((para, i) => (
          <Box key={i} marginTop={i > 0 ? 1 : 0}>
            <Text color={COLORS.text}>{para}</Text>
          </Box>
        ))}
      </Box>

      {/* Examples Card */}
      {exampleLines.length > 0 && (
        <Box flexDirection="column" borderStyle="round" borderColor={COLORS.border} paddingX={1} marginBottom={1}>
          <Text color={COLORS.cyan} bold>
            💡 EXEMPLES ATTENDUS
          </Text>
          {exampleLines.map((ex, i) => {
            const parts = ex.split('➔')
            if (parts.length === 2) {
              const call = parts[0].trim()
              const result = parts[1].trim()
              return (
                <Box key={i} marginTop={0}>
                  <Text>
                    <Text color={COLORS.primary}>{call} </Text>
                    <Text color={COLORS.warning}>➔ </Text>
                    <Text color={COLORS.success} bold>
                      {result}
                    </Text>
                  </Text>
                </Box>
              )
            }
            return (
              <Box key={i}>
                <Text color={COLORS.cyan}>{ex}</Text>
              </Box>
            )
          })}
        </Box>
      )}

      {/* Hint if present */}
      {c.hint && (
        <Box borderStyle="single" borderColor={COLORS.warning} paddingX={1} marginBottom={1}>
          <Text color={COLORS.warning}>💡 Astuce: </Text>
          <Text color={COLORS.textMuted}>{c.hint}</Text>
        </Box>
      )}

      {/* Action shortcuts */}
      <Box borderStyle="single" borderColor={COLORS.border} paddingX={1} justifyContent="space-between">
        <Text color={COLORS.textMuted}>
          [e] Éditer (Neovim/$EDITOR) │ [t] Tester │ [s] Soumettre │ [w] Watch Mode │ [Échap] Liste
        </Text>
        <Text color={COLORS.textDim}>Fichier: {c.slug}.js</Text>
      </Box>
    </Box>
  )
}
