import React, { useMemo } from 'react'
import { Box, Text } from 'ink'
import type { Challenge as Exercise } from '../types.js'
import { COLORS } from './theme.js'
import { getVisibleExercises, type ExerciseFilter } from './terminal_view_state.js'

interface ChallengeListProps {
  exercises: Exercise[]
  selectedExerciseId: string | null
  searchQuery: string
  filterMode: ExerciseFilter
  visibleCount?: number
}

export const ChallengeList: React.FC<ChallengeListProps> = ({
  exercises,
  selectedExerciseId,
  searchQuery,
  filterMode,
  visibleCount = 12,
}) => {
  const filtered = useMemo(() => {
    return getVisibleExercises({ filterMode, searchQuery }, exercises)
  }, [exercises, filterMode, searchQuery])

  // Scroll window calculation
  const selectedIndex = filtered.findIndex((exercise) => exercise.id === selectedExerciseId)
  const safeIndex = selectedIndex < 0 ? 0 : selectedIndex
  const startIdx = Math.max(
    0,
    Math.min(safeIndex - Math.floor(visibleCount / 2), Math.max(0, filtered.length - visibleCount))
  )
  const visibleItems = filtered.slice(startIdx, startIdx + visibleCount)

  const filterLabel =
    filterMode === 'all'
      ? 'Tous'
      : filterMode === 'unlocked'
        ? 'Disponibles'
        : filterMode === 'completed'
          ? 'Terminés'
          : 'Verrouillés'

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={COLORS.borderFocus} paddingX={1} paddingY={0}>
      {/* Header bar */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Box>
          <Text>
            <Text color={COLORS.primary} bold>
              📂 LISTE DES DÉFIS
            </Text>
            <Text color={COLORS.textMuted}> ({filtered.length} affichés)</Text>
          </Text>
        </Box>
        <Box>
          <Text>
            <Text color={COLORS.textDim}>Filtre [f]: </Text>
            <Text color={COLORS.cyan} bold>
              {filterLabel}
            </Text>
          </Text>
        </Box>
      </Box>

      {/* Search Bar */}
      {searchQuery !== '' && (
        <Box marginBottom={1}>
          <Text>
            <Text color={COLORS.warning}>🔍 Recherche: </Text>
            <Text color={COLORS.text} bold>
              "{searchQuery}"
            </Text>
          </Text>
        </Box>
      )}

      {/* Items list */}
      {visibleItems.length === 0 ? (
        <Box paddingY={1}>
          <Text color={COLORS.textMuted}>Aucun exercice ne correspond à ce filtre.</Text>
        </Box>
      ) : (
        visibleItems.map((c, i) => {
          const actualIndex = startIdx + i
          const isSelected = actualIndex === safeIndex

          const statusIcon = c.isCompleted ? (
            <Text color={COLORS.success}>✓ </Text>
          ) : c.progressStatus === 'in_progress' ? (
            <Text color={COLORS.warning}>◐ </Text>
          ) : c.isUnlocked ? (
            <Text color={COLORS.primary}>● </Text>
          ) : (
            <Text color={COLORS.textDim}>🔒 </Text>
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
            <Box key={c.id || c.slug} justifyContent="space-between">
              <Box>
                <Text>
                  <Text color={isSelected ? COLORS.primary : COLORS.textDim}>
                    {isSelected ? '➔ ' : '  '}
                  </Text>
                  {statusIcon}
                  <Text color={COLORS.textMuted}>#{String(c.number).padStart(2, '0')} </Text>
                  <Text
                    color={isSelected ? COLORS.text : c.isUnlocked ? COLORS.text : COLORS.textDim}
                    bold={isSelected}
                  >
                    {c.title}
                  </Text>
                </Text>
              </Box>

              <Box>
                <Text>
                  [{diffBadge}] <Text color={COLORS.warning}>+{c.points}p</Text>
                </Text>
              </Box>
            </Box>
          )
        })
      )}

      {/* Footer Navigation Hints */}
      <Box marginTop={1} borderStyle="single" borderColor={COLORS.border} paddingX={1} justifyContent="space-between">
        <Text color={COLORS.textMuted}>
          [↑↓/jk] Naviguer │ [/] Chercher │ [f] Filtrer │ [Entrée] Sélectionner
        </Text>
        <Text color={COLORS.textDim}>
          {safeIndex + 1}/{filtered.length}
        </Text>
      </Box>
    </Box>
  )
}
