import React from 'react'
import { Box, Text, useWindowSize } from 'ink'

import { HELP_SHORTCUT_GROUPS, TERMINAL_SHORTCUTS, shortcutHints } from './shortcut_catalog.js'
import { COLORS } from './theme.js'

const GROUP_COLORS = [COLORS.primary, COLORS.secondary, COLORS.cyan, COLORS.warning, COLORS.success]

export const HelpView: React.FC = () => {
  const { columns, rows } = useWindowSize()
  const isCompact = columns < 100 || rows < 46

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={COLORS.secondary}
      paddingX={1}
      paddingY={0}
    >
      <Box justifyContent="center" marginBottom={1}>
        <Text color={COLORS.secondary} bold>
          💡 AIDE DES VUES TERMINAL & DE L’ÉDITEUR INTÉGRÉ
        </Text>
      </Box>

      {HELP_SHORTCUT_GROUPS.map((group, groupIndex) => (
        <Box key={group.title} flexDirection="column" marginBottom={1}>
          <Text color={GROUP_COLORS[groupIndex % GROUP_COLORS.length]} bold>
            ■ {group.title}
          </Text>
          {isCompact ? (
            <Text color={COLORS.text}> {shortcutHints(group.shortcuts)}</Text>
          ) : (
            group.shortcuts.map((id) => {
              const shortcut = TERMINAL_SHORTCUTS[id]
              return (
                <Text key={id} color={COLORS.text}>
                  {' '}
                  {shortcut.keys} : {shortcut.description}
                </Text>
              )
            })
          )}
        </Box>
      ))}

      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.warning} bold>
          ■ SAISIE, WRAPPING & COLLAGE
        </Text>
        <Text color={COLORS.text}>
          {' '}
          Les lignes longues reviennent visuellement à la ligne, sans modifier la solution.
        </Text>
        <Text color={COLORS.text}>
          {' '}
          Le collage identifiable est désactivé et ne modifie ni le document ni son historique.
        </Text>
      </Box>

      <Box borderStyle="single" borderColor={COLORS.border} paddingX={1}>
        <Text color={COLORS.textMuted}>{shortcutHints(['view-catalog', 'back'])}</Text>
      </Box>
    </Box>
  )
}
