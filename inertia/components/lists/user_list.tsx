import { useMemo } from 'react'
import { Medal, Star } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/avatar'

interface UserDto {
  id: number | string
  username: string
  avatar?: string | null
  unlockedExercises: number
  totalPoints: number
}

interface UserLeaderboardProps {
  users: UserDto[]
}

export default function UserLeaderboard({ users }: UserLeaderboardProps) {
  const topUsers = useMemo(
    () => [...(users || [])].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 10),
    [users]
  )

  if (!topUsers.length) {
    return (
      <p className="rounded-xl bg-muted/70 px-4 py-5 text-sm text-muted-foreground">
        Le classement apparaîtra dès les premières validations.
      </p>
    )
  }

  return (
    <ol className="space-y-1" aria-label="Top 10 des utilisateurs">
      {topUsers.map((user, index) => (
        <li
          key={user.id}
          className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors duration-150 hover:bg-foreground/5"
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${index < 3 ? 'bg-brand-yellow/25 text-brand-gold' : 'bg-muted text-muted-foreground'}`}
          >
            {index < 3 ? <Medal className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
          </span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || undefined} alt="" />
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.username}</p>
            <p className="text-[11px] text-muted-foreground">
              {user.unlockedExercises} défis débloqués
            </p>
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-primary">
            <Star className="h-3 w-3 fill-current" aria-hidden="true" />
            {user.totalPoints}
          </span>
        </li>
      ))}
    </ol>
  )
}
