import { useEditor } from '#components/context/editor_context'
import MonacoEditor from '#components/editor/monaco_editor'
import ExerciseLayout from '#components/layouts/exercise_layout'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '#components/ui/components/ui/resizable'

function Exercise() {
  const { editorValue } = useEditor()
  console.log(editorValue)
  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border md:min-w-full"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-[calc(100vh-100px)] p-6">
            <article className="font-rbRegular text-pretty">
              <p className="tracking-wide ine-clamp-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia reiciendis est modi
                consectetur aliquam, inventore impedit aliquid voluptatum sed earum perferendis
                possimus dolores voluptas facilis? Tenetur deserunt voluptatem nobis ducimus?
              </p>
            </article>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <MonacoEditor />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30}>
              <div className="flex flex-col h-full px-2 py-4">
                <span className="font-semibold">Output</span>
                {/* display output here */}
                <div className="flex flex-col gap-2 text-pretty overflow-auto scroll-m-1 scroll-ml-7 p-2">
                  <p className="text-sm font-dmItalic">{editorValue}</p>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}

Exercise.layout = (page: any) => <ExerciseLayout>{page}</ExerciseLayout>

export default Exercise
