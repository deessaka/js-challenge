import { MonacoEditor } from '#components/editor/monaco_editor'
import { Output } from '#components/exercises/console_ouput'
import { ExerciseContent } from '#components/exercises/exercise_content'
import { PanelContent } from '#components/exercises/exercise_panel_content'
import { Button } from '#components/ui/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '#components/ui/components/ui/resizable'

interface ResizePanelProps {
  exercise: any
  handleSubmit: (event: any) => Promise<void>
  handleRunCode: () => void
  isLoading: boolean
  setIsLoading?: (value: boolean) => void
  output: string
  editorCode: string
  setEditorCode: (value: string) => void
  setIsDirty?: (value: boolean) => void
  isDirty: boolean
  lastSyncedTimestamp: number
}

function ResizePanelComponent(props: ResizePanelProps) {
  if (!props.exercise) {
    return <div>Chargement de l'exercice...</div>
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
      {/* Left Panel */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <ResizablePanelGroup direction="vertical">
          {/* Description */}
          <ResizablePanel defaultSize={60} minSize={30} className="overflow-auto">
            <PanelContent>
              <ExerciseContent
                description={props.exercise.description || ''}
                title={props.exercise.title || ''}
                number={props.exercise.number || 0}
              />
            </PanelContent>
          </ResizablePanel>
          <ResizableHandle />
          {/* AI Help */}
          <ResizablePanel defaultSize={40} minSize={20} className="overflow-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Suggestions de l'IA</h2>
              <div className="prose dark:prose-invert">
                <p>L'IA suggère de :</p>
                <ul>
                  <li>Décomposer le problème en petites étapes</li>
                  <li>Utiliser des fonctions pures pour une meilleure testabilité</li>
                  <li>Penser aux cas limites</li>
                </ul>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      
      <ResizableHandle />
      
      {/* Right Panel */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <ResizablePanelGroup direction="vertical">
          {/* Code Editor */}
          <ResizablePanel defaultSize={70} minSize={40} className="overflow-hidden">
            <form onSubmit={props.handleSubmit} className="h-full">
              {props.isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <MonacoEditor
                  exerciseId={props.exercise.id}
                  initialcode={props.editorCode}
                  onChange={(value: string) => {
                    props.setEditorCode(value)
                    props.setIsDirty?.(true)
                  }}
                />
              )}
            </form>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Console Output & Buttons */}
          <ResizablePanel defaultSize={30} minSize={20} className="overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Buttons */}
              <div className="flex gap-4 items-center justify-center p-4 border-b shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={props.handleRunCode}
                  className="border-primary hover:bg-primary/10"
                >
                  Tester
                </Button>
                <Button
                  type="submit"
                  onClick={props.handleSubmit}
                  className="bg-primary hover:bg-primary/90"
                >
                  Valider
                </Button>
              </div>
              
              {/* Console Output with Animation */}
              <div className="flex-1 overflow-auto p-4">
                <Output output={props.output} />
              </div>
              
              {/* Status */}
              <div className="p-2 text-center text-sm border-t shrink-0">
                {props.isDirty && (
                  <span className="text-red-500">* Modifications non sauvegardées</span>
                )}
                <p className="text-sm italic">
                  Dernière synchronisation: {new Date(props.lastSyncedTimestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default ResizePanelComponent
