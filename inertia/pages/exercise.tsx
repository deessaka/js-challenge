import { router, usePage } from '@inertiajs/react'
import axios from 'axios'
import _ from 'lodash'
import { DateTime } from 'luxon'
import React, { Suspense, useCallback, useEffect, useState } from 'react'

import ExerciseLayout from '#components/layouts/exercise_layout'
import Loader from '#components/loader/loader'
import ResizePanelComponent from '#components/resize_panel/resize_panel'
import { Button } from '#components/ui/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { executeCode } from '~/lib/lib'

// Types
interface Exercise {
  id: number
  code?: { code: string }
  description: string
  title: string
  number: number
}

interface SyncResponse {
  timestamp: number
}

// Utility functions
const debounce = _.debounce

const useExerciseCode = (exercise: Exercise) => {
  const [editorCode, setEditorCode] = useState<string>(exercise.code?.code || '//enter your code')
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [lastSyncedTimestamp, setLastSyncedTimestamp] = useState<number>(DateTime.now().toMillis())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loadCode = useCallback(async () => {
    const solutionCode = localStorage.getItem(`exercise_${exercise?.id}_code`)
    if (solutionCode) {
      setEditorCode(solutionCode)
    }
  }, [exercise?.id])

  useEffect(() => {
    loadCode()
  }, [loadCode])

  useEffect(() => {
    const LSsolutionCode = localStorage.getItem(`exercise_${exercise.id}_code`)
    setEditorCode(LSsolutionCode || exercise.code?.code || '//enter your code')
    setIsLoading(false)
  }, [exercise.id, exercise.code?.code])

  const saveToCache = useCallback(
    (code: string) => {
      localStorage.setItem(`exercise_${exercise.id}_code`, code)
      setIsDirty(true)
    },
    [exercise.id, editorCode]
  )

  const debouncedSaveToCache = useCallback(debounce(saveToCache.bind(null, editorCode), 500), [
    saveToCache,
    editorCode,
  ])

  const syncWithServer = useCallback(
    async (code: string) => {
      try {
        const response = await axios.post<SyncResponse>(
          `/api/exercises/${exercise.id}/save-progress`,
          { code }
        )
        if (response.status === 200) {
          setIsDirty(false)
          setLastSyncedTimestamp(response.data.timestamp)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error syncing with server:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [exercise.id, editorCode]
  )

  // Save to cache when the editor code changes
  useEffect(() => {
    if (editorCode !== exercise.code?.code) {
      debouncedSaveToCache()
    }
  }, [editorCode, debouncedSaveToCache, exercise.code?.code])

  // Load progress from server
  useEffect(() => {
    const loadProcess = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`/api/exercises/${exercise.id}/load-progress`)
        if (response.status === 200) {
          setEditorCode(response.data.code)
          setLastSyncedTimestamp(response.data.timestamp)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading progress:', error)
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadProcess()
  }, [exercise.id])

  return {
    editorCode,
    setEditorCode,
    isDirty,
    setIsDirty,
    lastSyncedTimestamp,
    setLastSyncedTimestamp,
    isLoading,
    debouncedSaveToCache,
    syncWithServer,
  }
}

function Exercise() {
  const { exercise } = usePage<{ exercise: Exercise }>().props
  const {
    editorCode,
    setEditorCode,
    isDirty,
    setIsDirty,
    lastSyncedTimestamp,
    setLastSyncedTimestamp,
    isLoading,
  } = useExerciseCode(exercise)

  const [output, setOutput] = useState<string>('')

  const formatTestResults = (results: any) => {
    return results
      .map((result: any, index: number) => {
        const icon = result.passed ? '✅' : '❌'
        const status = result.passed ? 'PASS' : 'FAIL'

        return `
            ============================================
            Test ${index + 1}: ${result.passed ? 'BRAVO! VOUS AVEZ PASSÉ LE TEST!' : result.description}
            --------------------------------------------
            ${icon} Status: ${status}
            ${result.error ? `Error: ${result.error}\n` : ''}${result.expected ? `Expected: ${result.expected}\n` : ''}${result.received ? `Received: ${result.received}\n` : ''}============================================`
      })
      .join('\n')
  }

  const handleRunCode = async () => {
    try {
      const response = await executeCode('javascript', editorCode)
      setOutput(response.run.stdout)
      router.reload({ only: ['exercise'] })
    } catch (error) {
      console.error('Failed to execute code:', error)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await axios.post(
      `/api/exercises/${exercise.id}/execute`,
      {
        code: editorCode,
      },
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (response.status === 200) {
      const { success, results } = response.data
      setOutput(formatTestResults(results))
      if (success) {
        setIsDirty(false)
        setLastSyncedTimestamp(DateTime.now().toMillis())
        router.reload({ only: ['exercise'] })
      }
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="flex flex-col items-start justify-stretch gap-4 p-4">
        <Button onClick={() => router.get('/')} variant="outline" className="flex items-center">
          <ArrowLeft size={24} />
          <span className="ml-2">Retour</span>
        </Button>
        <ResizePanelComponent
          editorCode={editorCode}
          setEditorCode={setEditorCode}
          exercise={exercise}
          handleRunCode={handleRunCode}
          handleSubmit={handleSubmit}
          isDirty
          isLoading={isLoading}
          output={output}
          setIsDirty={() => setIsDirty(true)}
          lastSyncedTimestamp={lastSyncedTimestamp}
        />
      </div>
    </Suspense>
  )
}

Exercise.layout = (page: any) => <ExerciseLayout>{page}</ExerciseLayout>

export default Exercise
