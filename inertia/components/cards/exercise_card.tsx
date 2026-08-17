import { Check, Lock, Play, Star } from 'lucide-react'
import { Button } from '#components/ui/button'

interface Props {
  number: number
  title: string
  difficulty: number
  isLocked: boolean
  isCompleted: boolean
  onClick?: () => void
}

function Difficulty({ value }: { value: number }) {
  const filled = Math.max(1, Math.min(4, Math.ceil(value / 3)))

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Difficulté ${value} sur 10`}>
      {[0, 1, 2, 3].map((index) => (
        <Star
          key={index}
          className={`h-3 w-3 ${index < filled ? 'fill-[#F4D35E] text-[#D8A900]' : 'text-foreground/15'}`}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

export default function ExerciseCard({
  title,
  difficulty,
  isLocked = true,
  number,
  onClick,
  isCompleted,
}: Props) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs text-muted-foreground">
          #{String(number).padStart(2, '0')}
        </span>
        {isLocked ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Lock className="h-3 w-3" aria-hidden="true" /> Verrouillé
          </span>
        ) : isCompleted ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
            <Check className="h-3 w-3" aria-hidden="true" /> Terminé
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
            À faire
          </span>
        )}
      </div>
      <div className="mt-8">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Challenge JavaScript
        </p>
        <h3
          className={`mt-2 line-clamp-2 text-lg font-semibold leading-snug tracking-tight ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}
        >
          {title}
        </h3>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-foreground/10 pt-4">
        <span className="text-xs text-muted-foreground">{difficulty} points</span>
        <Difficulty value={difficulty} />
      </div>
    </>
  )

  if (isLocked) {
    return <article className="surface min-h-[218px] rounded-2xl p-5 opacity-65">{content}</article>
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="surface focus-ring group flex h-auto min-h-[218px] w-full flex-col items-stretch justify-start rounded-2xl p-5 text-left transition-transform duration-200 hover:-translate-y-1 hover:border-primary/40 hover:bg-background hover:shadow-[0_22px_50px_rgba(84,104,255,0.13)]"
    >
      {content}
      <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        Ouvrir <Play className="h-3 w-3 fill-current" aria-hidden="true" />
      </span>
    </Button>
  )
}
