import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Box, useApp, Text } from 'ink'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

import { ApiClient } from '../api_client.js'
import { ConfigStore, DEFAULT_API_URL } from '../config_store.js'
import { EditorPersistence } from '../editor_persistence.js'
import type { Challenge, Submission, User } from '../types.js'
import { Header } from './Header.js'
import { ChallengeList } from './ChallengeList.js'
import { ChallengeDetails } from './ChallengeDetails.js'
import { CodeEditorView } from './CodeEditorView.js'
import { TestView } from './TestView.js'
import { HelpView } from './HelpView.js'
import { LoginView } from './LoginView.js'
import { COLORS, inferStarterCode } from './theme.js'
import {
  createTerminalViewState,
  getSelectedExercise,
  reduceTerminalViewState,
  type TerminalViewEvent,
} from './terminal_view_state.js'
import { LatestExerciseCodeRequest } from './exercise_code_request.js'
import { LatestDryRun, createEditorFeedbackState, reduceEditorFeedback } from './editor_feedback.js'
import { shortcutKeys } from './shortcut_catalog.js'
import { useTerminalInput } from './use_terminal_input.js'

interface AppProps {
  apiBaseUrl?: string
  initialSlug?: string
}

interface EditorSession {
  exerciseId: string
  code: string
  
  persistence: EditorPersistence
}

