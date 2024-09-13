import { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/components/ui/avatar'
import { TrophyIcon } from 'lucide-react'
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
    return users?.slice(0, 10)
  }, [users])
  return (
    <div className="container mx-auto py-4 px-2 flex flex-col flex-1 gap-4 mt-4 snap-y snap-mandatory overflow-y-auto max-h-[34vh] scroll-m-1 scroll-ml-7">
      {topUsers?.map((user, index) => (
        <div
          key={user.id}
          className="snap-always snap-center flex items-center gap-4 justify-stretch py-2 px-3 border-l-4 border-accent-content-light dark:border-primary-light rounded-l-lg flex-1 w-full max-h-9"
        >
          <div className="font-medium">{index + 1}</div>
          <div className="flex items-center flex-1 gap-2">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="text-sm font-dmItalic dark:bg-primary-dark/70">
                {user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold">{user.username}</span>
          </div>
          {index === 0 && <TrophyIcon size={20} className="text-yellow-400" />}
          <div className="text-right">
            <span className="box-decoration-slice bg-gradient-to-r from-primary-dark to-accent-dark text-white px-2 font-bold">
              {user.unlockedExercises || 0} done
            </span>
          </div>
          <div className="text-right font-extrabold">
            {user.totalPoints! > 0 ? `${user.totalPoints} pts` : '0 pt'}
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserLeaderboard
