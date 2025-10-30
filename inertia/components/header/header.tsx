import { Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import UserMenu from './user_menu'
import { SharedData } from '@adonisjs/inertia/types'

interface HeaderProps extends SharedData {
  user: any
}

const publicLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/about', label: 'À propos' },
]
const MotionLink = motion.create(Link)

export default function Header() {
  const { props } = usePage<HeaderProps>()
  const authenticatedUser = props.user?.$original
  const isAuthenticated = !!authenticatedUser

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 bg-gradient-to-br from-primary/10 to-primary/20 backdrop-blur-sm"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <MotionLink href="/" className="flex items-center gap-2 text-white">
              <Code2 className="h-8 w-8 " />
              <span className="text-2xl font-bold">JS Challenge</span>
            </MotionLink>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {!isAuthenticated &&
                publicLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MotionLink
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </MotionLink>
                  </motion.div>
                ))}
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <UserMenu user={authenticatedUser} />
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <MotionLink
                  href="/auth/login"
                  className="px-4 py-2 rounded-full bg-primary border border-white text-white hover:bg-primary/90 transition-colors text-center"
                >
                  Commencer
                </MotionLink>
              </motion.div>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
