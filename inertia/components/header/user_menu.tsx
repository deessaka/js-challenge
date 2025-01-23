import { Link } from '@inertiajs/react'
import { ChevronDown, LogOut, User, Award } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type User = {
  email: string
  id: number
  name: string
}

type UserMenuProps = {
  user: User
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{user.name}</span>
        <ChevronDown className="h-4 w-4" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 mt-2 w-48 rounded-md bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-20"
            >
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Profil</span>
              </Link>
              <Link
                href="/achievements"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <Award className="h-4 w-4" />
                <span>Succès</span>
              </Link>
              <form 
                action="/logout" 
                method="POST"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
