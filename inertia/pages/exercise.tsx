import { Link, usePage } from '@inertiajs/react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Terminal,
  Trophy,
} from 'lucide-react'

import DashboardLayout from '#components/layouts/dashboard_layout'
import { Badge } from '#components/ui/badge'
import { Button } from '#components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card'

interface ExerciseData {
  id: number
  description: string
  title: string
  number: number
  difficulty?: number
  isUnlocked?: boolean
  isCompleted?: boolean
}

function difficultyLabel(difficulty = 1) {
  if (difficulty <= 1) return 'Fondations'
  if (difficulty === 2) return 'Pratique'
  return 'Approfondissement'
}

export default function Exercise() {
  const { exercise } = usePage<{ exercise: ExerciseData }>().props
  const isCompleted = exercise.isCompleted === true
  const isUnlocked = exercise.isUnlocked !== false

  return (
    <DashboardLayout
      eyebrow={`Parcours · Étape ${String(exercise.number).padStart(2, '0')}`}
      title={exercise.title}
      description="Comprendre la compétence, puis la pratiquer dans Codojo CLI."
      actions={
        <Badge variant={isCompleted ? 'success' : isUnlocked ? 'default' : 'secondary'}>
          {isCompleted ? 'Validé' : isUnlocked ? 'Disponible' : 'Verrouillé'}
        </Badge>
      }
    >
      <div className="space-y-6">
        <Button
          asChild
          variant="ghost"
          className="-ml-3 rounded-xl text-muted-foreground hover:text-foreground"
        >
          <Link href="/home">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Retour au parcours
          </Link>
        </Button>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="border-border/70 bg-card/75 shadow-none">
            <CardHeader className="border-b border-border/60 px-6 py-6 sm:px-8">
              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                <BookOpen className="h-4 w-4" aria-hidden="true" /> Fiche de pratique
              </div>
              <CardTitle className="mt-3 text-3xl tracking-[-0.04em]">{exercise.title}</CardTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">{difficultyLabel(exercise.difficulty)}</Badge>
                <Badge variant="outline">JavaScript</Badge>
                <Badge variant="outline">Étape {exercise.number}</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-7 sm:px-8 sm:py-9">
              <div className="prose prose-slate max-w-none dark:prose-invert">
                <p className="whitespace-pre-line text-base leading-8 text-muted-foreground">
                  {exercise.description}
                </p>
              </div>
              <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Code2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold">Pratiquez dans votre environnement</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      L’éditeur et la console vivent dans Codojo CLI pour vous rapprocher d’un vrai
                      flux de développement local.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/70 bg-card/75 shadow-none">
              <CardHeader className="px-5 pb-3 pt-5">
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <Terminal className="h-4 w-4" aria-hidden="true" /> Continuer dans le CLI
                </div>
                <CardTitle className="mt-2 text-xl tracking-[-0.03em]">Prêt à coder ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-5 pb-5">
                <p className="text-sm leading-6 text-muted-foreground">
                  Ouvrez cet exercice directement depuis le terminal pour écrire, exécuter et
                  valider votre solution.
                </p>
                <div className="rounded-xl border border-border/70 bg-muted/40 p-3 font-mono text-xs leading-6">
                  <span className="text-muted-foreground">$</span> codojo start exercise-
                  {exercise.id}
                </div>
                <Button asChild className="w-full rounded-xl">
                  <Link href="/profile#api-token">
                    Configurer Codojo CLI <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/75 shadow-none">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Trophy className="mt-0.5 h-5 w-5 text-amber-500" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Votre progression</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {isCompleted
                        ? 'Cette étape est déjà validée. Vous pouvez la revoir ou continuer votre parcours.'
                        : isUnlocked
                          ? 'Validez cet exercice dans le CLI pour débloquer la suite.'
                          : 'Terminez les étapes précédentes pour débloquer cet exercice.'}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" /> Progression
                  synchronisée automatiquement
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
