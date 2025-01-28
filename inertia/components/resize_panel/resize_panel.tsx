import { Check, Lightbulb, Loader2, Play, X } from 'lucide-react'
import { Button } from '~/components/ui/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/components/ui/resizable'
import { MonacoEditor } from '~/components/editor/monaco_editor'
import { Output } from '~/components/exercises/console_ouput'
import { ExerciseContent } from '~/components/exercises/exercise_content'
import { PanelContent } from '~/components/exercises/exercise_panel_content'
import React, { useState } from 'react'

interface ResizePanelProps {
  exercise: {
    id: number
    title: string
    description: string
    number: number
  }
  handleSubmit: (event: React.FormEvent) => void
  handleRunCode: () => void
  isLoading: boolean
  output: string
  editorCode: string
  setEditorCode: (code: string) => void
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
  lastSyncedTimestamp: number
}

const ResizePanelComponent = ({
  exercise,
  handleSubmit,
  handleRunCode,
  isLoading,
  output,
  editorCode,
  setEditorCode,
  isDirty,
  setIsDirty,
  lastSyncedTimestamp,
}: ResizePanelProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false)

  if (!exercise) {
    return <div>Chargement de l'exercice...</div>
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full rounded-lg border border-gray-800"
    >
      {/* Éditeur (Panneau Gauche) */}
      <ResizablePanel defaultSize={35} minSize={30} className="h-full">
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Exercice {exercise.number} - {exercise.title}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <Lightbulb className="h-4 w-4" />
                </Button>
              </div>

              {showSuggestions && (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <h3 className="text-lg font-semibold mb-2">Suggestions de l'IA</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Voici quelques conseils pour vous aider à résoudre cet exercice.
                  </p>
                  <div className="prose dark:prose-invert">
                    <p>Pour résoudre cet exercice, voici quelques conseils :</p>
                    <ul>
                      <li>Décomposer le problème en petites étapes</li>
                      <li>Utiliser des fonctions pures pour une meilleure testabilité</li>
                      <li>Penser aux cas limites</li>
                    </ul>
                    <div className="mt-4">
                      <h4 className="text-base font-medium">Approche suggérée :</h4>
                      <ol>
                        <li>Commencer par analyser les données d'entrée</li>
                        <li>Identifier les cas particuliers</li>
                        <li>Implémenter la logique principale</li>
                        <li>Tester avec les exemples fournis</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              <MonacoEditor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={editorCode}
                initialcode={editorCode}
                onChange={(value) => {
                  setEditorCode(value || '')
                  setIsDirty(true)
                }}
                options={{
                  fontSize: 16,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 p-2 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={handleRunCode}
              disabled={isLoading}
              className="hover:scale-105 active:scale-95 transition-transform"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Tester
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isDirty || isLoading}
              className="hover:scale-105 active:scale-95 transition-transform"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Valider
            </Button>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle className="bg-gray-700 w-2 hover:bg-gray-600 transition-colors" />

      {/* Console et Description (Panneau Droit) */}
      <ResizablePanel defaultSize={65} minSize={30}>
        <ResizablePanelGroup direction="vertical">
          {/* Console */}
          <ResizablePanel defaultSize={40} className="bg-gray-900/50 rounded-lg">
            <Output output={output} />
          </ResizablePanel>

          <ResizableHandle className="bg-gray-700 h-2 hover:bg-gray-600 transition-colors" />

          {/* Description */}
          <ResizablePanel defaultSize={60} className="bg-gray-900/50 rounded-lg">
            <div className="p-4 h-full overflow-auto">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-xl font-semibold mb-4">{exercise.title}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: exercise.description,
                  }}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default ResizePanelComponent
