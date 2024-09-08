export const ExerciseContent = ({
  description,
  title,
  number,
}: {
  description: string
  title: string
  number: number
}) => (
  <article className="prose lg:prose-pre:text-sm lg:prose-pre:bg-transparent lg:prose-pre:text-justify lg:prose-pre:whitespace-normal lg:prose-pre: lg:prose-pre:p-0 lg:prose-pre:shadow-none lg:prose-pre:rounded-none lg:prose-pre:m-0 lg:prose-pre:border-none w-full lg:prose-pre:tracking-wide lg:prose-pre:leading-loose">
    <h3 className="text-primary-neutral-dark dark:text-primary-neutral-light">{`${number} - ${title}`}</h3>
    <pre lang="fr" className="prose" style={{ whiteSpace: 'pre-wrap' }}>
      <p className="!p-0 whitespace-break-spaces text-primary-neutral-dark dark:text-primary-neutral-light">
        {description}
      </p>
    </pre>
  </article>
)
