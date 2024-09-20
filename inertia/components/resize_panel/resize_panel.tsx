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
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75}>
            <PanelContent>
              <ExerciseContent
                description={props.exercise.description || ''}
                title={props.exercise.title}
                number={props.exercise.number}
              />
            </PanelContent>
          </ResizablePanel>
          <ResizableHandle />
          {/* AI Explanation */}
          {/* <ResizablePanel defaultSize={25}>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">AI Explanation</h2>
              
              <p>Some text here</p>
            </div>
          </ResizablePanel> */}
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50} className="overflow-auto">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            <form
              onSubmit={props.handleSubmit}
              className="flex flex-col h-full items-center justify-center"
            >
              {props.isLoading ? (
                // make nice loader after using librairy of animation like react-loader
                <div>Chargement ....</div>
              ) : (
                <MonacoEditor
                  exerciseId={props.exercise.id}
                  initialcode={props.editorCode}
                  onChange={(value: string) => {
                    props.setEditorCode(value)
                    props.setIsDirty
                  }}
                />
              )}

              <div className="flex gap-4 items-center justify-center p-4">
                <Button
                  type="button"
                  variant={'outline'}
                  onClick={props.handleRunCode}
                  className="border-primary-light text-primary-light hover:bg-primary-dark/80"
                >
                  Run Code
                </Button>
                <Button
                  type="submit"
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
              {props.isDirty && (
                <span className="text-red-500">* Modifications non sauvegardées</span>
              )}
              <p className="text-sm italic">
                Dernière synchronisation: {new Date(props.lastSyncedTimestamp).getHours()}h{' '}
                {new Date(props.lastSyncedTimestamp).getMinutes()}m
              </p>
            </div>
            <Output output={props.output} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default ResizePanelComponent
