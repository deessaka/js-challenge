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
      setIsDirty(true) // Mark as dirty if we load saved code
    }
  }, [exercise?.id])

  useEffect(() => {
    loadCode()
  }, [loadCode])

  useEffect(() => {
    const LSsolutionCode = localStorage.getItem(`exercise_${exercise.id}_code`)
    setEditorCode(LSsolutionCode || exercise.code?.code || '//enter your code')
    setIsDirty(LSsolutionCode !== null) // Mark as dirty if we have saved code
    setIsLoading(false)
  }, [exercise.id, exercise.code?.code])

  const saveToCache = useCallback(
    async (code: string) => {
      localStorage.setItem(`exercise_${exercise.id}_code`, code)
      setIsDirty(true) // Always mark as dirty when code changes

      try {
        const response = await axios.post<SyncResponse>(
          `/api/exercises/${exercise.id}/save-progress`,
          { code }
        )
        if (response.status === 200) {
          setLastSyncedTimestamp(response.data.timestamp)
          // Don't reset isDirty here anymore
        }
      } catch (error) {
        console.error('Error auto-syncing with server:', error)
      }
    },
    [exercise.id]
  )

  const debouncedSaveToCache = useCallback(
    debounce((code: string) => saveToCache(code), 2000),
    [saveToCache]
  )

  const handleEditorChange = useCallback(
    (newCode: string) => {
      setEditorCode(newCode)
      setIsDirty(true) // Mark as dirty whenever code changes
      debouncedSaveToCache(newCode)
    },
    [debouncedSaveToCache]
  )

  // Save to cache when the editor code changes
  useEffect(() => {
    if (editorCode !== exercise.code?.code) {
      debouncedSaveToCache(editorCode)
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
          setIsDirty(false)
        }
      } catch (error) {
        console.error('Error loading progress:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProcess()
  }, [exercise.id])

  return {
    editorCode,
    setEditorCode: handleEditorChange, // Use the new handler
    isDirty,
    setIsDirty,
    lastSyncedTimestamp,
    setLastSyncedTimestamp,
    isLoading,
    debouncedSaveToCache,
    saveToCache,
  }
}

function Exercise() {
  const { exercise } = usePage<{ exercise: Exercise }>().props
  const {
    editorCode,
    setEditorCode,
    isDirty,
    setIsDirty,
    isLoading: isLoadingCode,
    lastSyncedTimestamp,
    saveToCache,
  } = useExerciseCode(exercise)
  const [output, setOutput] = useState<string>('')
  const [isExecuting, setIsExecuting] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleRunCode = useCallback(async () => {
    try {
      setIsExecuting(true)
      const result = await executeCode('javascript', editorCode)

      if (result.run?.output) {
        setOutput(result.run.output)
      } else if (result.run?.stderr) {
        setOutput(`Error: ${result.run.stderr}`)
      } else {
        setOutput('Warning: No output generated')
      }
    } catch (error: any) {
      console.error('Error running code:', error)
      setOutput(
        `Error: ${error.response?.data?.message || error.message || 'An error occurred while running the code'}`
      )
    } finally {
      setIsExecuting(false)
    }
  }, [editorCode])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/exercises/${exercise.id}/execute`, {
        code: editorCode,
      })

      if (response.data.success) {
        setIsDirty(false)
        setOutput('✅ Tests passed successfully!')
        // Wait a bit before redirecting to show the success message
        setTimeout(() => {
          router.visit(`/exercises/${exercise.id + 1}`)
        }, 1500)
      } else {
        const results = response.data.results || []
        setOutput(`❌ ${JSON.stringify(results, null, 2)}`)
      }
    } catch (error: any) {
      console.error('Error validating solution:', error)
      let errorMessage = 'Failed to validate solution'

      if (error.response?.data?.message) {
        errorMessage = `Error: ${error.response.data.message}`
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`
      }

      setOutput(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingCode) {
    return <Loader />
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 p-4 border-b border-gray-700 shrink-0">
          <Button
            variant="ghost"
            className="hover:bg-white/10"
            onClick={() => router.visit('/home')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            Exercice {exercise.number} - {exercise.title}
          </h1>
        </div>

        <div className="flex-1 px-4 py-2 overflow-hidden">
          <ResizePanelComponent
            exercise={exercise}
            handleSubmit={handleSubmit}
            handleRunCode={handleRunCode}
            isLoading={isExecuting || isSubmitting}
            output={output}
            editorCode={editorCode}
            setEditorCode={setEditorCode}
            isDirty={isDirty}
            setIsDirty={setIsDirty}
            lastSyncedTimestamp={lastSyncedTimestamp}
          />
        </div>
      </div>
    </div>
  )
}

Exercise.layout = (page: any) => <ExerciseLayout>{page}</ExerciseLayout>

export default Exercise
