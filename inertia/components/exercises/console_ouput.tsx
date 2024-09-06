export const Output = ({ output }: { output: string }) => (
  <div className="flex flex-col h-full px-2 py-4">
    <span className="font-semibold">Output</span>
    <div className="flex flex-col gap-2 text-pretty overflow-auto scroll-m-1 scroll-ml-7 p-2">
      <p className="text-sm font-dmItalic">{output}</p>
    </div>
  </div>
)
