import React from 'react'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import type { Submission } from '../types.js'
import { COLORS } from './theme.js'

interface TestViewProps {
  challengeTitle: string
  isTesting: boolean
  isDryRun: boolean
  isWatching: boolean
  submission: Submission | null
  error: string | null
  executionTimeMs: number | null
}

export const TestView: React.FC<TestViewProps> = ({
  challengeTitle,
  isTesting,
  isDryRun,
  isWatching,
  submission,
  error,
  executionTimeMs,
}) => {
  const isPassed = submission?.status === 'passed' && submission.accepted
  const totalTests = submission?.results?.length || 0
  const passedTests = submission?.results?.filter((r) => r.passed).length || 0

  const borderColor = isTesting
    ? COLORS.primary
    : error || (submission && !isPassed)
      ? COLORS.error
      : isPassed
        ? COLORS.success
        : COLORS.border

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={borderColor} paddingX={1} paddingY={0}>
      {/* Header */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Box>
          <Text>
            <Text color={COLORS.primary} bold>
              🧪 {isDryRun ? 'VÉRIFICATION LOCALE (CONSOLE)' : 'SOUMISSION OFFICIELLE'}
            </Text>
            <Text color={COLORS.textMuted}> │ {challengeTitle}</Text>
          </Text>
        </Box>

        <Box>
          <Text>
            {isWatching && (
              <Text color={COLORS.warning} bold>
                ⚡ WATCH MODE ACTIF{' '}
              </Text>
            )}
            {executionTimeMs !== null && (
              <Text color={COLORS.textDim}>({executionTimeMs}ms)</Text>
            )}
          </Text>
        </Box>
      </Box>

      {/* Loading state */}
      {isTesting && (
        <Box paddingY={1} justifyContent="center">
          <Text color={COLORS.cyan}>
            <Spinner type="dots" /> Exécution des tests dans le bac à sable sécurisé...
          </Text>
        </Box>
      )}

      {/* Error state */}
      {error && !isTesting && (
        <Box flexDirection="column" paddingY={1}>
          <Text color={COLORS.error} bold>
            ✗ ERREUR D'EXÉCUTION :
          </Text>
          <Text color={COLORS.error}>{error}</Text>
        </Box>
      )}

      {/* Results state */}
      {submission && !isTesting && (
        <Box flexDirection="column">
          {/* Status banner */}
          <Box marginBottom={1}>
            {isPassed ? (
              <Box>
                <Text color={COLORS.success} bold>
                  {isDryRun
                    ? `✓ TOUS LES TESTS SONT RÉUSSIS (${passedTests}/${totalTests})`
                    : `🎉 VALIDÉ AVEC SUCCÈS !`}
                </Text>
              </Box>
            ) : (
              <Box>
                <Text color={COLORS.error} bold>
                  ✗ {totalTests - passedTests}/{totalTests} TESTS ONT ÉCHOUÉ
                </Text>
              </Box>
            )}
          </Box>

          {/* Test cases list */}
          {submission.results && submission.results.length > 0 && (
            <Box flexDirection="column" marginBottom={1}>
              {submission.results.map((res, i) => (
                <Box key={i} flexDirection="column" marginTop={i > 0 ? 1 : 0}>
                  <Box>
                    <Text>
                      <Text color={res.passed ? COLORS.success : COLORS.error} bold>
                        {res.passed ? '  ✓ PASS ' : '  ✗ FAIL '}
                      </Text>
                      <Text color={COLORS.text}>{res.description}</Text>
                    </Text>
                  </Box>

                  {res.error && (
                    <Box
                      marginLeft={4}
                      marginTop={0}
                      borderStyle="single"
                      borderColor={COLORS.error}
                      paddingX={1}
                    >
                      <Text color={COLORS.error}>{res.error}</Text>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Action shortcuts */}
      <Box borderStyle="single" borderColor={COLORS.border} paddingX={1} justifyContent="space-between" marginTop={1}>
        <Text color={COLORS.textMuted}>
          [t/r] Re-tester │ [s] Soumettre │ [w] {isWatching ? 'Désactiver Watch' : 'Activer Watch'} │ [e] Éditeur │ [Échap] Retour
        </Text>
        <Text color={COLORS.textDim}>
          {isWatching ? 'Auto-test à chaque sauvegarde' : 'Prêt'}
        </Text>
      </Box>
    </Box>
  )
}
