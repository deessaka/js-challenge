import React from 'react'
import { Box, Text, useWindowSize } from 'ink'
import type { User, Challenge } from '../types.js'
import { GLOBAL_VIEW_SHORTCUTS, type TerminalView } from './shortcut_catalog.js'
import { COLORS } from './theme.js'
import type { EnvironmentName } from '../environment.js'

interface HeaderProps {
  user: User | null
  challenges: Challenge[]
  activeView: TerminalView
  environment: EnvironmentName
}

function environmentStatus(environment: EnvironmentName): { label: string; color: string } {
  if (environment === 'production') return { label: 'PRODUCTION', color: COLORS.success }
  if (environment === 'development') return { label: 'DEVELOPMENT', color: COLORS.warning }
  return { label: 'STAGING', color: COLORS.warning }
}

export const Header: React.FC<HeaderProps> = ({ user, challenges, activeView, environment }) => {
  const { columns, rows } = useWindowSize()
  const total = challenges.length
  const completed = challenges.filter((c) => c.isCompleted).length
  const totalPoints = challenges.filter((c) => c.isCompleted).reduce((sum, c) => sum + c.points, 0)
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const progressBars = Math.round((percent / 100) * 16)
  const barFilled = '█'.repeat(progressBars)
  const barEmpty = '░'.repeat(16 - progressBars)
  const endpoint = environmentStatus(environment)
  const activeShortcut = GLOBAL_VIEW_SHORTCUTS.find((shortcut) => shortcut.view === activeView)

  if (columns < 80 || rows < 24) {
    return (
      <Box
        justifyContent="space-between"
        borderStyle="round"
        borderColor={COLORS.border}
        paddingX={1}
      >
        <Text color={COLORS.primary} bold>
          🥋 CODOJO
        </Text>
        <Text color={COLORS.textMuted}>
          [{activeShortcut?.keys}: {activeShortcut?.label}]
        </Text>
        <Text color={user ? COLORS.success : COLORS.warning}>
          {user ? `${user.username} · ${totalPoints} pts` : 'Déconnecté'}
        </Text>
      </Box>
    )
  }

  return (
    <Box flexDirection="column" marginBottom={1}>
      {/* Top Banner */}
      <Box
        justifyContent="space-between"
        borderStyle="round"
        borderColor={COLORS.border}
        paddingX={1}
      >
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

      <Box paddingX={1}>
        <Text color={endpoint.color}>● {endpoint.label}</Text>
      </Box>

      {/* Progress & Navigation Tabs */}
      <Box justifyContent="space-between" paddingX={1} marginTop={0}>
        <Box>
          <Text>
            {GLOBAL_VIEW_SHORTCUTS.map((shortcut, index) => (
              <React.Fragment key={shortcut.view}>
                {index > 0 && <Text> </Text>}
                <Text
                  color={activeView === shortcut.view ? COLORS.primary : COLORS.textMuted}
                  bold={activeView === shortcut.view}
                >
                  [{shortcut.keys}: {shortcut.label}]
                </Text>
              </React.Fragment>
            ))}
          </Text>
        </Box>

        <Box>
          <Text>
            <Text color={COLORS.textMuted}>Progression: </Text>
            <Text color={COLORS.cyan}>
              [{barFilled}
              {barEmpty}]{' '}
            </Text>
            <Text color={COLORS.text} bold>
              {completed}/{total} ({percent}%)
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
