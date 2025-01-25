import { Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Code2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import UserMenu from './user_menu'
import { SharedData } from '@adonisjs/inertia/types'

interface HeaderProps extends SharedData {
  user: any
}

const publicLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/about', label: 'À propos' },
]

export default function Header() {
  const { props } = usePage<HeaderProps>()
  const authenticatedUser = props.user?.$original
  const isAuthenticated = !!authenticatedUser

  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Code2 className="h-8 w-8 " />
              <span className="text-2xl font-bold">JS Challenge</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              {!isAuthenticated &&
                publicLinks.map((link) => (
                  <motion.div key={link.href} whileHover={{ scale: 1.05 }}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
            </div>

            {/* Auth Buttons or User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-300">{authenticatedUser?.email}/</span>
                <UserMenu user={authenticatedUser} />
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-full bg-primary border border-white text-white hover:bg-primary/90 transition-colors text-center"
                >
                  Commencer
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-sm py-4 px-4"
          >
            <div className="flex flex-col gap-4">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full bg-primary hover:bg-primary/90 transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Commencer
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
}
