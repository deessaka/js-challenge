import { Link, router, useForm } from '@inertiajs/react'
import { LogOut, User, Award, ChevronDown, Zap } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '#components/ui/avatar'

type UserData = {
  id: string
  name: string
  email: string
  avatar?: string
  totalPoints?: number
}

type UserMenuProps = {
  user: UserData
}

function getInitials(name?: string) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const menuItems = [
  { href: '/profile', label: 'Mon Profil', icon: User },
  { href: '/achievements', label: 'Succès', icon: Award },
]

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { post } = useForm()

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault()
    post('/auth/logout', {
      onSuccess: () => router.visit('/auth/login'),
      onError: () => alert('Une erreur est survenue lors de la déconnexion'),
    })
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen((v) => !v)}
        className={[
          "flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all duration-200 outline-none",
          isOpen ? "bg-muted shadow-inner" : "hover:bg-muted/50"
        ].join(' ')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="relative group">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary-foreground text-[10px] font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {/* Online status indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent-light ring-2 ring-background shadow-sm" />
        </div>

        {/* User identification (name + points) for desktop */}
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
            {user.name?.split(' ')[0]}
          </span>
          {user.totalPoints !== undefined && (
            <span className="flex items-center gap-0.5 text-[11px] text-accent-light font-medium">
              <Zap className="h-2.5 w-2.5" />
              {user.totalPoints} pts
            </span>
          )}
        </div>

        <ChevronDown
          className={[
            "h-4 w-4 text-muted-foreground transition-transform duration-300",
            isOpen ? "rotate-180" : ""
          ].join(' ')}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2, ease: 'circOut' }}
            className={[
              "absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-border/50",
              "bg-gradient-to-br from-gray-900 via-gray-800/95 to-gray-900",
              "shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden ring-1 ring-white/5"
            ].join(' ')}
          >
            {/* Header info section */}
            <div className="px-5 py-4 border-b border-border/50 bg-white/[0.02]">
              <div className="flex items-center gap-3.5">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary-foreground text-xs font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate leading-snug">{user.email}</p>
                </div>
              </div>

              {/* Progress/Points badge within dropdown */}
              {user.totalPoints !== undefined && (
                <div className="mt-3.5 flex items-center justify-between rounded-xl bg-accent/5 border border-accent/10 px-3.5 py-2">
                  <span className="text-[10px] text-accent-light font-bold uppercase tracking-wider">Score Global</span>
                  <span className="flex items-center gap-1 text-sm font-bold text-accent-light">
                    <Zap className="h-4 w-4 fill-accent-light" />
                    {user.totalPoints}
                  </span>
                </div>
              )}
            </div>

            {/* Main navigation items */}
            <div className="p-2 space-y-0.5">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all group"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-light transition-colors" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Logout action */}
            <div className="p-2 border-t border-border/50 bg-white/[0.01]">
              <form onSubmit={handleLogout}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all group"
                >
                  <LogOut className="h-4 w-4 group-hover:text-destructive transition-colors" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
