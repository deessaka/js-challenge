import { BarChart3, BookOpen, ChevronRight, ShieldCheck, Users } from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'

import { cn } from '~/lib/utils'

const navigation = [
  { href: '/admin', label: 'Vue d’ensemble', icon: BarChart3 },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/exercises', label: 'Exercices', icon: BookOpen },
]

export default function AdminSidebar() {
  const { url } = usePage()

  return (
    <aside className="lg:w-64 lg:shrink-0">
      <div className="surface sticky top-28 rounded-2xl p-3">
        <div className="mb-3 flex items-center gap-3 px-3 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">Console admin</p>
            <p className="text-xs text-muted-foreground">Pilotage de JS Challenge</p>
          </div>
        </div>
        <nav aria-label="Navigation administration" className="space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/admin' ? url === href : url.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'focus-ring flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                )}
              >
                <span className="inline-flex items-center gap-3">
                  <Icon className="h-4 w-4" aria-hidden="true" /> {label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
              </Link>
            )
          })}
        </nav>
        <div className="mt-4 border-t border-foreground/10 px-3 pt-4">
          <Link href="/home" className="focus-ring text-xs font-semibold text-primary hover:underline">
            Retour à l’application
          </Link>
        </div>
      </div>
    </aside>
  )
}
