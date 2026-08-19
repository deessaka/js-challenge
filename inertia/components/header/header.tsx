import { Link, usePage } from '@inertiajs/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Code2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import UserMenu from './user_menu'
import { Button } from '#components/ui/button'
import ThemeSwitcher from '../theme/theme_switcher'
import type { SharedPageProps } from '~/types/page_props'

export interface HeaderProps {
  showNav?: boolean
  leftContent?: ReactNode
  centerContent?: ReactNode
  rightContent?: ReactNode
  className?: string
}

const MotionLink = motion.create(Link)

export default function SiteHeader({
  showNav = true,
  leftContent,
  centerContent,
  rightContent,
  className = '',
}: HeaderProps) {
  const { props, url } = usePage<SharedPageProps>()
  const authenticatedUser = props.user
  const isAuthenticated = Boolean(authenticatedUser)
  const isAdmin = authenticatedUser?.role === 'admin' || authenticatedUser?.role === 'super_admin'
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = authenticatedUser
    ? [
        { href: '/profile#api-token', label: 'Terminal' },
        { href: '/about', label: 'À propos' },
        { href: '/profile', label: 'Profil' },
        ...(isAdmin ? [{ href: '/admin', label: 'Administration' }] : []),
      ]
    : [
        { href: '/', label: 'Accueil' },
        { href: '/about', label: 'À propos' },
      ]

  const isActive = (href: string) => url === href || (href !== '/' && url.startsWith(href))

  return (
    <header
      className={`sticky top-0 z-50 border-b-2 border-foreground bg-background/95 backdrop-blur-xl ${className}`}
    >
      <nav
        className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12"
        aria-label="Navigation principale"
      >
        <div className="flex min-w-0 flex-1 items-center gap-7">
          {leftContent || (
            <MotionLink
              href="/"
              whileHover={{ y: -1 }}
              className="focus-ring flex shrink-0 items-center gap-3 rounded-md"
            >
              <span className="flex h-9 w-9 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_hsl(var(--foreground))]">
                <Code2 className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="hidden font-mono text-[15px] font-semibold uppercase tracking-[-0.03em] sm:inline">
                Codojo<span className="text-primary">_</span>
              </span>
            </MotionLink>
          )}

          {showNav && !centerContent && (
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant={isActive(link.href) ? 'navActive' : 'nav'}
                  size="nav"
                >
                  <Link href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>

        {centerContent && (
          <div className="hidden min-w-0 flex-1 justify-center md:flex">{centerContent}</div>
        )}

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          {rightContent}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <UserMenu user={authenticatedUser} />
            ) : (
              <>
                {url !== '/auth/login' && (
                  <Button asChild variant="nav" size="nav">
                    <Link href="/auth/login">Se connecter</Link>
                  </Button>
                )}
                {url !== '/auth/register' && (
                  <Button asChild>
                    <Link href="/auth/register">
                      Commencer <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>
          {showNav && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          )}
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {mobileOpen && showNav && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="border-t border-foreground/10 bg-background md:hidden"
          >
            <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-5 py-4 sm:px-8">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant={isActive(link.href) ? 'navActive' : 'nav'}
                  className="w-full justify-start"
                >
                  <Link href={link.href} onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                </Button>
              ))}
              {authenticatedUser ? (
                <div className="mt-3 border-t border-foreground/10 pt-4">
                  <p className="px-3 text-sm font-semibold">{authenticatedUser.name}</p>
                  <p className="px-3 pb-3 text-xs text-muted-foreground">
                    {authenticatedUser.email}
                  </p>
                  <Button asChild variant="destructive" className="w-full justify-start">
                    <Link
                      href="/auth/logout"
                      method="post"
                      as="button"
                      onClick={() => setMobileOpen(false)}
                    >
                      Déconnexion
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="mt-3 grid gap-2 border-t border-foreground/10 pt-4">
                  <Button asChild variant="nav" className="w-full justify-start">
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      Connexion
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                      Créer un compte
                    </Link>
                  </Button>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-4">
                <ThemeSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
