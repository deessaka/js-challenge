import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/components/ui/avatar'
import { Button } from '#components/ui/components/ui/button'
import { Card } from '#components/ui/components/ui/card'
import { useForm } from '@inertiajs/react'
import { LogOut, UserRound } from 'lucide-react'

interface UserProfileProps {
  user: {
    id: string
    name: string
    email: string
    avatar: string | undefined
    unlockedExercises: number | undefined
    totalPoints: number | undefined
  }
}

function UserProfile({ user }: UserProfileProps) {
  const { post } = useForm()
  const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post('/auth/logout', {
      onSuccess: () => window.location.reload(),
      onError: () => alert('Something went wrong'),
    })
  }

  return (
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
        <div className="flex gap-2">
          <Button
            variant={'outline'}
            type="submit"
            className="flex flex-1 gap-2 justify-center items-center cursor-pointer border-2 rounded-lg px-4 py-1 text-sm hover:bg-primary-dark/10 hover:text-primary-dark"
          >
            <LogOut size={24} className="text-primary-dark" />
            <span className="text-lg font-bold">Disconnect</span>
          </Button>

          <Button
            variant={'outline'}
            type="button"
            className="flex flex-1 gap-2 justify-center items-center cursor-pointer border-2 rounded-lg px-4 py-1 text-sm hover:bg-primary-dark/10 hover:text-primary-dark"
          >
            <UserRound size={24} className="text-primary-dark" />
            <span className="text-lg font-bold">Change password</span>
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default UserProfile
