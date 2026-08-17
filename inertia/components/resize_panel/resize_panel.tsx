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

import { Button } from '#components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '#components/ui/resizable'
import { MonacoEditor } from '#components/editor/monaco_editor'
import { Output } from '#components/exercises/console_ouput'
import { DescriptionRenderer } from '#components/exercises/description_renderer'

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

  if (!exercise) return <div className="p-6 text-workspace-muted">Chargement de l’exercice…</div>

  const savedLabel = lastSyncedTimestamp
    ? `Sauvegardé à ${new Date(lastSyncedTimestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    : 'Pas encore sauvegardé'

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-full overflow-hidden rounded-2xl border border-workspace-border bg-workspace-panel shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
    >
      <ResizablePanel defaultSize={58} minSize={42} className="min-w-0">
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex items-center justify-between border-b border-workspace-border px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-workspace-accent">01 / CODE</span>
              <span
                className="h-1 w-1 rounded-full bg-workspace-foreground/25"
                aria-hidden="true"
              />
              <span className="text-xs text-workspace-muted">JavaScript</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowSuggestions((visible) => !visible)}
                aria-label="Afficher les suggestions"
                aria-expanded={showSuggestions}
                className="h-8 w-8 rounded-lg text-workspace-muted hover:bg-workspace-foreground/10 hover:text-workspace-warning"
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsZenMode((visible) => !visible)}
                aria-label={isZenMode ? 'Quitter le mode zen' : 'Activer le mode zen'}
                className="h-8 w-8 rounded-lg text-workspace-muted hover:bg-workspace-foreground/10 hover:text-workspace-foreground"
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
                className="absolute right-4 top-4 z-20 w-[min(320px,calc(100%-2rem))] rounded-xl border border-workspace-warning/20 bg-workspace-panel p-5 shadow-2xl"
                aria-label="Suggestions pour résoudre l’exercice"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSuggestions(false)}
                  aria-label="Fermer les suggestions"
                  className="absolute right-2 top-2 h-8 w-8 text-workspace-muted hover:bg-workspace-foreground/10 hover:text-workspace-foreground"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
                <p className="flex items-center gap-2 text-sm font-semibold text-workspace-warning">
                  <Lightbulb className="h-4 w-4" aria-hidden="true" /> Pistes de réflexion
                </p>
                <ul className="mt-4 space-y-3 text-xs leading-5 text-workspace-foreground/65">
                  <li>Décomposez le problème en petites étapes.</li>
                  <li>Pensez aux cas limites avant de coder.</li>
                  <li>Préférez des fonctions courtes et testables.</li>
                </ul>
              </aside>
            )}
            <div className="h-full overflow-hidden rounded-xl border border-workspace-border bg-workspace-editor">
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

          <div className="flex flex-col gap-3 border-t border-workspace-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div
              className="flex items-center gap-2 text-[11px] text-workspace-muted"
              aria-live="polite"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${isDirty ? 'bg-workspace-warning' : 'bg-workspace-accent'}`}
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
                className="h-9 rounded-full border-workspace-border bg-transparent px-4 text-xs font-semibold text-workspace-foreground/75 hover:bg-workspace-foreground/10 hover:text-workspace-foreground"
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
                className="h-9 rounded-full bg-workspace-accent px-4 text-xs font-semibold text-workspace-background hover:bg-workspace-accent/85"
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
          <ResizableHandle className="w-1 bg-workspace-foreground/5 transition-colors duration-150 hover:bg-workspace-accent/60 focus-visible:bg-workspace-accent" />
          <ResizablePanel defaultSize={42} minSize={30}>
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel
                defaultSize={42}
                minSize={25}
                className="min-h-0 bg-workspace-background"
              >
                <section className="flex h-full min-h-0 flex-col" aria-labelledby="output-title">
                  <div className="flex items-center justify-between border-b border-workspace-border px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full bg-workspace-accent"
                        aria-hidden="true"
                      />
                      <h2
                        id="output-title"
                        className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-workspace-foreground/65"
                      >
                        Sortie
                      </h2>
                    </div>
                    <span className="text-[11px] text-workspace-muted/70">Console</span>
                  </div>
                  <div className="min-h-0 flex-1 overflow-auto custom-scrollbar">
                    <Output output={output} />
                  </div>
                </section>
              </ResizablePanel>
              <ResizableHandle className="h-1 bg-workspace-foreground/5 transition-colors duration-150 hover:bg-workspace-accent/60 focus-visible:bg-workspace-accent" />
              <ResizablePanel defaultSize={58} minSize={30} className="min-h-0 bg-workspace-panel">
                <div className="h-full overflow-auto custom-scrollbar p-5 sm:p-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-workspace-accent">
                        02 / CONTEXTE
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-workspace-foreground">
                        {exercise.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1 text-workspace-muted/50">
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none text-sm leading-7 prose-headings:text-workspace-foreground prose-p:text-workspace-foreground/65 prose-strong:text-workspace-foreground">
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
