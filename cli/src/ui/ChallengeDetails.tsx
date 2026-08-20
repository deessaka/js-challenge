import React from 'react'
import { Box, Text } from 'ink'
import type { Challenge } from '../types.js'
import { shortcutHints } from './shortcut_catalog.js'
import { COLORS, sanitizeDescription } from './theme.js'

interface ChallengeDetailsProps {
  challenge: Challenge | null
}

export const ChallengeDetails: React.FC<ChallengeDetailsProps> = ({ challenge }) => {
  if (!challenge) {
    return (
      <Box borderStyle="round" borderColor={COLORS.border} padding={1}>
        <Text color={COLORS.textMuted}>Sélectionnez un exercice pour afficher ses consignes.</Text>
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
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={c.isUnlocked ? COLORS.borderFocus : COLORS.error}
      paddingX={1}
      paddingY={0}
    >
      {/* Title & Badges */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Box>
          <Text color={COLORS.text} bold>
            #{c.number} {c.title}
          </Text>
        </Box>
        <Box>
          <Text>
            {lockBadge}
            <Text color={COLORS.textDim}> │ </Text>
            <Text>[</Text>
            {diffBadge}
            <Text>]</Text>
            <Text color={COLORS.textDim}> │ </Text>
            <Text color={COLORS.warning}>+{c.points} pts</Text>
          </Text>
        </Box>
      </Box>

      {/* Locked Alert if applicable */}
      {!c.isUnlocked && (
        <Box
          borderStyle="round"
          borderColor={COLORS.error}
          paddingX={1}
          marginBottom={1}
          flexDirection="column"
        >
          <Text color={COLORS.error} bold>
            🔒 CET EXERCICE EST VERROUILLÉ
          </Text>
          <Text color={COLORS.textMuted}>
            Vous devez terminer l'exercice #{Math.max(1, c.number - 1)} pour débloquer l'éditeur et
            pouvoir tester votre code.
          </Text>
        </Box>
      )}

      {/* Narrative Section */}
      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.secondary} bold>
          📋 ÉNONCÉ DE L’EXERCICE
        </Text>
        {narrativeParagraphs.map((para, i) => (
          <Box key={i} marginTop={i > 0 ? 1 : 0}>
            <Text color={COLORS.text}>{para}</Text>
          </Box>
        ))}
      </Box>

      {/* Examples Card */}
      {exampleLines.length > 0 && (
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor={COLORS.border}
          paddingX={1}
          marginBottom={1}
        >
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
          <Text>
            <Text color={COLORS.warning}>💡 Astuce: </Text>
            <Text color={COLORS.textMuted}>{c.hint}</Text>
          </Text>
        </Box>
      )}

      {/* Action shortcuts */}
      <Box
        borderStyle="single"
        borderColor={c.isUnlocked ? COLORS.border : COLORS.error}
        paddingX={1}
        justifyContent="space-between"
      >
        <Text color={c.isUnlocked ? COLORS.textMuted : COLORS.error}>
          {c.isUnlocked
            ? shortcutHints(['instructions-edit', 'back'])
            : `🔒 Exercice verrouillé : Édition désactivée │ ${shortcutHints(['back'])}`}
        </Text>
        <Text color={COLORS.textDim}>{c.isUnlocked ? `Fichier: ${c.slug}.js` : 'Bloqué'}</Text>
      </Box>
    </Box>
  )
}
