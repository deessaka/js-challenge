import { Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Menu, X } from 'lucide-react'
import UserMenu from './user_menu'
import { useState } from 'react'
import ThemeSwitcher from '../theme/theme_switcher'

export interface HeaderProps {
  user?: any
  showNav?: boolean
  leftContent?: React.ReactNode
  centerContent?: React.ReactNode
  rightContent?: React.ReactNode
  className?: string
  [key: string]: any
}

const MotionLink = motion.create(Link)

export default function Header({
  showNav = true,
  leftContent,
  centerContent,
  rightContent,
  className
}: HeaderProps) {
  const { props, url } = usePage<any>()
  const authenticatedUser = props.user
  const isAuthenticated = !!authenticatedUser
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentPublicLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/about', label: 'À propos' },
  ]

  const currentAuthLinks = [
    { href: '/home', label: 'Console' },
    { href: '/about', label: 'À propos' },
  ]

  const navLinks = isAuthenticated ? currentAuthLinks : currentPublicLinks

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={[
        "sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl shrink-0",
        className
      ].join(' ')}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Left Side: Logo or Custom content */}
          <div className="flex items-center gap-4 flex-1">
            {leftContent || (
              <MotionLink
                href={isAuthenticated ? "/home" : "/"}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 text-foreground shrink-0"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 ring-1 ring-accent/40">
                  <Code2 className="h-5 w-5 text-accent-light" />
                </div>
                <span className="text-xl font-bold tracking-tight hidden sm:inline-block">
                  JS <span className="text-accent-light">Challenge</span>
                </span>
              </MotionLink>
            )}

            {/* Desktop nav links - Only if showNav is true and no centerContent */}
            {showNav && !centerContent && (
              <div className="hidden md:flex items-center gap-1 ml-4">
                {navLinks.map((link) => {
                  const isActive =
                    url === link.href || (link.href !== '/' && url.startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={[
                        'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                      ].join(' ')}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg bg-muted"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Center Content Slot */}
          {centerContent && (
            <div className="flex-1 flex justify-center overflow-hidden">
              {centerContent}
            </div>
          )}

          {/* Right side Actions */}
          <div className="flex items-center justify-end gap-3 flex-1">
            {rightContent}
            {isAuthenticated ? (
              <UserMenu user={authenticatedUser} />
            ) : (
              <div className="hidden md:flex items-center gap-3">
                {url !== '/auth/login' && (
                  <MotionLink
                    href="/auth/login"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Connexion
                  </MotionLink>
                )}
                {url !== '/auth/register' && (
                  <MotionLink
                    href="/auth/register"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    Commencer
                  </MotionLink>
                )}
              </div>
            )}

            {/* Mobile hamburger - Only if nav is enabled */}
            {showNav && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/50 bg-background shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  url === link.href || (link.href !== '/' && url.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                )
              })}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/50">
                  {url !== '/auth/login' && (
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground text-center rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      Connexion
                    </Link>
                  )}
                  {url !== '/auth/register' && (
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 text-sm font-semibold text-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Commencer
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
