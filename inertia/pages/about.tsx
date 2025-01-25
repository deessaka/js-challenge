import BaseLayout from '#components/layouts/base_layout'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Target } from 'lucide-react'

const features = [
  {
    icon: <Brain className="w-12 h-12 text-primary" />,
    title: 'Apprentissage Intelligent',
    description:
      "Notre plateforme s'adapte à votre niveau et vous propose des exercices personnalisés.",
  },
  {
    icon: <Target className="w-12 h-12 text-primary" />,
    title: 'Objectifs Clairs',
    description: "Chaque exercice est conçu avec des objectifs d'apprentissage spécifiques.",
  },
  {
    icon: <Sparkles className="w-12 h-12 text-primary" />,
    title: 'Progression Continue',
    description:
      'Suivez votre progression et débloquez de nouveaux défis au fil de votre apprentissage.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      duration: 0.6,
    },
  },
}

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="text-center mb-16"
      >
        <motion.h1
          className="text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          À propos
        </motion.h1>
        <motion.p
          className="text-lg text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          JS Challenge est une plateforme d'apprentissage interactive dédiée au JavaScript. Notre
          objectif est de vous aider à maîtriser JavaScript à travers des exercices pratiques et des
          défis stimulants.
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              backgroundColor: 'rgba(255,255,255,0.08)',
              transition: { duration: 0.2 },
            }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl text-center"
          >
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                duration: 0.6,
                delay: index * 0.1 + 0.3,
              }}
            >
              {feature.icon}
            </motion.div>
            <motion.h3
              className="text-xl font-semibold text-white mb-3"
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

About.layout = (page: any) => <BaseLayout>{page}</BaseLayout>
