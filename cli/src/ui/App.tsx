import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Box, useInput, useApp, Text } from 'ink'
import { access, readFile, writeFile } from 'node:fs/promises'
import { watch, type FSWatcher } from 'node:fs'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'

import { ApiClient } from '../api_client.js'
import { ConfigStore } from '../config_store.js'
import type { Challenge, Submission, User } from '../types.js'
import { Header } from './Header.js'
import { ChallengeList } from './ChallengeList.js'
import { ChallengeDetails } from './ChallengeDetails.js'
import { TestView } from './TestView.js'
import { HelpView } from './HelpView.js'
import { LoginView } from './LoginView.js'
import { inferStarterCode } from './theme.js'

interface AppProps {
  apiBaseUrl?: string
}

export const App: React.FC<AppProps> = ({ apiBaseUrl = 'http://localhost:3333' }) => {
  const { exit } = useApp()
  const [store] = useState(() => new ConfigStore(process.env))
  const [api, setApi] = useState(() => new ApiClient(apiBaseUrl, () => store.read().then((c) => c.token)))

  const [user, setUser] = useState<User | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [filterMode, setFilterMode] = useState<'all' | 'unlocked' | 'completed' | 'locked'>('all')
  const [activeTab, setActiveTab] = useState<'list' | 'details' | 'test' | 'help'>('list')

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const [isTesting, setIsTesting] = useState(false)
  const [isDryRun, setIsDryRun] = useState(true)
  const [isWatching, setIsWatching] = useState(false)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [testError, setTestError] = useState<string | null>(null)
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null)

  const watcherRef = useRef<FSWatcher | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

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

      const res = await client.listChallenges(1, 200)
      setChallenges(res.data)
      setIsAuthenticating(false)
    } catch (err) {
      setIsAuthenticating(true)
      setLoginError(err instanceof Error ? err.message : 'Erreur d’authentification')
    }
  }, [apiBaseUrl, store])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Get current selected challenge
  const currentChallenge = challenges[selectedIndex] || null

  // Helper to ensure challenge solution file exists on disk
  const prepareChallengeFile = useCallback(async (challenge: Challenge): Promise<string> => {
    const fullChallenge = await api.getChallenge(challenge.slug)
    const filePath = resolve(`${challenge.slug}.js`)
    let starter = inferStarterCode(fullChallenge)

    try {
      await access(filePath)
      const existing = await readFile(filePath, 'utf8')
      if (!existing.trim()) {
        await writeFile(filePath, starter, { encoding: 'utf8' })
      }
    } catch {
      await writeFile(filePath, starter, { encoding: 'utf8' })
    }

    return filePath
  }, [api])

  // Open in $EDITOR
  const openInEditor = useCallback(async (challenge: Challenge) => {
    const filePath = await prepareChallengeFile(challenge)
    const editorCmd = process.env.VISUAL || process.env.EDITOR || 'nvim'

    const child = spawn(editorCmd, [filePath], {
      stdio: 'inherit',
      shell: true,
    })

    child.on('exit', () => {
      // Re-trigger test or focus
    })
  }, [prepareChallengeFile])

  // Run Test Locally (Dry-run)
  const runTestLocally = useCallback(async (challenge: Challenge) => {
    const filePath = await prepareChallengeFile(challenge)
    const code = await readFile(filePath, 'utf8')

    setIsTesting(true)
    setIsDryRun(true)
    setTestError(null)
    setSubmission(null)
    setActiveTab('test')

    const start = Date.now()
    try {
      const sub = await api.createSubmission({
        challengeId: challenge.id,
        code,
        dryRun: true,
      })
      setExecutionTimeMs(Date.now() - start)
      setSubmission(sub)
    } catch (err) {
      setTestError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsTesting(false)
    }
  }, [api, prepareChallengeFile])

  // Submit Solution Officially
  const submitSolution = useCallback(async (challenge: Challenge) => {
    const filePath = await prepareChallengeFile(challenge)
    const code = await readFile(filePath, 'utf8')

    setIsTesting(true)
    setIsDryRun(false)
    setTestError(null)
    setSubmission(null)
    setActiveTab('test')

    const start = Date.now()
    try {
      const sub = await api.createSubmission({
        challengeId: challenge.id,
        code,
        idempotencyKey: randomUUID(),
        dryRun: false,
      })
      setExecutionTimeMs(Date.now() - start)
      setSubmission(sub)

      if (sub.accepted) {
        // Refresh challenges and user points
        const me = await api.getMe()
        setUser(me)
        const res = await api.listChallenges(1, 200)
        setChallenges(res.data)
      }
    } catch (err) {
      setTestError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsTesting(false)
    }
  }, [api, prepareChallengeFile])

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
        const watcher = watch(filePath, () => {
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
          debounceTimerRef.current = setTimeout(() => {
            runTestLocally(currentChallenge)
          }, 200)
        })
        watcherRef.current = watcher
      } catch {
        // file watch fallback
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

  // Keyboard Input Dispatcher
  useInput((input, key) => {
    if (isAuthenticating) return

    // Global Quit
    if (key.ctrl && (input === 'c' || input === 'q')) {
      exit()
      return
    }

    // Search query mode
    if (isSearching) {
      if (key.return || key.escape) {
        setIsSearching(false)
        return
      }
      if (key.backspace || key.delete) {
        setSearchQuery((prev) => prev.slice(0, -1))
        return
      }
      if (input) {
        setSearchQuery((prev) => prev + input)
        return
      }
    }

    // Search Trigger
    if (input === '/' && activeTab === 'list') {
      setIsSearching(true)
      return
    }

    // Tab Switching
    if (input === '1') {
      setActiveTab('list')
      return
    }
    if (input === '2') {
      setActiveTab('details')
      return
    }
    if (input === '3') {
      setActiveTab('test')
      return
    }
    if (input === '?' || input === '\x1bOP') {
      setActiveTab((prev) => (prev === 'help' ? 'list' : 'help'))
      return
    }

    // Filter toggle
    if (input === 'f' && activeTab === 'list') {
      setFilterMode((prev) => {
        if (prev === 'all') return 'unlocked'
        if (prev === 'unlocked') return 'completed'
        if (prev === 'completed') return 'locked'
        return 'all'
      })
      return
    }

    // List Navigation
    if (activeTab === 'list') {
      if (key.upArrow || input === 'k') {
        setSelectedIndex((prev) => Math.max(0, prev - 1))
        return
      }
      if (key.downArrow || input === 'j') {
        setSelectedIndex((prev) => Math.min(challenges.length - 1, prev + 1))
        return
      }
      if (key.return) {
        setActiveTab('details')
        return
      }
    }

    // Challenge Actions (when a challenge is selected)
    if (currentChallenge) {
      if (input === 'e') {
        openInEditor(currentChallenge)
        return
      }
      if (input === 't' || input === 'r') {
        runTestLocally(currentChallenge)
        return
      }
      if (input === 's') {
        submitSolution(currentChallenge)
        return
      }
      if (input === 'w') {
        setIsWatching((prev) => !prev)
        setActiveTab('test')
        return
      }
    }

    // Escape returns to list
    if (key.escape) {
      if (activeTab !== 'list') {
        setActiveTab('list')
      } else if (searchQuery) {
        setSearchQuery('')
      }
      return
    }
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
      <Header user={user} challenges={challenges} activeTab={activeTab} />

      {activeTab === 'list' && (
        <ChallengeList
          challenges={challenges}
          selectedIndex={selectedIndex}
          searchQuery={searchQuery}
          filterMode={filterMode}
        />
      )}

      {activeTab === 'details' && <ChallengeDetails challenge={currentChallenge} />}

      {activeTab === 'test' && (
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

      {activeTab === 'help' && <HelpView />}
    </Box>
  )
}
