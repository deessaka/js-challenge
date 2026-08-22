import React, { useState } from 'react'
import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'
import Spinner from 'ink-spinner'
import { shortcutHints } from './shortcut_catalog.js'
import { COLORS } from './theme.js'
import type { EnvironmentName } from '../environment.js'

interface LoginViewProps {
  environment: EnvironmentName
  browserOpened: boolean
  onSubmit: (token: string) => Promise<void>
  errorMessage: string | null
}

export const LoginView: React.FC<LoginViewProps> = ({
  environment,
  browserOpened,
  onSubmit,
  errorMessage,
}) => {
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
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={COLORS.primary}
      padding={1}
      width={68}
    >
      <Box justifyContent="center" marginBottom={1}>
        <Text color={COLORS.primary} bold>
          ⚡ CONNEXION CODOJO
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text color={COLORS.cyan} bold>
          Environnement : {environmentLabel(environment)}
        </Text>
        <Text color={COLORS.text}>
          1.{' '}
          {browserOpened
            ? 'Votre profil Codojo est ouvert dans le navigateur.'
            : 'Ouvrez votre profil Codojo dans le navigateur.'}
        </Text>
        <Text color={COLORS.text}>2. Cliquez sur « Générer un token CLI ».</Text>
        <Text color={COLORS.text}>3. Collez votre token ci-dessous.</Text>
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

      <Box
        justifyContent="space-between"
        borderStyle="single"
        borderColor={COLORS.border}
        paddingX={1}
      >
        <Text color={COLORS.textMuted}>{shortcutHints(['login-submit', 'login-quit'])}</Text>
      </Box>
    </Box>
  )
}

function environmentLabel(environment: EnvironmentName): string {
  return environment === 'production'
    ? 'production'
    : environment === 'development'
      ? 'développement'
      : 'staging'
}
