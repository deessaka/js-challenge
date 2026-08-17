import { Link, usePage } from '@inertiajs/react'
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleDashed,
  Code2,
  ExternalLink,
  Flame,
  GitBranch,
  Layers3,
  Sparkles,
  Terminal,
  Trophy,
  Zap,
} from 'lucide-react'

import DashboardLayout from '#components/layouts/dashboard_layout'
import { Badge } from '#components/ui/badge'
import { Button } from '#components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card'
import { cn } from '~/lib/utils'

interface ExerciseItem {
  id: number | string
  title: string
  difficulty: number
  isUnlocked: boolean
  isCompleted: boolean
  completedAt: Date | string | null
}

interface HomePageProps {
  user: { username?: string; name?: string; email?: string } | null
  progressExercises: {
    exercises: ExerciseItem[]
    total: number
    currentPage: number
    lastPage: number
  }
  stats: { completeCount: number; totalPoints: number }
  [key: string]: any
}

function difficultyLabel(difficulty: number) {
  if (difficulty <= 1) return 'Fondations'
  if (difficulty === 2) return 'Pratique'
  return 'Approfondissement'
}

function formatDate(value: Date | string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function Home() {
  const { props } = usePage<HomePageProps>()
  const {
    user = null,
    progressExercises = { exercises: [], total: 0, currentPage: 1, lastPage: 1 },
    stats = { completeCount: 0, totalPoints: 0 },
  } = props
  const exercises = progressExercises.exercises || []
  const totalExercises = progressExercises.total || exercises.length
  const completedCount = stats.completeCount
  const unlockedCount = exercises.filter(
    (exercise) => exercise.isUnlocked && !exercise.isCompleted
  ).length
  const nextExercise = exercises.find((exercise) => exercise.isUnlocked && !exercise.isCompleted)
  const progress = totalExercises
    ? Math.min(100, Math.round((completedCount / totalExercises) * 100))
    : 0
  const recentActivity = exercises.filter((exercise) => exercise.isCompleted).slice(0, 4)
  const displayName = user?.name || user?.username || 'à vous'

  if (!user) {
    return (
      <div className="py-20 text-center text-muted-foreground">Chargement de votre espace…</div>
    )
  }

  return (
    <DashboardLayout
      title="Vue d’ensemble"
      description="Votre espace pour suivre vos acquis et reprendre rapidement votre parcours."
      actions={
        <Button asChild size="sm" className="hidden rounded-xl sm:inline-flex">
          <Link href="/profile#api-token">
            <Terminal className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Configurer le CLI</span>
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[1.75rem] border border-slate-700/70 bg-[#111a2d] px-5 py-7 text-slate-50 shadow-[0_22px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_5px_rgba(110,231,183,0.12)]" />
                Parcours actif
              </div>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Bonjour {displayName}, on reprend là où vous vous êtes arrêté ?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Codojo vous aide à transformer chaque exercice validé en compétence durable.
                L’édition et l’exécution se font maintenant directement dans le CLI.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {nextExercise ? (
                  <Button
                    asChild
                    className="rounded-xl bg-emerald-300 text-slate-950 hover:bg-emerald-200"
                  >
                    <Link href={`/exercises/${nextExercise.id}`}>
                      Continuer avec « {nextExercise.title} »
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="rounded-xl bg-emerald-300 text-slate-950 hover:bg-emerald-200"
                  >
                    <Link href="#path">
                      Explorer le parcours <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-slate-600 bg-transparent text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/profile#api-token">
                    <Terminal className="h-4 w-4" aria-hidden="true" /> Ouvrir le CLI
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-slate-300">Progression globale</span>
                <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-mono text-4xl font-semibold tracking-[-0.08em]">
                  {progress}%
                </span>
                <span className="mb-1 text-xs text-slate-400">du parcours</span>
              </div>
              <div
                className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"
                aria-label={`Progression : ${progress}%`}
              >
                <div
                  className="h-full rounded-full bg-emerald-300 transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-400">
                {completedCount} exercice{completedCount > 1 ? 's' : ''} validé
                {completedCount > 1 ? 's' : ''} sur {totalExercises}
              </p>
            </div>
          </div>
        </section>

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Résumé de progression"
        >
          <Card className="border-border/70 bg-card/75 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="font-mono text-xs text-muted-foreground">01</span>
              </div>
              <p className="mt-6 font-mono text-3xl font-semibold tracking-[-0.08em]">
                {totalExercises}
              </p>
              <p className="mt-1 text-sm font-medium">Exercices au parcours</p>
              <p className="mt-1 text-xs text-muted-foreground">Une progression structurée</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/75 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                <span className="font-mono text-xs text-muted-foreground">02</span>
              </div>
              <p className="mt-6 font-mono text-3xl font-semibold tracking-[-0.08em]">
                {completedCount}
              </p>
              <p className="mt-1 text-sm font-medium">Compétences validées</p>
              <p className="mt-1 text-xs text-muted-foreground">Continuez à construire</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/75 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <Flame className="h-4 w-4 text-amber-500" aria-hidden="true" />
                <span className="font-mono text-xs text-muted-foreground">03</span>
              </div>
              <p className="mt-6 font-mono text-3xl font-semibold tracking-[-0.08em]">
                {unlockedCount}
              </p>
              <p className="mt-1 text-sm font-medium">Étapes disponibles</p>
              <p className="mt-1 text-xs text-muted-foreground">Prêtes à être pratiquées</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/75 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
                <span className="font-mono text-xs text-muted-foreground">04</span>
              </div>
              <p className="mt-6 font-mono text-3xl font-semibold tracking-[-0.08em]">
                {stats.totalPoints}
              </p>
              <p className="mt-1 text-sm font-medium">Points accumulés</p>
              <p className="mt-1 text-xs text-muted-foreground">Votre rythme, vos acquis</p>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card id="path" className="overflow-hidden border-border/70 bg-card/75 shadow-none">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/60 px-5 py-5 sm:px-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <Layers3 className="h-4 w-4" aria-hidden="true" /> Parcours
                </div>
                <CardTitle className="mt-2 text-xl tracking-[-0.03em]">
                  Continuer l’apprentissage
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vos prochaines étapes, avec leur état de progression.
                </p>
              </div>
              <Badge variant="outline" className="shrink-0 rounded-lg">
                {totalExercises} étapes
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              {exercises.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                  Votre parcours sera bientôt disponible.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {exercises.map((exercise, index) => {
                    const completedDate = formatDate(exercise.completedAt)
                    return (
                      <Link
                        key={exercise.id}
                        href={`/exercises/${exercise.id}`}
                        className="focus-ring group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/45 sm:px-6"
                      >
                        <span
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                            exercise.isCompleted
                              ? 'border-accent/25 bg-accent/10 text-accent'
                              : exercise.isUnlocked
                                ? 'border-primary/25 bg-primary/10 text-primary'
                                : 'border-border bg-muted text-muted-foreground'
                          )}
                        >
                          {exercise.isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          ) : exercise.isUnlocked ? (
                            <CircleDashed className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <GitBranch className="h-4 w-4" aria-hidden="true" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                'truncate text-sm font-semibold',
                                !exercise.isUnlocked && 'text-muted-foreground'
                              )}
                            >
                              {exercise.title}
                            </span>
                            <Badge
                              variant={
                                exercise.isCompleted
                                  ? 'success'
                                  : exercise.isUnlocked
                                    ? 'default'
                                    : 'secondary'
                              }
                              className="rounded-md text-[10px]"
                            >
                              {exercise.isCompleted
                                ? 'Validé'
                                : exercise.isUnlocked
                                  ? 'À pratiquer'
                                  : 'Verrouillé'}
                            </Badge>
                          </span>
                          <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono text-[10px]">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span>·</span>
                            <span>{difficultyLabel(exercise.difficulty)}</span>
                            {completedDate && (
                              <>
                                <span>·</span>
                                <span>Validé le {completedDate}</span>
                              </>
                            )}
                          </span>
                        </span>
                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div id="activity" className="space-y-6">
            <Card className="border-border/70 bg-card/75 shadow-none">
              <CardHeader className="px-5 pb-3 pt-5 sm:px-6">
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <Activity className="h-4 w-4" aria-hidden="true" /> Activité récente
                </div>
                <CardTitle className="mt-2 text-xl tracking-[-0.03em]">Votre rythme</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 sm:px-6">
                {recentActivity.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-muted/25 px-4 py-6 text-sm text-muted-foreground">
                    Validez votre premier exercice depuis le CLI pour voir votre activité ici.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((exercise) => (
                      <div key={exercise.id} className="flex items-start gap-3">
                        <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{exercise.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Exercice validé
                            {formatDate(exercise.completedAt)
                              ? ` · ${formatDate(exercise.completedAt)}`
                              : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 bg-primary/[0.04] shadow-none">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Terminal className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em]">
                  Votre espace de code est dans le CLI
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Éditez, exécutez et validez vos solutions dans Codojo CLI. Le Web conserve la vue
                  d’ensemble de vos acquis.
                </p>
                <div className="mt-4 rounded-xl border border-border/70 bg-background/70 px-3 py-2 font-mono text-xs text-foreground">
                  npm install --global @codojo/cli
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" className="rounded-lg">
                    <Link href="/profile#api-token">
                      Générer un token <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="rounded-lg">
                    <a
                      href="https://github.com/Ekole237/js-challenge"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Documentation <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-2xl border border-border/60 bg-muted/25 px-4 py-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Code2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Synchronisation
                automatique
              </div>
              <p className="mt-1.5 leading-5">
                Chaque validation CLI met à jour votre progression sur le dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
