import {
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  X,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable'
import { MonacoEditor } from '~/components/editor/monaco_editor'
import { Output } from '~/components/exercises/console_ouput'
import { DescriptionRenderer } from '~/components/exercises/description_renderer'

interface ResizePanelProps {
  exercise: { id: number; title: string; description: string; number: number }
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

export default function ResizePanelComponent({
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
}: ResizePanelProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isZenMode, setIsZenMode] = useState(false)

  if (!exercise) return <div className="p-6 text-white/60">Chargement de l’exercice…</div>

  const savedLabel = lastSyncedTimestamp
    ? `Sauvegardé à ${new Date(lastSyncedTimestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    : 'Pas encore sauvegardé'

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-full overflow-hidden rounded-2xl border border-white/10 bg-[#17203A] shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
    >
      <ResizablePanel defaultSize={58} minSize={42} className="min-w-0">
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#86E3C0]">01 / CODE</span>
              <span className="h-1 w-1 rounded-full bg-white/25" aria-hidden="true" />
              <span className="text-xs text-white/50">JavaScript</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowSuggestions((visible) => !visible)}
                aria-label="Afficher les suggestions"
                aria-expanded={showSuggestions}
                className="h-8 w-8 rounded-lg text-white/55 hover:bg-white/10 hover:text-[#F4D35E]"
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsZenMode((visible) => !visible)}
                aria-label={isZenMode ? 'Quitter le mode zen' : 'Activer le mode zen'}
                className="h-8 w-8 rounded-lg text-white/55 hover:bg-white/10 hover:text-white"
              >
                {isZenMode ? (
                  <Minimize2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 p-3 sm:p-4">
            {showSuggestions && (
              <aside
                className="absolute right-4 top-4 z-20 w-[min(320px,calc(100%-2rem))] rounded-xl border border-[#F4D35E]/20 bg-[#202A47] p-5 shadow-2xl"
                aria-label="Suggestions pour résoudre l’exercice"
              >
                <button
                  type="button"
                  onClick={() => setShowSuggestions(false)}
                  aria-label="Fermer les suggestions"
                  className="focus-ring absolute right-3 top-3 rounded-md p-1 text-white/45 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="flex items-center gap-2 text-sm font-semibold text-[#F4D35E]">
                  <Lightbulb className="h-4 w-4" aria-hidden="true" /> Pistes de réflexion
                </p>
                <ul className="mt-4 space-y-3 text-xs leading-5 text-white/65">
                  <li>Décomposez le problème en petites étapes.</li>
                  <li>Pensez aux cas limites avant de coder.</li>
                  <li>Préférez des fonctions courtes et testables.</li>
                </ul>
              </aside>
            )}
            <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-[#0D1425]">
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
                  fontSize: 15,
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  padding: { top: 18, bottom: 18 },
                  fontFamily: "'DM Mono', monospace",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-2 text-[11px] text-white/45" aria-live="polite">
              <span
                className={`h-1.5 w-1.5 rounded-full ${isDirty ? 'bg-[#F4D35E]' : 'bg-[#86E3C0]'}`}
                aria-hidden="true"
              />
              {isDirty ? 'Modifications non validées' : savedLabel}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleRunCode}
                disabled={isLoading}
                className="h-9 rounded-full border-white/15 bg-transparent px-4 text-xs font-semibold text-white/75 hover:bg-white/10 hover:text-white"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Play className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                )}{' '}
                Tester
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!isDirty || isLoading}
                className="h-9 rounded-full bg-[#86E3C0] px-4 text-xs font-semibold text-[#11182B] hover:bg-[#A8F0D6]"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Check className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                )}{' '}
                Valider
              </Button>
            </div>
          </div>
        </div>
      </ResizablePanel>

      {!isZenMode && (
        <>
          <ResizableHandle className="w-1 bg-white/5 transition-colors duration-150 hover:bg-[#86E3C0]/60 focus-visible:bg-[#86E3C0]" />
          <ResizablePanel defaultSize={42} minSize={30}>
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize={42} minSize={25} className="min-h-0 bg-[#10182C]">
                <section className="flex h-full min-h-0 flex-col" aria-labelledby="output-title">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#86E3C0]" aria-hidden="true" />
                      <h2
                        id="output-title"
                        className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-white/65"
                      >
                        Sortie
                      </h2>
                    </div>
                    <span className="text-[11px] text-white/35">Console</span>
                  </div>
                  <div className="min-h-0 flex-1 overflow-auto custom-scrollbar">
                    <Output output={output} />
                  </div>
                </section>
              </ResizablePanel>
              <ResizableHandle className="h-1 bg-white/5 transition-colors duration-150 hover:bg-[#86E3C0]/60 focus-visible:bg-[#86E3C0]" />
              <ResizablePanel defaultSize={58} minSize={30} className="min-h-0 bg-[#17203A]">
                <div className="h-full overflow-auto custom-scrollbar p-5 sm:p-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#86E3C0]">
                        02 / CONTEXTE
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-white">{exercise.title}</h2>
                    </div>
                    <div className="flex items-center gap-1 text-white/30">
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none text-sm leading-7 prose-headings:text-white prose-p:text-white/65 prose-strong:text-white">
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
