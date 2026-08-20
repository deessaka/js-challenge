import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'

import { COLORS } from './theme.js'

interface RecoveryPromptProps {
  challengeTitle: string
  mainCode: string
  recoveryCode: string
  onRestore: () => Promise<void>
  onIgnore: () => Promise<void>
}

export const RecoveryPrompt: React.FC<RecoveryPromptProps> = ({
  challengeTitle,
  mainCode,
  recoveryCode,
  onRestore,
  onIgnore,
}) => {
  const [isInspecting, setIsInspecting] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolve = async (decision: 'restore' | 'ignore') => {
    setIsResolving(true)
    setError(null)
    try {
      await (decision === 'restore' ? onRestore() : onIgnore())
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught))
      setIsResolving(false)
    }
  }

  useInput((input) => {
    if (isResolving) return
    if (input === 'r') void resolve('restore')
    if (input === 'v') setIsInspecting((value) => !value)
    if (input === 'i') void resolve('ignore')
  })

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={COLORS.warning} paddingX={1}>
      <Text color={COLORS.warning} bold>
        Récupération plus récente détectée — {challengeTitle}
      </Text>
      <Text>Le fichier principal n’a pas été modifié.</Text>

      {isInspecting && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={COLORS.textMuted}>Fichier principal :</Text>
          <Text>{preview(mainCode)}</Text>
          <Text color={COLORS.textMuted}>Récupération :</Text>
          <Text>{preview(recoveryCode)}</Text>
        </Box>
      )}

      {error && <Text color={COLORS.error}>Impossible d’appliquer ce choix : {error}</Text>}
      <Text color={COLORS.primary}>
        {isResolving ? 'Traitement…' : '[R] Restaurer  [V] Inspecter  [I] Ignorer'}
      </Text>
    </Box>
  )
}

function preview(code: string): string {
  const lines = code.split('\n').slice(0, 8)
  const suffix = code.split('\n').length > lines.length ? '\n…' : ''
  return `${lines.join('\n')}${suffix}` || '(vide)'
}
