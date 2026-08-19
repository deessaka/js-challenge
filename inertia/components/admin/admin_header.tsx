import { Link, usePage } from '@inertiajs/react'
import { Code2, Menu, ShieldCheck } from 'lucide-react'

import AdminSidebar from '#components/admin/admin_sidebar'
import ThemeSwitcher from '#components/theme/theme_switcher'
import UserMenu from '#components/header/user_menu'
import { Button } from '#components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '#components/ui/sheet'
import type { SharedPageProps } from '~/types/page_props'

export default function AdminHeader() {
  const { props } = usePage<SharedPageProps>()
  const user = props.user!

  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/admin" className="focus-ring flex items-center gap-3 rounded-md font-semibold">
          <span className="flex h-9 w-9 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_hsl(var(--foreground))]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-mono uppercase">Console Codojo_</span>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="nav" size="nav">
            <Link href="/profile#api-token">Profil terminal</Link>
          </Button>
          <Button asChild variant="nav" size="nav">
            <Link href="/">
              <Code2 className="h-4 w-4" /> Voir le site
            </Link>
          </Button>
          <ThemeSwitcher />
          <UserMenu user={user} />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Ouvrir la navigation administration"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto md:hidden">
            <SheetTitle>Console Codojo</SheetTitle>
            <div className="mt-6">
              <AdminSidebar mobile />
            </div>
            <div className="mt-6 space-y-2 border-t pt-5">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm">Thème</span>
                <ThemeSwitcher />
              </div>
              <Button asChild variant="destructive" className="w-full justify-start">
                <Link href="/auth/logout" method="post" as="button">
                  Déconnexion
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
