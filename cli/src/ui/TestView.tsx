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
    : isDryRun
      ? COLORS.cyan
      : error || (submission && !isPassed)
        ? COLORS.error
        : isPassed
          ? COLORS.success
          : COLORS.border

  const runtimeError =
    error ||
    (submission?.status === 'error' ? submission.errorMessage : null) ||
    (submission?.results?.find((r) => !r.passed && r.error?.includes('is not defined'))?.error ?? null)

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={borderColor} paddingX={1} paddingY={0}>
      {/* Header */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Box>
          <Text>
            <Text color={isDryRun ? COLORS.cyan : COLORS.primary} bold>
              {isDryRun ? '🐛 CONSOLE DE DÉBOGAGE & LOGS' : '🏆 VALIDATION OFFICIELLE'}
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
            <Spinner type="dots" /> Exécution et capture des logs dans le bac à sable...
          </Text>
        </Box>
      )}

      {/* Runtime Exception state */}
      {runtimeError && !isTesting && (
        <Box
          flexDirection="column"
          borderStyle="single"
          borderColor={COLORS.error}
          paddingX={1}
          marginBottom={1}
        >
          <Text color={COLORS.error} bold>
            ✗ ERREUR D'EXÉCUTION JAVASCRIPT :
          </Text>
          <Text color={COLORS.error}>{runtimeError}</Text>
        </Box>
      )}

      {/* Results state */}
      {submission && !isTesting && (
        <Box flexDirection="column">
          {/* ================= MODE DÉBOGAGE (isDryRun === true) ================= */}
          {isDryRun ? (
            <Box flexDirection="column">
              {/* Console.log Output Section */}
              {submission.consoleLogs && submission.consoleLogs.length > 0 ? (
                <Box
                  flexDirection="column"
                  borderStyle="round"
                  borderColor={COLORS.cyan}
                  paddingX={1}
                  marginBottom={1}
                >
                  <Text color={COLORS.cyan} bold>
                    📜 SORTIE CONSOLE (console.log) :
                  </Text>
                  {submission.consoleLogs.map((logLine, idx) => (
                    <Box key={idx}>
                      <Text>
                        <Text color={COLORS.textDim}>[{idx + 1}] </Text>
                        <Text color={COLORS.warning}>{logLine}</Text>
                      </Text>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box borderStyle="single" borderColor={COLORS.border} paddingX={1} marginBottom={1}>
                  <Text>
                    <Text color={COLORS.textMuted}>💡 Aucun log émis. Ajoutez </Text>
                    <Text color={COLORS.cyan} bold>console.log(...)</Text>
                    <Text color={COLORS.textMuted}> dans votre fonction pour inspecter vos variables ici.</Text>
                  </Text>
                </Box>
              )}
            </Box>
          ) : (
            /* ================= MODE VALIDATION OFFICIELLE (isDryRun === false) ================= */
            <Box flexDirection="column">
              {/* Status banner */}
              <Box marginBottom={1}>
                {isPassed ? (
                  <Box>
                    <Text color={COLORS.success} bold>
                      🎉 VALIDÉ AVEC SUCCÈS ! TOUS LES TESTS SONT RÉUSSIS ({passedTests}/{totalTests})
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

              {/* Console logs if present during submission */}
              {submission.consoleLogs && submission.consoleLogs.length > 0 && (
                <Box
                  flexDirection="column"
                  borderStyle="round"
                  borderColor={COLORS.border}
                  paddingX={1}
                  marginBottom={1}
                >
                  <Text color={COLORS.cyan} bold>
                    📜 SORTIE CONSOLE :
                  </Text>
                  {submission.consoleLogs.map((logLine, idx) => (
                    <Box key={idx}>
                      <Text>
                        <Text color={COLORS.textDim}>[{idx + 1}] </Text>
                        <Text color={COLORS.warning}>{logLine}</Text>
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Test cases assertions list */}
              {submission.results && submission.results.length > 0 && (
                <Box flexDirection="column" marginBottom={1}>
                  <Text color={COLORS.secondary} bold>
                    🧪 ASSERTIONS DE TEST :
                  </Text>
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
        </Box>
      )}

      {/* Action shortcuts */}
      <Box borderStyle="single" borderColor={COLORS.border} paddingX={1} justifyContent="space-between" marginTop={1}>
        <Text color={COLORS.textMuted}>
          [t/r] Re-tester & Logs │ [Ctrl+S] 🏆 Valider & Soumettre │ [w] {isWatching ? 'Stop Watch' : 'Watch Mode'} │ [e/Échap] Éditeur
        </Text>
        <Text color={COLORS.textDim}>
          {isWatching ? 'Auto-débogage actif' : 'Prêt'}
        </Text>
      </Box>
    </Box>
  )
}
