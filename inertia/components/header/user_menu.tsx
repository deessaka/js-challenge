import { Link, useForm } from '@inertiajs/react'
import { Award, ChevronDown, LogOut, UserRound, Zap } from 'lucide-react'
import type { SessionUser } from '~/types/page_props'
import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/avatar'
import { Button } from '#components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu'

type UserMenuProps = { user: SessionUser }

function getInitials(name?: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function UserMenu({ user }: UserMenuProps) {
  const { post } = useForm()
  const displayName = user.name || user.email

  function handleLogout() {
    post('/auth/logout')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 gap-2 rounded-full px-2 sm:px-3">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.avatar} alt="" />
            <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[100px] truncate text-sm font-semibold sm:inline">
            {displayName.split(' ')[0]}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl">
        <DropdownMenuLabel className="px-3 py-3">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          <p className="mt-1 truncate text-xs font-normal text-muted-foreground">{user.email}</p>
          {user.totalPoints !== undefined && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/8 px-3 py-2 text-xs font-normal">
              <span className="text-muted-foreground">Score global</span>
              <span className="inline-flex items-center gap-1 font-mono font-medium text-primary">
                <Zap className="h-3 w-3 fill-current" aria-hidden="true" />
                {user.totalPoints}
              </span>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(user.role === 'admin' || user.role === 'super_admin') && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="font-semibold text-primary">
              <Award className="h-4 w-4" aria-hidden="true" />
              Panel d’administration
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/profile#api-token">
            <UserRound className="h-4 w-4" aria-hidden="true" />
            Mon profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
