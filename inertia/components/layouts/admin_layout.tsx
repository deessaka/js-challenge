import { BarChart3, BookOpen, ChevronRight, ShieldCheck, Users } from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import BaseLayout from '#components/layouts/base_layout'
import FlashMessages from '#components/auth/flash_messages'

type AdminLayoutProps = {
  title: string
  eyebrow?: string
  children: ReactNode
}

export default function AdminLayout({
  title,
  eyebrow = 'Administration',
  children,
}: AdminLayoutProps) {
  const { flash } = usePage().props as any

  const navigation = [
    { href: '/admin', label: 'Vue d’ensemble', icon: BarChart3 },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin/exercises', label: 'Exercices', icon: BookOpen },
  ]

  return (
    <BaseLayout>
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:flex-row lg:px-12 lg:py-12">
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
              {navigation.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="focus-ring flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground"
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="h-4 w-4" aria-hidden="true" /> {label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-foreground/10 px-3 pt-4">
              <Link
                href="/home"
                className="focus-ring text-xs font-semibold text-primary hover:underline"
              >
                Retour à l’application
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6">
            <p className="eyebrow mb-3">{eyebrow}</p>
            <h1 className="display-heading text-4xl sm:text-5xl">{title}</h1>
          </div>
          <FlashMessages error={flash?.error} success={flash?.success} />
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </BaseLayout>
  )
}
