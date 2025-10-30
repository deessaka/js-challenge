import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface FlashMessagesProps {
  error?: string
  success?: string
}

export default function FlashMessages({ error, success }: FlashMessagesProps) {
  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-start gap-2"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
