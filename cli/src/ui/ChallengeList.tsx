import React, { useMemo } from 'react'
import { Box, Text } from 'ink'
import type { Challenge } from '../types.js'
import { COLORS } from './theme.js'

interface ChallengeListProps {
  challenges: Challenge[]
  selectedIndex: number
  searchQuery: string
  filterMode: 'all' | 'unlocked' | 'completed' | 'locked'
  visibleCount?: number
}

export const ChallengeList: React.FC<ChallengeListProps> = ({
  challenges,
  selectedIndex,
  searchQuery,
  filterMode,
  visibleCount = 12,
}) => {
  const filtered = useMemo(() => {
    return challenges.filter((c) => {
      if (filterMode === 'unlocked' && (!c.isUnlocked || c.isCompleted)) return false
      if (filterMode === 'completed' && !c.isCompleted) return false
      if (filterMode === 'locked' && c.isUnlocked) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = c.title.toLowerCase().includes(q)
        const matchNum = String(c.number).includes(q)
        const matchSlug = c.slug.toLowerCase().includes(q)
        return matchTitle || matchNum || matchSlug
      }
      return true
    })
  }, [challenges, filterMode, searchQuery])

  // Scroll window calculation
  const safeIndex = Math.min(Math.max(0, selectedIndex), Math.max(0, filtered.length - 1))
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
