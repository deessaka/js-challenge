import { DescriptionRenderer } from '~/components/exercises/description_renderer'
import { Check, Lightbulb, Loader2, Play, X, Maximize, Minimize } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable'
import { MonacoEditor } from '~/components/editor/monaco_editor'
import { Output } from '~/components/exercises/console_ouput'
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
  const [isZenMode, setIsZenMode] = useState(false)

  if (!exercise) {
    return <div>Chargement de l'exercice...</div>
  }

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl overflow-hidden"
    >
      {/* Éditeur (Panneau Gauche) */}
      <ResizablePanel defaultSize={35} minSize={30} className="h-full relative">
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0 relative">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                  Code Source
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-indigo-500/20 text-indigo-300 transition-colors"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    title="Suggestions IA"
                  >
                    <Lightbulb className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/10 text-gray-300 transition-colors"
                    onClick={() => setIsZenMode(!isZenMode)}
                    title={isZenMode ? "Quitter le mode Zen" : "Mode Zen"}
                  >
                    {isZenMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {showSuggestions && (
                <div className="absolute top-16 right-4 w-80 z-50 p-5 bg-[#1A1B26]/90 backdrop-blur-xl border border-indigo-500/30 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <h3 className="text-lg font-semibold mb-3 text-indigo-400 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Suggestions de l'IA
                  </h3>
                  <div className="text-sm text-gray-300 space-y-3">
                    <p>Pour résoudre cet exercice :</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Décomposez le problème en petites étapes</li>
                      <li>Pensez aux cas limites (tableaux vides, null...)</li>
                      <li>Utilisez des fonctions pures pour une meilleure testabilité</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex-1 rounded-xl overflow-hidden border border-white/5">
                <MonacoEditor
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
                    padding: { top: 16 },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-white/10 bg-black/20 shrink-0">
            <div className="text-xs text-gray-500 font-mono">
              {lastSyncedTimestamp ? `Sauvegardé à ${new Date(lastSyncedTimestamp).toLocaleTimeString()}` : 'Non sauvegardé'}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRunCode}
                disabled={isLoading}
                className="border-white/10 hover:bg-white/5 text-gray-300 hover:text-white hover:scale-105 active:scale-95 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Tester
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isDirty || isLoading}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white border-none shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Valider
              </Button>
            </div>
          </div>
        </div>
      </ResizablePanel>

      {!isZenMode && (
        <>
          <ResizableHandle className="bg-white/5 w-[2px] transition-colors focus-visible:bg-indigo-500 hover:bg-indigo-500/50" />

          {/* Console et Description (Panneau Droit) */}
          <ResizablePanel defaultSize={65} minSize={30}>
            <ResizablePanelGroup orientation="vertical">
              {/* Console */}
              <ResizablePanel defaultSize={40} className="bg-black/20">
                <Output output={output} />
              </ResizablePanel>

              <ResizableHandle className="bg-white/5 h-[2px] transition-colors focus-visible:bg-indigo-500 hover:bg-indigo-500/50" />

              {/* Description */}
              <ResizablePanel defaultSize={60} className="bg-black/20">
                <div className="p-6 h-full overflow-auto custom-scrollbar">
                  <div className="prose prose-invert max-w-none prose-headings:text-indigo-300">
                    <h2 className="text-2xl font-bold mb-6">{exercise.title}</h2>
                    <DescriptionRenderer description={exercise.description} />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}

export default ResizePanelComponent
