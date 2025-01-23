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
    async (code: string) => {
      localStorage.setItem(`exercise_${exercise.id}_code`, code)
      setIsDirty(true)
      
      try {
        const response = await axios.post<SyncResponse>(
          `/api/exercises/${exercise.id}/save-progress`,
          { code }
        )
        if (response.status === 200) {
          setIsDirty(false)
          setLastSyncedTimestamp(response.data.timestamp)
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
    setEditorCode,
    isDirty,
    setIsDirty,
    lastSyncedTimestamp,
    setLastSyncedTimestamp,
    isLoading,
    debouncedSaveToCache,
    saveToCache
  }
}

function Exercise() {
  const { exercise } = usePage<{ exercise: Exercise }>().props
  const {
    editorCode,
    setEditorCode,
    isDirty,
    setIsDirty,
    isLoading,
    lastSyncedTimestamp,
    syncWithServer
  } = useExerciseCode(exercise)
  const [output, setOutput] = useState<string>('')
  const [isExecuting, setIsExecuting] = useState<boolean>(false)

  const handleRunCode = useCallback(async () => {
    setIsExecuting(true)
    try {
      const result = await executeCode(editorCode)
      setOutput(result)
    } catch (error) {
      setOutput(String(error))
    }
    setIsExecuting(false)
  }, [editorCode])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await syncWithServer(editorCode)
  }

  if (isLoading) {
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
            isLoading={isLoading}
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
