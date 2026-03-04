import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/components/ui/avatar'
import { Star } from 'lucide-react'
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
        if (b.totalPoints !== a.totalPoints) {
          return b.totalPoints - a.totalPoints
        }
        return b.unlockedExercises - a.unlockedExercises
      })
      .slice(0, 10)
  }, [users])

  const getRankIndicator = (index: number) => {
    switch (index) {
      case 0: return <span className="text-xl">🥇</span>
      case 1: return <span className="text-xl">🥈</span>
      case 2: return <span className="text-xl">🥉</span>
      default: return <span className="font-mono text-xs text-muted-foreground/60 w-6 text-center">#{index + 1}</span>
    }
  }

  return (
    <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-1">
      {topUsers?.map((user, index) => (
        <div
          key={user.id}
          className="group flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-muted/50 border border-transparent hover:border-border/50"
        >
          {/* Position */}
          <div className="flex items-center justify-center w-8">
            {getRankIndicator(index)}
          </div>

          {/* Avatar et nom */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <Avatar className="h-8 w-8 ring-2 ring-background">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {index < 3 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-foreground truncate">{user.username}</span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                {user.unlockedExercises} exercices
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-accent/5 border border-accent/10 whitespace-nowrap">
            <Star className="w-3 h-3 text-accent-light fill-accent-light" />
            <span className="font-mono font-bold text-xs text-accent-light">{user.totalPoints}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserLeaderboard
