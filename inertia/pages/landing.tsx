import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { Trophy, Clock, Users, Zap, ArrowRight } from 'lucide-react'
import PublicLayout from '#components/layouts/public_layout'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.6
    }
  }
}

export default function Landing() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center mb-16"
      >
        <motion.h1
          className="text-5xl font-bold text-white mb-6"
          variants={itemVariants}
        >
          Maîtrisez JavaScript avec{' '}
          <span className="text-primary">JS Challenge</span>
        </motion.h1>
        <motion.p
          className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          variants={itemVariants}
        >
          Améliorez vos compétences en JavaScript à travers des exercices
          pratiques et des défis stimulants. Apprenez en faisant !
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
            >
              Commencer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              En savoir plus
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {[
          {
            icon: <Trophy className="w-12 h-12 text-primary mb-4" />,
            title: "Défis Progressifs",
            description: "Des exercices adaptés à tous les niveaux pour progresser à votre rythme"
          },
          {
            icon: <Clock className="w-12 h-12 text-primary mb-4" />,
            title: "Apprentissage Rapide",
            description: "Des exercices courts et ciblés pour apprendre efficacement"
          },
          {
            icon: <Users className="w-12 h-12 text-primary mb-4" />,
            title: "Communauté Active",
            description: "Échangez avec d'autres apprenants et partagez vos solutions"
          },
          {
            icon: <Zap className="w-12 h-12 text-primary mb-4" />,
            title: "Feedback Instantané",
            description: "Recevez des retours immédiats sur vos solutions pour progresser rapidement"
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.08)",
              transition: { duration: 0.2 }
            }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                duration: 0.6,
                delay: index * 0.1 + 0.3
              }}
            >
              {feature.icon}
            </motion.div>
            <motion.h3
              className="text-xl font-semibold text-white mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
            >
              {feature.title}
            </motion.h3>
            <motion.p
              className="text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
            >
              {feature.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

Landing.layout = (page: any) => <PublicLayout>{page}</PublicLayout>
