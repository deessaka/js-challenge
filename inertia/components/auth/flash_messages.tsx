import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

import { Alert, AlertDescription } from '#components/ui/alert'

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
          className="mt-6"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {success && (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-6"
        >
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
