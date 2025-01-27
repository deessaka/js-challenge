import { motion } from 'framer-motion'
import { Link } from '@inertiajs/react'
import { ArrowRight, Info } from 'lucide-react'

type Variants = Record<string, any>

interface HeroProps {
  containerVariants: Variants
  itemVariants: Variants
}
const MotionLink = motion.create(Link)

export default function HeroSection({ containerVariants, itemVariants }: HeroProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-primary/10 to-primary/20 backdrop-blur-sm p-8 rounded-2xl border border-primary/30 text-center shadow-lg shadow-primary"
    >
      <motion.h1
        className="text-4xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Maîtrisez JavaScript avec <span className="text-primary">JS Challenge</span>
      </motion.h1>

      <motion.p
        className="text-xl text-gray-300 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Transformez votre parcours d'apprentissage avec des défis pratiques et progressifs
      </motion.p>

      <motion.div className="flex justify-center space-x-4 " variants={itemVariants}>
        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <MotionLink
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 text-lg font-bold text-white bg-primary hover:bg-primary/90 rounded-full transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Commencer
            <ArrowRight className="ml-2 h-5 w-5" />
          </MotionLink>
        </motion.div>
        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <MotionLink
            href="/about"
            className="inline-flex items-center px-6 py-3 text-lg font-bold text-primary bg-white/10 hover:bg-white/20 rounded-full transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            En savoir plus
            <Info className="ml-2 h-5 w-5" />
          </MotionLink>
        </motion.div>
      </motion.div>
    </motion.div>

  )
}