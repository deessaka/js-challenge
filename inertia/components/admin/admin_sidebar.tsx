import { BarChart3, BookOpen, ChevronRight, ExternalLink, Terminal, Users } from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'

import { Button } from '#components/ui/button'

const navigation = [
  { href: '/admin', label: 'Vue d’ensemble', icon: BarChart3 },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/exercises', label: 'Exercices', icon: BookOpen },
]

export default function AdminSidebar({ mobile = false }: { mobile?: boolean }) {
  const { url } = usePage()

  return (
    <aside className={mobile ? '' : 'hidden lg:block lg:w-64 lg:shrink-0'}>
      <div className={mobile ? '' : 'surface sticky top-28 rounded-sm p-3'}>
        <nav aria-label="Navigation administration" className="space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/admin' ? url === href : url.startsWith(href)
            return (
              <Button
                key={href}
                asChild
                variant={isActive ? 'navActive' : 'nav'}
                className="mb-1 w-full justify-between"
              >
                <Link href={href} aria-current={isActive ? 'page' : undefined}>
                  <span className="inline-flex items-center gap-3">
                    <Icon className="h-4 w-4" aria-hidden="true" /> {label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
                </Link>
              </Button>
            )
          })}
        </nav>
        <div className="mt-4 border-t border-foreground/10 px-3 pt-4">
          <Button asChild variant="nav" className="w-full justify-start">
            <Link href="/profile#api-token">
              <Terminal className="h-4 w-4" /> Gérer mon terminal
            </Link>
          </Button>
          <Button asChild variant="nav" className="mt-1 w-full justify-start">
            <Link href="/">
              <ExternalLink className="h-4 w-4" /> Voir le site
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}
