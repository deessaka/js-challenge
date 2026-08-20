import React from 'react'
import { Box, Text } from 'ink'
import { COLORS } from './theme.js'
import { GLOBAL_VIEW_SHORTCUTS } from './terminal_view_state.js'

export const HelpView: React.FC = () => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor={COLORS.secondary} paddingX={1} paddingY={0}>
      <Box justifyContent="center" marginBottom={1}>
        <Text color={COLORS.secondary} bold>
          💡 GUIDE DES RACCOURCIS & ÉDITEUR INTÉGRÉ
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.primary} bold>
          ■ NAVIGATION & SÉLECTION
        </Text>
        <Text color={COLORS.text}>  ↑ / ↓ ou j / k   : Parcourir la liste des exercices</Text>
        <Text color={COLORS.text}>  / ou Ctrl+F       : Lancer une recherche instantanée</Text>
        <Text color={COLORS.text}>  f                 : Filtrer (Tous / Disponibles / Terminés / Verrouillés)</Text>
        <Text color={COLORS.text}>  Entrée            : Ouvrir les consignes puis l'éditeur</Text>
        <Text color={COLORS.text}>
          {'  '}
          {GLOBAL_VIEW_SHORTCUTS.map((shortcut) =>
            shortcut.input === '?' ? '?' : `Ctrl+${shortcut.input}`
          ).join(' / ')}{' '}
          : Basculer de vue terminal
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.cyan} bold>
          ■ ÉDITEUR DE CODE INTÉGRÉ (Onglet 3)
        </Text>
        <Text color={COLORS.text}>  Saisie directe    : Tapez votre code JavaScript (Tab = 2 espaces)</Text>
        <Text color={COLORS.text}>  Flèches ↑↓←→      : Déplacer le curseur dans l'éditeur</Text>
        <Text color={COLORS.text}>  Ctrl + T          : ▶ Lancer les tests locaux instantanés (dry-run)</Text>
        <Text color={COLORS.text}>  Ctrl + S          : ✓ Valider & soumettre officiellement</Text>
        <Text color={COLORS.text}>  Échap             : Revenir aux consignes ou à la liste</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.warning} bold>
          ■ MODE WATCH & ÉDITEUR EXTERNE OPTIONNEL
        </Text>
        <Text color={COLORS.text}>
          Si vous préférez coder dans un éditeur externe, activez le Watch Mode ([w]) : le CLI testera
          automatiquement vos modifications dès que vous enregistrez le fichier sur votre disque !
        </Text>
      </Box>

      <Box borderStyle="single" borderColor={COLORS.border} paddingX={1} justifyContent="space-between">
        <Text color={COLORS.textMuted}>[Échap / 1] Revenir à la liste des défis</Text>
      </Box>
    </Box>
  )
}
