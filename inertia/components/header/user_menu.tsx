import { useForm, Link, router } from '@inertiajs/react'
import { ChevronDown, LogOut, UserRound, Award, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/avatar'

type UserData = {
  id: string
  name?: string
  username?: string
  email: string
  avatar?: string
  totalPoints?: number
}
type UserMenuProps = { user: UserData }

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
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { post } = useForm()
  const displayName = user.name || user.username || user.email

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleLogout = (event: React.FormEvent) => {
    event.preventDefault()
    post('/auth/logout', { onSuccess: () => router.visit('/auth/login') })
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="focus-ring inline-flex items-center gap-2 rounded-full border border-foreground/10 px-2 py-1.5 transition-colors duration-150 hover:bg-foreground/5"
      >
        <Avatar className="h-7 w-7">
          <AvatarImage src={user.avatar} alt="" />
          <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[100px] truncate text-sm font-semibold sm:inline">
          {displayName.split(' ')[0]}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          role="menu"
          className="surface absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl bg-background shadow-2xl"
        >
          <div className="border-b border-foreground/10 px-4 py-4">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
            {user.totalPoints !== undefined && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/8 px-3 py-2 text-xs">
                <span className="text-muted-foreground">Score global</span>
                <span className="inline-flex items-center gap-1 font-mono font-medium text-primary">
                  <Zap className="h-3 w-3 fill-current" aria-hidden="true" />
                  {user.totalPoints}
                </span>
              </div>
            )}
          </div>
          <div className="p-2">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" /> Mon profil
            </Link>
            <Link
              href="/achievements"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground"
            >
              <Award className="h-4 w-4" aria-hidden="true" /> Succès
            </Link>
          </div>
          <div className="border-t border-foreground/10 p-2">
            <form onSubmit={handleLogout}>
              <button
                type="submit"
                className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" /> Déconnexion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
