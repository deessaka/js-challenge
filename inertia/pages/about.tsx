import BaseLayout from '#components/layouts/base_layout'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Target, Book, Trophy, Clock } from 'lucide-react'

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
      type: 'spring' as const,
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
        {/* Section Inspiration et Motivation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 bg-gradient-to-br from-primary/10 to-primary/20 backdrop-blur-sm p-8 rounded-2xl border border-primary/30 shadow-xl shadow-primary/5"
        >
          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2
              className="text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Inspiré par 160 Challenges
            </motion.h2>

            <motion.p
              className="text-xl text-gray-300 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Un projet né de la passion d'Eric Schrafstetter pour l'apprentissage du JavaScript.
              Conçu pour les étudiants qui cherchent un support technique pour résoudre leurs problèmes de programmation.
            </motion.p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <motion.div
                className="bg-white/15 p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all shadow-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white text-center mb-3">
                  Programmation Fonctionnelle
                </h3>
                <p className="text-gray-300 text-center text-sm leading-relaxed">
                  Maîtrisez les transformations de données avec des méthodes déclaratives et immutables.
                </p>
                <div className="mt-3 flex justify-center flex-wrap gap-2">
                  <span className="bg-primary/20 text-primary-foreground font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">map</span>
                  <span className="bg-primary/20 text-primary-foreground font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">filter</span>
                  <span className="bg-primary/20 text-primary-foreground font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">reduce</span>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/15 p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all shadow-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Book className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white text-center mb-3">
                  Expressions Régulières
                </h3>
                <p className="text-gray-300 text-center text-sm leading-relaxed">
                  Apprenez à manipuler et valider des chaînes de caractères avec précision.
                </p>
                <div className="mt-3 flex justify-center flex-wrap gap-2">
                  <span className="bg-primary/20 text-primary-foreground font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">match</span>
                  <span className="bg-primary/20 text-primary-foreground font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">test</span>
                  <span className="bg-primary/20 text-primary-foreground font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">replace</span>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/15 p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all shadow-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white text-center mb-3">
                  Méthodes Avancées
                </h3>
                <p className="text-gray-300 text-center text-sm leading-relaxed">
                  Développez des algorithmes robustes avec des méthodes de tableau puissantes.
                </p>
                <div className="mt-3 flex justify-center flex-wrap gap-2">
                  <span className="bg-primary/20 text-primary-foreground font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">every</span>
                  <span className="bg-primary/20 text-primary-foreground font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">some</span>
                  <span className="bg-primary/20 text-primary-foreground font-semibold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">find</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
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
              backgroundColor: 'rgba(255,255,255,0.12)',
              transition: { duration: 0.2 },
            }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-center border border-white/5 hover:border-white/20 transition-all shadow-xl"
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
              className="text-gray-300 text-sm leading-relaxed"
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

About.layout = (page: any) => (
  <BaseLayout
    headerProps={{
      centerContent: (
        <h1 className="text-lg font-bold text-white tracking-tight">
          À propos
        </h1>
      ),
      showNav: true
    }}
  >
    {page}
  </BaseLayout>
)
