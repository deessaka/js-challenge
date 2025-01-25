import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/components/ui/avatar'
import { Trophy, Star } from 'lucide-react'
import User from '#models/user'

interface UserDto extends User {
  unlockedExercises: number
  totalPoints: number
}

interface UserLeaderboardProps {
  users: UserDto[]
}

function UserLeaderboard({ users }: UserLeaderboardProps) {
  const topUsers = useMemo(() => {
    return users
      ?.sort((a, b) => {
        // D'abord trier par points
        if (b.totalPoints !== a.totalPoints) {
          return b.totalPoints - a.totalPoints
        }
        // En cas d'égalité, trier par nombre d'exercices débloqués
        return b.unlockedExercises - a.unlockedExercises
      })
      .slice(0, 10)
  }, [users])

  return (
    <div className="mt-2 h-full space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
      {topUsers?.map((user, index) => (
        <div
          key={user.id}
          className="flex items-center gap-3 py-2"
        >
          {/* Position */}
          <span className="font-mono w-4 text-center">{index + 1}</span>

          {/* Avatar et nom */}
          <div className="flex items-center gap-2 flex-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="text-xs bg-primary/5">
                {user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="font-mono">{user.username}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 font-mono">
            <Trophy className="w-4 h-4" />
            <span>{user.unlockedExercises}</span>
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{user.totalPoints} pt</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserLeaderboard
