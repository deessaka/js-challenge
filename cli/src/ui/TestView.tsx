import React from 'react'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import type { Challenge, Submission } from '../types.js'
import { shortcutHints } from './shortcut_catalog.js'
import { COLORS } from './theme.js'

interface TestViewProps {
  exerciseTitle: string
  isTesting: boolean
  isDryRun: boolean
  submission: Submission | null
  error: string | null
  executionTimeMs: number | null
  nextExercise?: Challenge | null
  allExercisesCompleted?: boolean
}

export const TestView: React.FC<TestViewProps> = ({
  exerciseTitle,
  isTesting,
  isDryRun,
  submission,
  error,
  executionTimeMs,
  nextExercise = null,
  allExercisesCompleted = false,
}) => {
  const isPassed = submission?.status === 'passed' && submission.accepted
  const totalTests = submission?.results?.length || 0
  const passedTests = submission?.results?.filter((r) => r.passed).length || 0
  const failedResults = submission?.results?.filter((r) => !r.passed) ?? []

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
    (submission?.results?.find((r) => !r.passed && r.error?.includes('is not defined'))?.error ??
      null)

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={borderColor}
      paddingX={1}
      paddingY={0}
    >
      {/* Header */}
      <Box justifyContent="space-between" marginBottom={1}>
        <Box>
          <Text>
            <Text color={isDryRun ? COLORS.cyan : COLORS.primary} bold>
              {isDryRun ? '🐛 CONSOLE DE DÉBOGAGE & LOGS' : '🏆 VALIDATION OFFICIELLE'}
            </Text>
            <Text color={COLORS.textMuted}> │ {exerciseTitle}</Text>
          </Text>
        </Box>

        <Box>
          <Text>
            {executionTimeMs !== null && <Text color={COLORS.textDim}>({executionTimeMs}ms)</Text>}
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
                    <Text color={COLORS.cyan} bold>
                      console.log(...)
                    </Text>
                    <Text color={COLORS.textMuted}>
                      {' '}
                      dans votre fonction pour inspecter vos variables ici.
                    </Text>
                  </Text>
                </Box>
              )}
            </Box>
          ) : (
            /* ================= MODE VALIDATION OFFICIELLE (isDryRun === false) ================= */
            <Box flexDirection="column">
              {/* Status banner */}
              <Box marginBottom={1} flexDirection="column">
                {isPassed ? (
                  <Box flexDirection="column">
                    <Text color={COLORS.success} bold>
                      🎉 VALIDÉ AVEC SUCCÈS ! TOUS LES TESTS SONT RÉUSSIS ({passedTests}/
                      {totalTests})
                    </Text>
                    {nextExercise ? (
                      <Text color={COLORS.cyan}>
                        🔓 Exercice suivant débloqué : {nextExercise.number}. {nextExercise.title}
                      </Text>
                    ) : allExercisesCompleted ? (
                      <Text color={COLORS.success}>
                        🏁 Tu as terminé tous les exercices disponibles pour le moment.
                      </Text>
                    ) : null}
                  </Box>
                ) : (
                  <Box>
                    <Text color={COLORS.error} bold>
                      ✗ {totalTests - passedTests}/{totalTests} TESTS ONT ÉCHOUÉ
                    </Text>
                  </Box>
                )}
              </Box>

              {/* Only failing assertions matter here — a green pass list just
                  buries the success banner and the next-exercise prompt. */}
              {!isPassed && failedResults.length > 0 && (
                <Box flexDirection="column" marginBottom={1}>
                  <Text color={COLORS.secondary} bold>
                    🧪 ASSERTIONS EN ÉCHEC :
                  </Text>
                  {failedResults.map((res, i) => (
                    <Box key={i} flexDirection="column" marginTop={i > 0 ? 1 : 0}>
                      <Box>
                        <Text>
                          <Text color={COLORS.error} bold>
                            {'  ✗ FAIL '}
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

          {isDryRun && submission.results && submission.results.length > 0 && (
            <Box flexDirection="column" marginBottom={1}>
              <Text color={COLORS.secondary} bold>
                🧪 ASSERTIONS DE TEST :
              </Text>
              {submission.results.map((result, index) => (
                <Box key={index} flexDirection="column" marginTop={index > 0 ? 1 : 0}>
                  <Text>
                    <Text color={result.passed ? COLORS.success : COLORS.error} bold>
                      {result.passed ? '  ✓ PASS ' : '  ✗ FAIL '}
                    </Text>
                    <Text color={COLORS.text}>{result.description}</Text>
                  </Text>
                  {result.error && (
                    <Box
                      marginLeft={4}
                      borderStyle="single"
                      borderColor={COLORS.error}
                      paddingX={1}
                    >
                      <Text color={COLORS.error}>{result.error}</Text>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Action shortcuts */}
      <Box
        borderStyle="single"
        borderColor={COLORS.border}
        paddingX={1}
        justifyContent="space-between"
        marginTop={1}
      >
        <Text color={COLORS.textMuted}>
          {isPassed && !isDryRun
            ? shortcutHints(
                nextExercise
                  ? ['tests-next', 'view-catalog', 'view-editor', 'back']
                  : ['view-catalog', 'view-editor', 'back']
              )
            : shortcutHints(['view-editor', 'back'])}
        </Text>
        <Text color={COLORS.textDim}>Prêt</Text>
      </Box>
    </Box>
  )
}
