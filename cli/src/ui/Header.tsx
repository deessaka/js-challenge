import React from 'react'
import { Box, Text, useWindowSize } from 'ink'
import type { User, Challenge } from '../types.js'
import { COLORS } from './theme.js'
import { GLOBAL_VIEW_SHORTCUTS, type TerminalView } from './terminal_view_state.js'

interface HeaderProps {
  user: User | null
  challenges: Challenge[]
  activeView: TerminalView
  apiBaseUrl: string
}

function apiStatus(apiBaseUrl: string): { label: string; color: string } {
  try {
    const url = new URL(apiBaseUrl)
    const isLive = url.protocol === 'https:' && url.hostname === 'codojo.ekodevs.com'
    return {
      label: `${isLive ? 'LIVE' : 'DEV'} · ${url.host}`,
      color: isLive ? COLORS.success : COLORS.warning,
    }
  } catch {
    return { label: `API · ${apiBaseUrl}`, color: COLORS.error }
  }
}

export const Header: React.FC<HeaderProps> = ({ user, challenges, activeView, apiBaseUrl }) => {
  const { columns, rows } = useWindowSize()
  const total = challenges.length
  const completed = challenges.filter((c) => c.isCompleted).length
  const totalPoints = challenges.filter((c) => c.isCompleted).reduce((sum, c) => sum + c.points, 0)
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const progressBars = Math.round((percent / 100) * 16)
  const barFilled = '█'.repeat(progressBars)
  const barEmpty = '░'.repeat(16 - progressBars)
  const endpoint = apiStatus(apiBaseUrl)
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
          [{activeShortcut?.input === '?' ? '?' : `Ctrl+${activeShortcut?.input}`}:{' '}
          {activeShortcut?.label}]
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
                  [{shortcut.input === '?' ? '?' : `Ctrl+${shortcut.input}`}: {shortcut.label}]
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
