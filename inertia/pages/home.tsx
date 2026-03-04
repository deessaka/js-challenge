import BaseLayout from '#components/layouts/base_layout'
import ExerciseList from '#components/lists/exercise_list'
import UserLeaderboard from '#components/lists/user_list'
import { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/react'
import { Trophy } from 'lucide-react'
import Exercise from '#models/exercise'

interface Exo extends Exercise {
  isUnlocked: boolean
  isCompleted: boolean
  completedAt: Date | null
}

interface HomePageProps extends SharedProps {
  user: any
  users: any[]
  progressExercises: {
    exercises: Exo[]
    total: number
    currentPage: number
    lastPage: number
  }
  [key: string]: any
}

function Home() {
  const { props } = usePage<HomePageProps>()

  const {
    user = null,
    users = [],
    progressExercises = { exercises: [], total: 0, currentPage: 1, lastPage: 1 },
  } = props

  if (!user || !progressExercises) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground animate-pulse">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-card/30 rounded-3xl border border-border/40 p-1 shadow-2xl">
            <ExerciseList data={progressExercises} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[340px] space-y-6">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition" />
            <div className="relative bg-card/50 border border-border/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
              <div className="p-6">
                <div className="flex items-center gap-3 text-lg font-bold text-foreground mb-4">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Trophy className="w-5 h-5 text-accent-light" />
                  </div>
                  <span>Classement Top 10</span>
                </div>
                <UserLeaderboard users={users} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Home.layout = (page: any) => (
  <BaseLayout
    headerProps={{
      centerContent: (
        <h1 className="text-lg font-bold text-white tracking-tight">
          Accueil
        </h1>
      ),
      showNav: true
    }}
  >
    {page}
  </BaseLayout>
)

export default Home
