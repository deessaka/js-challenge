import React from 'react'
import { Box, Text } from 'ink'
import { COLORS } from './theme.js'

export const HelpView: React.FC = () => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor={COLORS.secondary} paddingX={1} paddingY={0}>
      <Box justifyContent="center" marginBottom={1}>
        <Text color={COLORS.secondary} bold>
          💡 GUIDE DES RACCOURCIS & FLUX DE TRAVAIL
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.primary} bold>
          ■ NAVIGATION & SÉLECTION
        </Text>
        <Text color={COLORS.text}>  ↑ / ↓ ou j / k   : Parcourir la liste des exercices</Text>
        <Text color={COLORS.text}>  / ou Ctrl+F       : Lancer une recherche instantanée</Text>
        <Text color={COLORS.text}>  f                 : Filtrer (Tous / Disponibles / Terminés / Verrouillés)</Text>
        <Text color={COLORS.text}>  Entrée            : Ouvrir l'exercice sélectionné</Text>
        <Text color={COLORS.text}>  1 / 2 / 3         : Basculer rapidement d'onglet</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.cyan} bold>
          ■ ÉDITION & DÉVELOPPEMENT
        </Text>
        <Text color={COLORS.text}>  e                 : Ouvrir directement dans votre éditeur ($EDITOR / Neovim)</Text>
        <Text color={COLORS.text}>  t                 : Lancer la vérification locale en console (dry-run)</Text>
        <Text color={COLORS.text}>  s                 : Soumettre et valider officiellement la solution</Text>
        <Text color={COLORS.text}>  w                 : Activer/Désactiver le Watch Mode automatique</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.warning} bold>
          ■ FLUX AUTOMATIQUE (WATCH MODE)
        </Text>
        <Text color={COLORS.text}>
          En activant le Watch Mode ([w]), le CLI surveille le fichier sur votre disque et relance
          instantanément les tests chaque fois que vous sauvegardez (`:w`) dans Neovim ou VS Code !
        </Text>
      </Box>

      <Box borderStyle="single" borderColor={COLORS.border} paddingX={1} justifyContent="space-between">
        <Text color={COLORS.textMuted}>[Échap / 1] Revenir à la liste des défis</Text>
      </Box>
    </Box>
  )
}
