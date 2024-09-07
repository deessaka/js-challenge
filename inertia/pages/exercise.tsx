import { useEditor } from '#components/context/editor_context'
import ExerciseLayout from '#components/layouts/exercise_layout'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '#components/ui/components/ui/resizable'
import { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/react'
import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import { Button } from '#components/ui/components/ui/button'
import { executeCode } from '~/lib/lib'
import { ExerciseContent } from '#components/exercises/exercise_content'
import { PanelContent } from '#components/exercises/exercise_panel_content'
import { Output } from '#components/exercises/console_ouput'
import { MonacoEditor } from '#components/editor/monaco_editor'
import axios from 'axios'

const debounce = _.debounce

function Exercise() {
  const { exercise } = usePage<SharedProps>().props
  const { editorValue, setEditorValue } = useEditor()
  const [editorCode, setEditorCode] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [lastSyncedTimestamp, setLastSyncedTimestamp] = useState(Date.now())

  const loadCode = useCallback(async () => {
    try {
      const res = await fetch(`/api/exercises/${exercise?.id}/code`)
      if (res.ok) {
        const { code, timestamp } = await res.json()
        setEditorCode(code)
        setLastSyncedTimestamp(timestamp)
      } else {
        const cachedCode = localStorage.getItem(`exercise_${exercise?.id}_code`)
        if (cachedCode) setEditorCode(cachedCode)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du code:', error)
      const cachedCode = localStorage.getItem(`exercise_${exercise?.id}_code`)
      if (cachedCode) setEditorCode(cachedCode)
    }
  }, [exercise?.id])

  useEffect(() => {
    loadCode()
  }, [loadCode])

  const saveToCache = useCallback(() => {
    localStorage.setItem(`exercise_${exercise?.id}_code`, editorCode)
    setIsDirty(true)
  }, [exercise?.id, editorCode])

  const debouncedSaveToCache = useCallback(debounce(saveToCache, 500), [saveToCache])

  const syncWithServer = useCallback(async () => {
    try {
      const response = await fetch(`/api/exercises/${exercise?.id}/save-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: editorCode, timestamp: Date.now() }),
      })
      if (response.ok) {
        setIsDirty(false)
        setLastSyncedTimestamp(Date.now())
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation avec le serveur:', error)
    }
  }, [exercise?.id, editorCode])

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        if (isDirty) syncWithServer()
      },
      5 * 60 * 1000
    )
    return () => clearInterval(intervalId)
  }, [isDirty, syncWithServer])

  useEffect(() => {
    debouncedSaveToCache()
  }, [editorCode, debouncedSaveToCache])

  const handleRunCode = async () => {
    try {
      const response = await executeCode('javascript', editorCode)
      setEditorValue(response.run.stdout)
    } catch (error) {
      console.error('Failed to execute code:', error)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await syncWithServer()
    const response = await axios.post(`/api/exercises/${exercise?.id}/execute`, {
      code: editorCode,
    })
    console.log('RESPONSE FROM SERVER', response)
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border md:min-w-full"
    >
      <ResizablePanel defaultSize={50}>
        <PanelContent>
          <ExerciseContent
            description={exercise?.description || ''}
            title={exercise?.title}
            number={exercise?.number}
          />
        </PanelContent>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50} className="overflow-auto">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full items-center justify-center"
            >
              <MonacoEditor
                exerciseId={exercise?.id}
                initialcode={editorCode}
                onChange={(value: string) => {
                  setEditorCode(value)
                  setIsDirty(true)
                }}
              />
              <div className="flex gap-4 items-center justify-center p-4">
                <Button
                  type="button"
                  variant={'outline'}
                  onClick={handleRunCode}
                  className="border-primary-light text-primary-light hover:bg-primary-dark/80"
                >
                  Run Code
                </Button>
                <Button
                  type="submit"
                  onClick={syncWithServer}
                  className="bg-primary-light text-secondary-foreground hover:bg-primary-dark/80"
                >
                  Save
                </Button>
              </div>
            </form>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <div className="flex flex-col items-center justify-center">
              {isDirty && <span className="text-red-500">* Modifications non sauvegardées</span>}
              <p className="text-sm italic">
                Dernière synchronisation: {new Date(lastSyncedTimestamp).getHours()}h{' '}
                {new Date(lastSyncedTimestamp).getMinutes()}m
              </p>
            </div>
            <Output output={editorValue} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

Exercise.layout = (page: any) => <ExerciseLayout>{page}</ExerciseLayout>

export default Exercise