export const App: React.FC<AppProps> = ({ apiBaseUrl = DEFAULT_API_URL, initialSlug }) => {
  const { exit } = useApp()
  const [store] = useState(() => new ConfigStore(process.env))
  const [api, setApi] = useState(
    () => new ApiClient(apiBaseUrl, () => store.read().then((c) => c.token))
  )

  const [user, setUser] = useState<User | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [terminalState, setTerminalState] = useState(() => createTerminalViewState())

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const [editorCode, setEditorCode] = useState('')
  const [loadedExerciseId, setLoadedExerciseId] = useState<string | null>(null)
  const [editorLoadError, setEditorLoadError] = useState<string | null>(null)
  const [isTesting, setIsTesting] = useState(false)
  const [isDryRun, setIsDryRun] = useState(true)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [testError, setTestError] = useState<string | null>(null)
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null)
  const [editorFeedback, setEditorFeedback] = useState(() => createEditorFeedbackState())

  const exerciseCodeRequestRef = useRef(new LatestExerciseCodeRequest())
  const persistenceByExerciseRef = useRef(new Map<string, EditorPersistence>())
  const latestDryRunRef = useRef(new LatestDryRun())

  const dispatchTerminalEvent = useCallback(
    (event: TerminalViewEvent) => {
      setTerminalState((state) => reduceTerminalViewState(state, event, challenges))
    },
    [challenges]
  )

  const replaceChallenges = useCallback((nextChallenges: Challenge[]) => {
    setChallenges(nextChallenges)
    setTerminalState((state) =>
      reduceTerminalViewState(state, { type: 'catalog-updated' }, nextChallenges)
    )
  }, [])

  // Load Initial Data
  const loadData = useCallback(async () => {
    try {
      const config = await store.read()
      if (!config.token) {
        setIsAuthenticating(true)
        return
      }

      const client = new ApiClient(apiBaseUrl, () => Promise.resolve(config.token))
      setApi(client)

      const me = await client.getMe()
      setUser(me)

      const res = await client.listAllChallenges()
      replaceChallenges(res.data)
      setIsAuthenticating(false)
    } catch (err) {
      setIsAuthenticating(true)
      setLoginError(err instanceof Error ? err.message : 'Erreur d’authentification')
    }
  }, [apiBaseUrl, replaceChallenges, store])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (initialSlug && challenges.length > 0) {
      const challenge = challenges.find((c) => c.slug === initialSlug)
      if (challenge) {
        dispatchTerminalEvent({ type: 'select-exercise', exerciseId: challenge.id })
        dispatchTerminalEvent({ type: 'select-view', view: 'editor' })
      }
    }
  }, [initialSlug, challenges])

  const currentChallenge = getSelectedExercise(terminalState, challenges)

  // Prepare challenge code from local file or infer starter code
  const prepareChallengeFile = useCallback(
    async (challenge: Challenge): Promise<EditorSession> => {
      const fullChallenge = await api.getChallenge(challenge.slug)
      const starter = inferStarterCode(fullChallenge)
      const persistence = new EditorPersistence({
        slug: challenge.slug,
        legacyWorkspacePath: process.cwd(),
        legacyExerciseId: challenge.id,
      })
      persistenceByExerciseRef.current.set(challenge.id, persistence)
      const opened = await persistence.open(starter)
      const isPlaceholder =
        opened.code.trim() === "console.log('Hello');" ||
        opened.code.trim() === "console.log('Hello')"

      if (isPlaceholder) {
        await persistence.save(starter)
        return { exerciseId: challenge.id, code: starter, persistence }
      }

      return {
        exerciseId: challenge.id,
        code: opened.code,
        persistence,
      }
    },
    [api]
  )

  // Sync editor code whenever challenge changes
  useEffect(() => {
    if (currentChallenge) {
      latestDryRunRef.current.invalidate()
      setEditorFeedback(createEditorFeedbackState())
      setEditorCode('')
      setLoadedExerciseId(null)
      setEditorLoadError(null)
      void exerciseCodeRequestRef.current.load(
        currentChallenge,
        prepareChallengeFile,
        (session) => {
          setEditorCode(session.code)
          setLoadedExerciseId(session.exerciseId)
        },
        (error) => {
          setEditorLoadError(error instanceof Error ? error.message : String(error))
        }
      )
    } else {
      latestDryRunRef.current.invalidate()
      setEditorFeedback(createEditorFeedbackState())
      exerciseCodeRequestRef.current.cancel()
      setEditorCode('')
      setLoadedExerciseId(null)
      setEditorLoadError(null)
    }
  }, [currentChallenge, prepareChallengeFile])

  const editorIsReady = currentChallenge !== null && loadedExerciseId === currentChallenge.id

  // Save Code Handler
  const handleSaveCode = useCallback(
    async (newCode: string) => {
      if (!currentChallenge) return
      setEditorCode(newCode)
      const persistence =
        persistenceByExerciseRef.current.get(currentChallenge.id) ??
        (await prepareChallengeFile(currentChallenge)).persistence
      await persistence.save(newCode)
    },
    [currentChallenge, prepareChallengeFile]
  )

  const handleEditorCodeChange = useCallback((newCode: string) => {
    setEditorCode(newCode)
    setIsTesting(false)
    latestDryRunRef.current.invalidate()
    setEditorFeedback((state) => reduceEditorFeedback(state, { type: 'buffer-changed' }))
  }, [])

  // Run Test Locally (Dry-run)
  const runTestLocally = useCallback(
    async (challenge: Challenge, codeOverride?: string) => {
      const needsSession =
        !persistenceByExerciseRef.current.has(challenge.id) ||
        (codeOverride === undefined && loadedExerciseId !== challenge.id)
      const session = needsSession ? await prepareChallengeFile(challenge) : null
      const codeToRun =
        codeOverride ?? (loadedExerciseId === challenge.id ? editorCode : (session?.code ?? ''))

      setIsTesting(true)
      setIsDryRun(true)
      setTestError(null)
      setSubmission(null)
      setEditorFeedback((state) => reduceEditorFeedback(state, { type: 'dry-run-started' }))

      let applied = false
      try {
        const outcome = await latestDryRunRef.current.run(() =>
          api.createSubmission({
            challengeId: challenge.id,
            code: codeToRun,
            dryRun: true,
          })
        )
        if (!outcome) return
        applied = true
        setExecutionTimeMs(outcome.durationMs)
        setSubmission(outcome.submission)
        setEditorFeedback((state) =>
          reduceEditorFeedback(state, {
            type: 'dry-run-succeeded',
            submission: outcome.submission,
            durationMs: outcome.durationMs,
          })
        )
      } catch (err) {
        applied = true
        const message = err instanceof Error ? err.message : String(err)
        setTestError(message)
        setEditorFeedback((state) =>
          reduceEditorFeedback(state, { type: 'dry-run-failed', error: message })
        )
      } finally {
        if (applied) setIsTesting(false)
      }
    },
    [api, editorCode, loadedExerciseId, prepareChallengeFile]
  )

  // Submit Solution Officially
  const submitSolution = useCallback(
    async (challenge: Challenge, codeOverride?: string, isDurablySaved = false) => {
      const needsSession =
        !persistenceByExerciseRef.current.has(challenge.id) ||
        (codeOverride === undefined && loadedExerciseId !== challenge.id)
      const session = needsSession ? await prepareChallengeFile(challenge) : null
      const codeToRun =
        codeOverride ?? (loadedExerciseId === challenge.id ? editorCode : (session?.code ?? ''))
      const persistence = persistenceByExerciseRef.current.get(challenge.id) ?? session?.persistence

      if (!isDurablySaved) {
        try {
          if (!persistence) throw new Error('Stockage durable indisponible.')
          await persistence.save(codeToRun)
        } catch (err) {
          const message =
            `Soumission bloquée : la sauvegarde durable a échoué. ` +
            `${err instanceof Error ? err.message : String(err)} Réessayez avec ${shortcutKeys('editor-save')}.`
          setIsDryRun(false)
          setSubmission(null)
          setTestError(message)
          dispatchTerminalEvent({ type: 'select-view', view: 'tests' })
          return
        }
      }

      setIsTesting(true)
      setIsDryRun(false)
      setTestError(null)
      setSubmission(null)
      dispatchTerminalEvent({ type: 'select-view', view: 'tests' })

      const start = Date.now()
      try {
        const sub = await api.createSubmission({
          challengeId: challenge.id,
          code: codeToRun,
          idempotencyKey: randomUUID(),
          dryRun: false,
        })
        setExecutionTimeMs(Date.now() - start)
        setSubmission(sub)

        if (sub.accepted) {
          const me = await api.getMe()
          setUser(me)
          const res = await api.listAllChallenges()
          replaceChallenges(res.data)
        }
      } catch (err) {
        setTestError(err instanceof Error ? err.message : String(err))
      } finally {
        setIsTesting(false)
      }
    },
    [
      api,
      dispatchTerminalEvent,
      editorCode,
      loadedExerciseId,
      prepareChallengeFile,
      replaceChallenges,
    ]
  )

  useTerminalInput({
    state: terminalState,
    isAuthenticating,
    editorOwnsInput: editorIsReady,
    dispatch: dispatchTerminalEvent,
    exit,
  })

  // Handle Login submission
  const handleLogin = async (token: string) => {
    await store.save({ apiBaseUrl, token })
    await loadData()
  }

  if (isAuthenticating) {
    return (
      <Box justifyContent="center" alignItems="center" paddingY={2}>
        <LoginView
          tokenUrl={`${apiBaseUrl}/profile#api-token`}
          onSubmit={handleLogin}
          errorMessage={loginError}
        />
      </Box>
    )
  }

  return (
    <Box flexDirection="column" paddingX={1} paddingY={0}>
      <Header
        user={user}
        challenges={challenges}
        activeView={terminalState.activeView}
        apiBaseUrl={apiBaseUrl}
      />

      {terminalState.activeView === 'catalog' && (
        <ChallengeList
          exercises={challenges}
          selectedExerciseId={terminalState.selectedExerciseId}
          searchQuery={terminalState.searchQuery}
          filterMode={terminalState.filterMode}
        />
      )}

      {terminalState.activeView === 'instructions' && (
        <ChallengeDetails challenge={currentChallenge} />
      )}

      {terminalState.activeView === 'editor' && currentChallenge && editorIsReady && (
        <CodeEditorView
          challenge={currentChallenge}
          initialCode={editorCode}
          feedback={editorFeedback}
          onSaveCode={handleSaveCode}
          onCodeChange={handleEditorCodeChange}
          onTestLocally={(code) => runTestLocally(currentChallenge, code)}
          onSubmitSolution={(code) => submitSolution(currentChallenge, code, true)}
          onSelectView={(view) => dispatchTerminalEvent({ type: 'select-view', view })}
          onBack={() => dispatchTerminalEvent({ type: 'back' })}
        />
      )}

      {terminalState.activeView === 'editor' &&
        currentChallenge &&
        !editorIsReady && (
          <Box borderStyle="round" padding={1}>
            <Text color={editorLoadError ? COLORS.error : COLORS.cyan}>
              {editorLoadError
                ? `Impossible de charger la solution : ${editorLoadError}`
                : `Chargement de la solution pour ${currentChallenge.title}…`}
            </Text>
          </Box>
        )}

      {terminalState.activeView === 'tests' && (
        <TestView
          exerciseTitle={currentChallenge?.title || 'Exercice'}
          isTesting={isTesting}
          isDryRun={isDryRun}
          submission={submission}
          error={testError}
          executionTimeMs={executionTimeMs}
        />
      )}

      {terminalState.activeView === 'help' && <HelpView />}
    </Box>
  )
}
