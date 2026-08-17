import React, { useState } from 'react'
import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'
import Spinner from 'ink-spinner'
import { COLORS } from './theme.js'

interface LoginViewProps {
  tokenUrl: string
  onSubmit: (token: string) => Promise<void>
  errorMessage: string | null
}

export const LoginView: React.FC<LoginViewProps> = ({ tokenUrl, onSubmit, errorMessage }) => {
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(errorMessage)

  const handleSubmit = async (val: string) => {
    const trimmed = val.trim()
    if (!trimmed) {
      setLocalError('Le token API ne peut pas être vide.')
      return
    }
    setIsLoading(true)
    setLocalError(null)
    try {
      await onSubmit(trimmed)
    } catch (err) {
      setIsLoading(false)
      setLocalError(err instanceof Error ? err.message : 'Échec de connexion')
    }
  }

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={COLORS.primary} padding={1} width={68}>
      <Box justifyContent="center" marginBottom={1}>
        <Text color={COLORS.primary} bold>
          ⚡ CONNEXION TERMINAL JS CHALLENGE
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.cyan} bold>
          Obtenir votre token en 3 étapes :
        </Text>
        <Text color={COLORS.text}>1. Ouvrez votre profil dans le navigateur.</Text>
        <Text color={COLORS.text}>2. Cliquez sur « Générer un token CLI ».</Text>
        <Text color={COLORS.text}>3. Collez votre token ci-dessous.</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color={COLORS.primary} underline>
          {tokenUrl}
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.textMuted}>Collez votre token API :</Text>
        <Box borderStyle="single" borderColor={COLORS.borderFocus} paddingX={1}>
          <TextInput
            value={token}
            onChange={setToken}
            onSubmit={handleSubmit}
            mask="*"
            placeholder="oat_MQ.xxxx..."
          />
        </Box>
      </Box>

      {isLoading && (
        <Box marginBottom={1}>
          <Text color={COLORS.warning}>
            <Spinner type="dots" /> Authentification en cours...
          </Text>
        </Box>
      )}

      {localError && !isLoading && (
        <Box marginBottom={1}>
          <Text color={COLORS.error} bold>
            ✗ {localError}
          </Text>
        </Box>
      )}

      <Box justifyContent="space-between" borderStyle="single" borderColor={COLORS.border} paddingX={1}>
        <Text color={COLORS.textMuted}>[Entrée] Valider │ [Ctrl+C] Quitter</Text>
      </Box>
    </Box>
  )
}
