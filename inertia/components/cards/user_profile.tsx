import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/components/ui/avatar'
import { Button } from '#components/ui/components/ui/button'
import { Card } from '#components/ui/components/ui/card'
import { router, useForm } from '@inertiajs/react'
import { LogOut, UserRound, Trophy, Star } from 'lucide-react'

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
      onSuccess: () => router.visit('/'),
      onError: () => alert('Something went wrong'),
    })
  }

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <Avatar className="w-16 h-16 mb-4">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-primary/5">
            {user?.name?.[0]}
          </AvatarFallback>
        </Avatar>

        {/* Info utilisateur */}
        <h2 className="text-xl font-mono mb-1">{user?.name}</h2>
        <p className="text-sm text-gray-500 font-mono mb-8">{user?.email}</p>

        {/* Stats */}
        <div className="w-full grid grid-cols-2 gap-16 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-4 h-4" />
              <span className="font-mono">Unlocked</span>
            </div>
            <span className="text-2xl font-mono">{user?.unlockedExercises || 0}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-mono">Score</span>
            </div>
            <span className="text-2xl font-mono">{user?.totalPoints || 0}</span>
          </div>
        </div>

        {/* Boutons */}
        <form onSubmit={handleLogout} method="post" className="w-full space-y-2">
          <Button
            variant="outline"
            type="submit"
            className="w-full h-12 font-mono hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => router.get('/password/edit')}
            className="w-full h-12 font-mono hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <UserRound className="w-4 h-4 mr-2" />
            Change password
          </Button>
        </form>
      </div>
    </Card>
  )
}

export default UserProfile
