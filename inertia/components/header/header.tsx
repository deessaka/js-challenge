import { Link, usePage } from '@inertiajs/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Code2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import UserMenu from './user_menu'
import { Button } from '#components/ui/button'
import ThemeSwitcher from '../theme/theme_switcher'

export interface HeaderProps {
  showNav?: boolean
  leftContent?: ReactNode
  centerContent?: ReactNode
  rightContent?: ReactNode
  className?: string
}

const MotionLink = motion(Link)

export default function SiteHeader({
  showNav = true,
  leftContent,
  centerContent,
  rightContent,
  className = '',
}: HeaderProps) {
  const { props, url } = usePage<{ user?: { username?: string; email?: string } }>()
  const authenticatedUser = props.user
  const isAuthenticated = Boolean(authenticatedUser)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = isAuthenticated
    ? [
        { href: '/home', label: 'Explorer' },
        { href: '/about', label: 'À propos' },
      ]
    : [
        { href: '/', label: 'Accueil' },
        { href: '/about', label: 'À propos' },
      ]

  const isActive = (href: string) => url === href || (href !== '/' && url.startsWith(href))

  return (
    <header
      className={`sticky top-0 z-50 border-b border-foreground/10 bg-background/90 backdrop-blur-xl ${className}`}
    >
      <nav
        className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12"
        aria-label="Navigation principale"
      >
        <div className="flex min-w-0 flex-1 items-center gap-7">
          {leftContent || (
            <MotionLink
              href={isAuthenticated ? '/home' : '/'}
              whileHover={{ y: -1 }}
              className="focus-ring flex shrink-0 items-center gap-3 rounded-md"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
                <Code2 className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="hidden text-[17px] font-semibold tracking-[-0.03em] sm:inline">
                Codojo
              </span>
            </MotionLink>
          )}

          {showNav && !centerContent && (
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`focus-ring rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive(link.href)
                      ? 'bg-foreground/7 text-foreground'
                      : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                  }`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {centerContent && (
          <div className="hidden min-w-0 flex-1 justify-center md:flex">{centerContent}</div>
        )}

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          {rightContent}
          <div className="hidden items-center gap-2 sm:flex">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <UserMenu user={authenticatedUser} />
            ) : (
              <>
                {url !== '/auth/login' && (
                  <Link
                    href="/auth/login"
                    className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    Se connecter
                  </Link>
                )}
                {url !== '/auth/register' && (
                  <Button
                    asChild
                    className="rounded-full bg-foreground text-background hover:bg-foreground/90"
                  >
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
              className="rounded-full sm:hidden"
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
            className="border-t border-foreground/10 bg-background sm:hidden"
          >
            <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-5 py-4 sm:px-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`focus-ring rounded-lg px-3 py-3 text-sm font-semibold ${isActive(link.href) ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-4">
                <ThemeSwitcher />
                {!isAuthenticated && (
                  <Button asChild className="rounded-full">
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                      Commencer
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
