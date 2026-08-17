import React from 'react'
import { Box, Text } from 'ink'
import type { User, Challenge } from '../types.js'
import { COLORS } from './theme.js'

interface HeaderProps {
  user: User | null
  challenges: Challenge[]
  activeTab: 'list' | 'details' | 'editor' | 'test' | 'help'
}

export const Header: React.FC<HeaderProps> = ({ user, challenges, activeTab }) => {
  const total = challenges.length
  const completed = challenges.filter((c) => c.isCompleted).length
  const totalPoints = challenges.filter((c) => c.isCompleted).reduce((sum, c) => sum + c.points, 0)
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const progressBars = Math.round((percent / 100) * 16)
  const barFilled = '█'.repeat(progressBars)
  const barEmpty = '░'.repeat(16 - progressBars)

  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Top Banner */}
      <Box justifyContent="space-between" borderStyle="round" borderColor={COLORS.border} paddingX={1}>
        <Box>
          <Text>
            <Text color={COLORS.primary} bold>
              🥋 CODOJO
            </Text>
            <Text color={COLORS.textMuted}> │ Terminal Edition</Text>
          </Text>
        </Box>

        <Box>
          {user ? (
            <Text>
              <Text color={COLORS.success}>● </Text>
              <Text color={COLORS.text} bold>
                {user.username}
              </Text>
              <Text color={COLORS.warning}> ({totalPoints} pts)</Text>
            </Text>
          ) : (
            <Text color={COLORS.warning}>○ Déconnecté</Text>
          )}
        </Box>
      </Box>

      {/* Progress & Navigation Tabs */}
      <Box justifyContent="space-between" paddingX={1} marginTop={0}>
        <Box>
          <Text>
            <Text color={activeTab === 'list' ? COLORS.primary : COLORS.textMuted} bold={activeTab === 'list'}>
              [1: Défis]
            </Text>
            <Text> </Text>
            <Text color={activeTab === 'details' ? COLORS.primary : COLORS.textMuted} bold={activeTab === 'details'}>
              [2: Consignes]
            </Text>
            <Text> </Text>
            <Text color={activeTab === 'editor' ? COLORS.primary : COLORS.textMuted} bold={activeTab === 'editor'}>
              [3: Éditeur]
            </Text>
            <Text> </Text>
            <Text color={activeTab === 'test' ? COLORS.primary : COLORS.textMuted} bold={activeTab === 'test'}>
              [4: Tests]
            </Text>
            <Text> </Text>
            <Text color={activeTab === 'help' ? COLORS.primary : COLORS.textMuted} bold={activeTab === 'help'}>
              [?: Aide]
            </Text>
          </Text>
        </Box>

        <Box>
          <Text>
            <Text color={COLORS.textMuted}>Progression: </Text>
            <Text color={COLORS.cyan}>[{barFilled}{barEmpty}] </Text>
            <Text color={COLORS.text} bold>
              {completed}/{total} ({percent}%)
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
