import { Link, useForm, usePage } from '@inertiajs/react'
import {
  Activity,
  BookOpen,
  ChevronRight,
  Code2,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings2,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '#components/ui/avatar'
import { Badge } from '#components/ui/badge'
import { Button } from '#components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '#components/ui/sheet'
import ThemeProvider from '#components/ui/components/theme_provider'
import DeviceDetector from '#components/device-detector/mb_check'
import Notifications from '#components/notifications/notifications'
import PageProgress from '#components/loader/page_progress'
import { cn } from '~/lib/utils'

interface DashboardUser {
  username?: string
  name?: string
  email?: string
  avatar?: string
  role?: string
  totalPoints?: number
}

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  eyebrow?: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

const navigation = [
  { href: '/home', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { href: '/home#path', label: 'Mon parcours', icon: BookOpen },
  { href: '/home#activity', label: 'Activité', icon: Activity },
]

function initials(user: DashboardUser) {
  return (user.name || user.username || user.email || '?')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function SidebarContent({ user, onNavigate }: { user: DashboardUser; onNavigate?: () => void }) {
  const { url } = usePage()
  const { post } = useForm()
  const displayName = user.name || user.username || user.email || 'Utilisateur'
  const isAdmin = user.role === 'admin' || user.role === 'super_admin'

  const handleLogout = () => {
    post('/auth/logout', { onSuccess: () => router.visit('/auth/login') })
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-3 px-4 py-5 lg:px-5">
        <Link
          href="/home"
          onClick={onNavigate}
          className="focus-ring flex min-w-0 items-center gap-3 rounded-xl"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_0_5px_hsl(var(--primary)/0.12)]">
            <Code2 className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="truncate text-base font-semibold tracking-[-0.03em]">Codojo</span>
        </Link>
        <Badge
          variant="outline"
          className="hidden border-primary/20 bg-primary/5 text-[10px] uppercase tracking-[0.14em] text-primary xl:inline-flex"
        >
          Beta
        </Badge>
      </div>

      <div className="px-4 pb-4 lg:px-5">
        <div className="rounded-2xl border border-border/70 bg-muted/45 px-3 py-2.5">
          <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_hsl(var(--accent)/0.12)]" />
            Espace personnel
          </div>
          <p className="mt-1 truncate text-sm font-semibold">Votre dojo est prêt</p>
        </div>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 lg:px-4"
        aria-label="Navigation du dashboard"
      >
        <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Workspace
        </p>
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = href === '/home' ? url === '/home' : url.includes(href.split('#')[0])
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                'focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{label}</span>
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60',
                  active && 'opacity-60'
                )}
                aria-hidden="true"
              />
            </Link>
          )
        })}

        <p className="px-3 pb-2 pt-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Compte
        </p>
        <Link
          href="/profile"
          onClick={onNavigate}
          className={cn(
            'focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
            url.startsWith('/profile')
              ? 'bg-foreground text-background shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">Profil & CLI</span>
          <ChevronRight
            className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60"
            aria-hidden="true"
          />
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className={cn(
              'focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              url.startsWith('/admin')
                ? 'bg-foreground text-background shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Settings2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="flex-1">Administration</span>
            <ChevronRight
              className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60"
              aria-hidden="true"
            />
          </Link>
        )}
      </nav>

      <div className="border-t border-border/70 p-3 lg:p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-2.5">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user.avatar} alt="" />
            <AvatarFallback className="bg-primary/12 text-xs font-semibold text-primary">
              {initials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            aria-label="Se déconnecter"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
  title,
  eyebrow = 'Codojo workspace',
  description,
  actions,
  className,
}: DashboardLayoutProps) {
  const { props } = usePage<{ user?: DashboardUser }>()
  const user = props.user || {}
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <ThemeProvider defaultTheme="light" storageKey="js-challenge-theme">
      <DeviceDetector>
        <div className="site-shell min-h-screen overflow-x-hidden">
          <PageProgress />
          <Notifications />
          <a
            href="#main-content"
            className="focus-ring sr-only z-[100] rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
          >
            Aller au contenu
          </a>
          <div className="flex min-h-screen">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-border/70 bg-background/88 backdrop-blur-xl lg:block">
              <SidebarContent user={user} />
            </aside>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetContent side="left" className="w-[280px] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Codojo</SheetTitle>
                  <SheetDescription>Accéder aux sections de votre espace Codojo.</SheetDescription>
                </SheetHeader>
                <SidebarContent user={user} onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <main id="main-content" className="min-w-0 flex-1 lg:pl-[260px]">
              <div className="border-b border-border/60 bg-background/65 backdrop-blur-xl">
                <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center gap-4 px-4 py-4 sm:px-7 lg:px-10">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-xl lg:hidden"
                    aria-label="Ouvrir la navigation"
                    onClick={() => setMobileOpen(true)}
                  >
                    <Menu className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <div className="min-w-0 flex-1">
                    <p className="eyebrow truncate text-[10px]">{eyebrow}</p>
                    {title && (
                      <h1 className="mt-1 truncate text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                        {title}
                      </h1>
                    )}
                    {description && (
                      <p className="mt-1 hidden max-w-2xl truncate text-sm text-muted-foreground sm:block">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">{actions}</div>
                  <Link
                    href="/profile"
                    className="focus-ring hidden items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-2.5 py-2 text-sm font-medium sm:flex"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatar} alt="" />
                      <AvatarFallback className="bg-primary/12 text-[10px] font-semibold text-primary">
                        {initials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-[120px] truncate md:inline">
                      {user.name || user.username || 'Profil'}
                    </span>
                  </Link>
                </div>
              </div>
              <div
                className={cn(
                  'mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10',
                  className
                )}
              >
                {children}
              </div>
            </main>
          </div>
        </div>
      </DeviceDetector>
    </ThemeProvider>
  )
}
