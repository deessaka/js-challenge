import AvatarComponent from '#components/avatar/avatar'
import UserProfile from '#components/cards/user_profile'
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
  const user = props.user || {}
  const users = props.users || []
  const progressExercises = props.progressExercises || {}

  console.log('in Home page, props', progressExercises)

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex gap-2 py-4 max-h-[calc(100vh-100px)]">
        <div className="w-2/3 flex-2/3 px-4">
          <div className="flex items-center justify-between py-2">
            <h1 className="text-3xl font-bold">Accueil</h1>
            <AvatarComponent src={user.avatarUrl || ''} />
          </div>
          <ExerciseList data={progressExercises} />
        </div>
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
            <div className="p-4">
              <div className="flex items-center gap-2 text-lg font-mono">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>Top 10 Utilisateurs</span>
              </div>
              <UserLeaderboard users={users} />
            </div>
          </div>
          <div className="flex-1">
            <UserProfile user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

Home.layout = (page: any) => <BaseLayout>{page}</BaseLayout>

export default Home
