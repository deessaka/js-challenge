import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@inertiajs/react'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.5 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
}

interface AuthCardProps {
  children: React.ReactNode
  title: string
  subtitle: string
  showBackButton?: boolean
  isVisible?: boolean
  maxContentHeight?: string
}

export default function AuthCard({
  children,
  title,
  subtitle,
  showBackButton = true,
  isVisible = true,
  maxContentHeight = '85vh'
}: AuthCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      exit="hidden"
      variants={overlayVariants}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen"
    >
      <motion.div
        variants={modalVariants}
        className="w-full max-w-sm bg-[#1a1f2d]/80 backdrop-blur-sm rounded-2xl shadow-2xl relative flex flex-col"
        style={{ maxHeight: maxContentHeight }}
      >
        {showBackButton && (
          <Link
            href="/"
            className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>
        )}

        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col items-center gap-2 pt-4">
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-mono text-white"
              >
                {'</>'}
              </motion.span>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-medium text-white"
              >
                {title}
              </motion.h1>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-medium text-white/80"
              >
                {subtitle}
              </motion.h2>
            </div>

            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
