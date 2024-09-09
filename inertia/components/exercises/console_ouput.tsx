export const Output = ({ output }: { output: string }) => (
  <div className="flex flex-col h-full px-2 py-4">
    <span className="font-semibold">Output</span>
    <div className="flex flex-col gap-2 text-pretty overflow-auto scroll-m-1 scroll-ml-7 p-2">
      <article className="prose lg:prose-pre:text-sm lg:prose-pre:bg-transparent lg:prose-pre:text-wrap lg:prose-pre:shadow-none lg:prose-pre:rounded-none  lg:prose-pre:border-none w-full lg:prose-pre:tracking-wide lg:prose-pre:leading-loose">
        <pre>{output}</pre>
      </article>
    </div>
  </div>
)
