import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Box, useApp, Text } from 'ink'
import { access, readFile, writeFile } from 'node:fs/promises'
import { watch, type FSWatcher } from 'node:fs'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

import { ApiClient } from '../api_client.js'
import { ConfigStore, DEFAULT_API_URL } from '../config_store.js'
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
import { useTerminalInput } from './use_terminal_input.js'

interface AppProps {
  apiBaseUrl?: string
}

export const App: React.FC<AppProps> = ({ apiBaseUrl = DEFAULT_API_URL }) => {
  const { exit } = useApp()
  const [store] = useState(() => new ConfigStore(process.env))
  const [api, setApi] = useState(() => new ApiClient(apiBaseUrl, () => store.read().then((c) => c.token)))

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
  const [isWatching, setIsWatching] = useState(false)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [testError, setTestError] = useState<string | null>(null)
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null)

  const watcherRef = useRef<FSWatcher | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const exerciseCodeRequestRef = useRef(new LatestExerciseCodeRequest())

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

  const currentChallenge = getSelectedExercise(terminalState, challenges)

  // Prepare challenge code from local file or infer starter code
  const prepareChallengeFile = useCallback(
    async (challenge: Challenge): Promise<{ filePath: string; code: string }> => {
      const fullChallenge = await api.getChallenge(challenge.slug)
      const filePath = resolve(`${challenge.slug}.js`)
      let starter = inferStarterCode(fullChallenge)

      try {
        await access(filePath)
        const existing = await readFile(filePath, 'utf8')
        if (
          existing.trim() &&
          existing.trim() !== "console.log('Hello');" &&
          existing.trim() !== "console.log('Hello')"
        ) {
          return { filePath, code: existing }
        }
      } catch {
        // file does not exist
      }

      await writeFile(filePath, starter, { encoding: 'utf8' })
      return { filePath, code: starter }
    },
    [api]
  )

  // Sync editor code whenever challenge changes
  useEffect(() => {
    if (currentChallenge) {
      setEditorCode('')
      setLoadedExerciseId(null)
      setEditorLoadError(null)
      void exerciseCodeRequestRef.current
        .load(
          currentChallenge,
          async (challenge) => (await prepareChallengeFile(challenge)).code,
          (code) => {
            setEditorCode(code)
            setLoadedExerciseId(currentChallenge.id)
          },
          (error) => {
            setEditorLoadError(error instanceof Error ? error.message : String(error))
          }
        )
    } else {
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
      const filePath = resolve(`${currentChallenge.slug}.js`)
      await writeFile(filePath, newCode, { encoding: 'utf8' })
    },
    [currentChallenge]
  )

  // Run Test Locally (Dry-run)
  const runTestLocally = useCallback(
    async (challenge: Challenge, codeOverride?: string) => {
      const codeToRun = codeOverride ?? editorCode
      const filePath = resolve(`${challenge.slug}.js`)
      await writeFile(filePath, codeToRun, { encoding: 'utf8' })

      setIsTesting(true)
      setIsDryRun(true)
      setTestError(null)
      setSubmission(null)
      dispatchTerminalEvent({ type: 'select-view', view: 'tests' })

      const start = Date.now()
      try {
        const sub = await api.createSubmission({
          challengeId: challenge.id,
          code: codeToRun,
          dryRun: true,
        })
        setExecutionTimeMs(Date.now() - start)
        setSubmission(sub)
      } catch (err) {
        setTestError(err instanceof Error ? err.message : String(err))
      } finally {
        setIsTesting(false)
      }
    },
    [api, dispatchTerminalEvent, editorCode]
  )

  // Submit Solution Officially
  const submitSolution = useCallback(
    async (challenge: Challenge, codeOverride?: string) => {
      const codeToRun = codeOverride ?? editorCode
      const filePath = resolve(`${challenge.slug}.js`)
      await writeFile(filePath, codeToRun, { encoding: 'utf8' })

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
    [api, dispatchTerminalEvent, editorCode, replaceChallenges]
  )

  // Watch Mode Setup
  useEffect(() => {
    if (!isWatching || !currentChallenge) {
      if (watcherRef.current) {
        watcherRef.current.close()
        watcherRef.current = null
      }
      return
    }

    const filePath = resolve(`${currentChallenge.slug}.js`)

    const startWatching = async () => {
      await prepareChallengeFile(currentChallenge)
      try {
        const watcher = watch(filePath, async () => {
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
          debounceTimerRef.current = setTimeout(async () => {
            try {
              const updated = await readFile(filePath, 'utf8')
              setEditorCode(updated)
              runTestLocally(currentChallenge, updated)
            } catch {
              // fallback
            }
          }, 200)
        })
        watcherRef.current = watcher
      } catch {
        // watch fallback
      }
    }

    startWatching()

    return () => {
      if (watcherRef.current) {
        watcherRef.current.close()
        watcherRef.current = null
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [isWatching, currentChallenge, prepareChallengeFile, runTestLocally])

  useTerminalInput({
    state: terminalState,
    isAuthenticating,
    editorOwnsInput: editorIsReady,
    selectedExercise: currentChallenge,
    dispatch: dispatchTerminalEvent,
    exit,
    runTest: runTestLocally,
    submit: submitSolution,
    toggleWatch: () => setIsWatching((watching) => !watching),
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

      {terminalState.activeView === 'instructions' && <ChallengeDetails challenge={currentChallenge} />}

      {terminalState.activeView === 'editor' && currentChallenge && editorIsReady && (
        <CodeEditorView
          challenge={currentChallenge}
          initialCode={editorCode}
          onSaveCode={handleSaveCode}
          onTestLocally={(code) => runTestLocally(currentChallenge, code)}
          onSubmitSolution={(code) => submitSolution(currentChallenge, code)}
          onBack={() => dispatchTerminalEvent({ type: 'back' })}
        />
      )}

      {terminalState.activeView === 'editor' && currentChallenge && !editorIsReady && (
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
          challengeTitle={currentChallenge?.title || 'Défi'}
          isTesting={isTesting}
          isDryRun={isDryRun}
          isWatching={isWatching}
          submission={submission}
          error={testError}
          executionTimeMs={executionTimeMs}
        />
      )}

      {terminalState.activeView === 'help' && <HelpView />}
    </Box>
  )
}
