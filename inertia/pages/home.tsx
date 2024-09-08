import AvatarComponent from '#components/avatar/avatar'
import BaseLayout from '#components/layouts/base_layout'
import ExerciseList from '#components/lists/exercise_list'
import UserLeaderboard from '#components/lists/user_list'
import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/components/ui/avatar'
import { Button } from '#components/ui/components/ui/button'
import { Card } from '#components/ui/components/ui/card'
import { SharedProps } from '@adonisjs/inertia/types'
import { useForm, usePage } from '@inertiajs/react'
import { TrophyIcon, LogOut } from 'lucide-react'

function Home() {
  const { user, users, progressExercises: exercises } = usePage<SharedProps>().props

  const { post } = useForm()
  const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post('/auth/logout', {
      onSuccess: () => window.location.reload(),
      onError: () => alert('Something went wrong'),
    })
  }
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
          <Card className="flex justify-center flex-col gap-2 items-center  border-accent-content-light shadow-lg bg-card drop-shadow-sm relative py-4 px-2">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="text-xl font-bold">{user?.name}</div>
              <div className="text-sm font-dmItalic">{user?.email}</div>
            </div>
            <div className="flex gap-4 justify-center items-center p-4">
              <div className="flex flex-col items-center gap-2 rounded-full p-1 text-sm">
                <span className="font-bold">Unlocked</span>
                <span className="font-medium">{user?.unlockedExercises || 0}</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-full p-1 text-sm">
                <span className="font-bold">Total Score</span>
                <span className="font-medium">{user?.totalPoints || 0}</span>
              </div>
            </div>
            <form
              onSubmit={handleLogout}
              method="post"
              className="flex gap-2 justify-center items-center"
            >
              <Button
                variant={'outline'}
                type="submit"
                className="flex gap-2 justify-center items-center cursor-pointer border-2 rounded-lg px-4 py-1 text-sm hover:bg-primary-dark/10 hover:text-primary-dark"
              >
                <LogOut size={24} className="text-primary-dark" />
                <span className="text-lg font-bold">Disconnect</span>
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

Home.layout = (page: any) => <BaseLayout>{page}</BaseLayout>

export default Home
