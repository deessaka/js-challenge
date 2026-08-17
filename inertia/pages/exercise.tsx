import axios from 'axios'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { router, usePage } from '@inertiajs/react'

import ExerciseLayout from '#components/layouts/exercise_layout'
import Header from '#components/header/header'
import Loader from '#components/loader/loader'
import ResizePanelComponent from '#components/resize_panel/resize_panel'

interface ExerciseData {
  id: number
  code?: { code: string }
  description: string
  title: string
  number: number
}

interface SyncResponse {
  timestamp: number
}
const debounce = _.debounce

function useExerciseCode(exercise: ExerciseData) {
  const [editorCode, setEditorCodeState] = useState(
    exercise.code?.code || '// Écrivez votre solution ici'
  )
  const [isDirty, setIsDirty] = useState(false)
  const [lastSyncedTimestamp, setLastSyncedTimestamp] = useState(DateTime.now().toMillis())
  const [isLoading, setIsLoading] = useState(true)

  const saveToCache = useCallback(
    async (code: string) => {
      localStorage.setItem(`exercise_${exercise.id}_code`, code)
      setIsDirty(true)
      try {
        const response = await axios.post<SyncResponse>(
          `/api/exercises/${exercise.id}/save-progress`,
          { code }
        )
        if (response.status === 200) setLastSyncedTimestamp(response.data.timestamp)
      } catch (error) {
        console.error('Error auto-syncing with server:', error)
      }
    },
    [exercise.id]
  )

  const debouncedSaveToCache = useCallback(
    debounce((code: string) => saveToCache(code), 1600),
    [saveToCache]
  )

  useEffect(() => {
    const localCode = localStorage.getItem(`exercise_${exercise.id}_code`)
    setEditorCodeState(localCode || exercise.code?.code || '// Écrivez votre solution ici')
    setIsDirty(localCode !== null)
    setIsLoading(false)
  }, [exercise.id, exercise.code?.code])

  useEffect(
    () => () => {
      void saveToCache(editorCode)
    },
    [editorCode, saveToCache]
  )

  const setEditorCode = useCallback(
    (code: string) => {
      setEditorCodeState(code)
      setIsDirty(true)
      debouncedSaveToCache(code)
    },
    [debouncedSaveToCache]
  )

  return {
    editorCode,
    setEditorCode,
    isDirty,
    setIsDirty,
    lastSyncedTimestamp,
    isLoading,
    saveToCache,
  }
}

export default function Exercise() {
  const { exercise } = usePage<{ exercise: ExerciseData }>().props
  const {
    editorCode,
    setEditorCode,
    isDirty,
    setIsDirty,
    isLoading: isLoadingCode,
    lastSyncedTimestamp,
    saveToCache,
  } = useExerciseCode(exercise)
  const [output, setOutput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRunCode = useCallback(async () => {
    setIsExecuting(true)
    try {
      const result = await (await import('~/lib/lib')).executeCode('javascript', editorCode)
      setOutput(
        result.run?.output ||
          (result.run?.stderr ? `Erreur : ${result.run.stderr}` : 'Aucune sortie générée.')
      )
    } catch (error: any) {
      setOutput(
        `Erreur : ${error.response?.data?.message || error.message || 'Impossible d’exécuter le code.'}`
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
        setOutput('Tests réussis. Le prochain défi sera bientôt disponible.')
        window.setTimeout(() => router.visit(`/exercises/${exercise.id + 1}`), 1400)
      } else {
        setOutput(`Tests non validés\n${JSON.stringify(response.data.results || [], null, 2)}`)
      }
    } catch (error: any) {
      setOutput(
        `Erreur : ${error.response?.data?.message || error.message || 'Impossible de valider la solution.'}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingCode) return <Loader />

  return (
    <div className="flex h-screen min-h-[620px] flex-col overflow-hidden bg-[#11182B] text-white">
      <Header
        showNav={false}
        className="border-white/10 bg-[#11182B]/90 text-white"
        leftContent={
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.visit('/home')}
              aria-label="Retour au catalogue"
              className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/55 transition-colors duration-150 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#86E3C0]">
                Challenge JS · Défi {exercise.number}
              </p>
              <h1 className="truncate text-sm font-semibold text-white">{exercise.title}</h1>
            </div>
          </div>
        }
        rightContent={
          <div
            className="hidden items-center gap-2 text-[11px] text-white/45 sm:flex"
            aria-live="polite"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-[#86E3C0]" aria-hidden="true" />{' '}
            {isDirty ? 'Modifications en cours' : 'Tout est sauvegardé'}
          </div>
        }
      />
      <main className="min-h-0 flex-1 p-3 sm:p-4 lg:p-5">
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
      </main>
    </div>
  )
}

Exercise.layout = (page: any) => <ExerciseLayout>{page}</ExerciseLayout>
