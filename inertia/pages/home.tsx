import AvatarComponent from '#components/avatar/avatar'
import UserProfile from '#components/cards/user_profile'
import BaseLayout from '#components/layouts/base_layout'
import ExerciseList from '#components/lists/exercise_list'
import UserLeaderboard from '#components/lists/user_list'
import { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/react'
import { TrophyIcon } from 'lucide-react'

function Home() {
  const { user, users, progressExercises: exercises } = usePage<SharedProps>().props

  return (
    <div className="flex gap-2 py-4 max-h-[calc(100vh-100px)]">
      <div className="w-2/3 flex-2/3 px-4">
        <div className="flex items-center justify-between py-2">
          <h1 className="text-3xl font-bold ">Home</h1>
          <AvatarComponent src="" />
        </div>
        <ExerciseList data={exercises} />
      </div>
      <div className="w-1/3 flex flex-col gap-4">
        <div className="flex flex-col max-h-[45vh] px-1 rounded-lg flex-1 border shadow-sm snap-y snap-mandatory">
          <div className="flex gap-2 items-center py-2">
            <div className="flex items-center gap-2 rounded-full p-1 text-sm">
              <TrophyIcon size={32} className="text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold">Top 10 Users</h1>
          </div>

          <UserLeaderboard users={users} />
        </div>
        <div className="flex-1">
          {/* display info about the current user */}
          <UserProfile user={user} />
        </div>
      </div>
    </div>
  )
}

Home.layout = (page: any) => <BaseLayout>{page}</BaseLayout>

export default Home
