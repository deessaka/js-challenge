export const ExerciseContent = ({
  description,
  title,
  number,
}: {
  description: string
  title: string
  number: number
}) => (
  <article className="prose lg:prose-p:text-sm prose-p:text-justify prose-p:whitespace-pre-line prose-p:leading-loose prose-p:indent-8 dark:prose-invert">
    <h3>{`${number} - ${title}`}</h3>
    <p lang="fr">{description}</p>
  </article>
)
