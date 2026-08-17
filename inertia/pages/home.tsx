import { Link, usePage } from '@inertiajs/react'
import { ArrowRight, BookOpen, Flame, LockKeyhole, Trophy } from 'lucide-react'

import BaseLayout from '#components/layouts/base_layout'
import ExerciseList from '#components/lists/exercise_list'
import UserLeaderboard from '#components/lists/user_list'

interface ExerciseItem {
  id: number | string
  title: string
  difficulty: number
  isUnlocked: boolean
  isCompleted: boolean
  completedAt: Date | null
}

interface HomePageProps {
  user: { username?: string; email?: string } | null
  users: any[]
  progressExercises: {
    exercises: ExerciseItem[]
    total: number
    currentPage: number
    lastPage: number
  }
  [key: string]: any
}

export default function Home() {
  const { props } = usePage<HomePageProps>()
  const {
    user = null,
    users = [],
    progressExercises = { exercises: [], total: 0, currentPage: 1, lastPage: 1 },
  } = props
  const exercises = progressExercises.exercises || []
  const completedCount = exercises.filter((exercise) => exercise.isCompleted).length
  const unlockedCount = exercises.filter((exercise) => exercise.isUnlocked).length
  const nextExercise = exercises.find((exercise) => exercise.isUnlocked && !exercise.isCompleted)

  if (!user) {
    return <div className="py-20 text-center text-muted-foreground">Chargement…</div>
  }

  return (
    <BaseLayout headerProps={{ showNav: true }}>
      <div className="space-y-8 pb-12">
        <section className="relative overflow-hidden rounded-[2rem] bg-foreground px-6 py-10 text-background sm:px-10 lg:px-14 lg:py-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#5468FF]/40 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-[#86E3C0]">Votre espace de pratique</p>
              <h1 className="display-heading mt-4 max-w-2xl text-4xl sm:text-6xl">
                Bonjour {user.username || 'à vous'}, on reprend là où vous vous êtes arrêté ?
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-background/65">
                Un exercice à la fois. Votre progression est sauvegardée automatiquement pour que
                vous puissiez rester dans le rythme.
              </p>
            </div>
            {nextExercise && (
              <Link
                href={`/exercises/${nextExercise.id}`}
                className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#F4D35E] px-5 py-3.5 text-sm font-semibold text-foreground transition-transform duration-150 hover:-translate-y-0.5"
              >
                Continuer le parcours <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Résumé de progression">
          {[
            {
              icon: BookOpen,
              value: `${completedCount}`,
              label: 'défis terminés',
              detail: `sur ${progressExercises.total || exercises.length || 0}`,
            },
            {
              icon: Flame,
              value: `${unlockedCount}`,
              label: 'défis disponibles',
              detail: 'à votre portée',
            },
            {
              icon: Trophy,
              value: `${completedCount * 10}`,
              label: 'points gagnés',
              detail: 'continuez la série',
            },
          ].map(({ icon: Icon, value, label, detail }) => (
            <div key={label} className="surface flex items-center gap-4 rounded-2xl p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono text-2xl font-medium tracking-tight">{value}</p>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="surface overflow-hidden rounded-2xl">
            <ExerciseList data={progressExercises} />
          </section>

          <aside className="space-y-5">
            <section className="surface rounded-2xl p-6" aria-labelledby="next-step-title">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Prochaine étape</p>
                  <h2 id="next-step-title" className="mt-2 text-xl font-semibold">
                    Gardez l’élan
                  </h2>
                </div>
                <LockKeyhole className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Validez les exercices dans l’ordre pour débloquer progressivement les notions
                avancées.
              </p>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-300"
                  style={{
                    width: `${progressExercises.total ? Math.min(100, Math.round((completedCount / progressExercises.total) * 100)) : 0}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Progression</span>
                <span>
                  {progressExercises.total
                    ? Math.round((completedCount / progressExercises.total) * 100)
                    : 0}
                  %
                </span>
              </div>
            </section>
            <section className="surface rounded-2xl p-6" aria-labelledby="leaderboard-title">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="leaderboard-title" className="text-xl font-semibold">
                  Classement
                </h2>
                <Trophy className="h-5 w-5 text-[#C99B00]" aria-hidden="true" />
              </div>
              <UserLeaderboard users={users} />
            </section>
          </aside>
        </div>
      </div>
    </BaseLayout>
  )
}
