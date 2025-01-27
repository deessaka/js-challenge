import { motion } from 'framer-motion'
import { ArrowRight, Book, Clock, Trophy } from 'lucide-react'
import { Link } from '@inertiajs/react'

type Variants = Record<string, any>

interface ChallengeSectionProps {
  containerVariants: Variants
  itemVariants: Variants
}

const MotionLink = motion.create(Link)

export const ChallengeSection = ({ containerVariants, itemVariants }: ChallengeSectionProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-[#1a1a2e] p-8 rounded-xl"
    >
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] opacity-30 z-0"></div>

      <motion.div
        className="relative z-10 grid md:grid-cols-2 gap-8 items-center"
        variants={itemVariants}
      >
        {/* Explication et Méthodes */}
        <div className="space-y-6">
          <motion.h2
            className="text-3xl font-bold text-[#e94560] mb-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Apprenez JavaScript Comme un Pro
          </motion.h2>

          <div className="space-y-4 text-[#f0f0f0]">
            <div className="flex items-start space-x-3">
              <Book className="w-6 h-6 text-[#e94560] flex-shrink-0 mt-1" />
              <p>
                <span className="font-bold text-[#e94560]">Méthode 1:</span>
                Pratiquez la programmation fonctionnelle avec <code>map</code>, <code>filter</code>,
                et <code>reduce</code>
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <Trophy className="w-6 h-6 text-[#e94560] flex-shrink-0 mt-1" />
              <p>
                <span className="font-bold text-[#e94560]">Méthode 2:</span>
                Maîtrisez les expressions régulières et les méthodes de manipulation de chaînes
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-6 h-6 text-[#e94560] flex-shrink-0 mt-1" />
              <p>
                <span className="font-bold text-[#e94560]">Méthode 3:</span>
                Résolvez des défis de code courts et ciblés
              </p>
            </div>
          </div>

          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <MotionLink
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 bg-[#e94560] text-white rounded-full hover:bg-[#ff6b81] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Commencer
              <ArrowRight className="ml-2 h-5 w-5" />
            </MotionLink>
          </motion.div>
        </div>

        {/* Exemple de Code Rétro */}
        <div className="bg-[#0f3460] p-6 font-mono text-sm rounded-2xl">
          <pre className="text-[#f0f0f0] overflow-x-auto">
            <code>
              {`// Exemple : Transformation de données
const developers = [
{ name: 'Alice', level: 'Junior' },
{ name: 'Bob', level: 'Senior' }
];

// Utilisation de map pour transformer
const enhancedDevelopers = developers.map(dev => ({
...dev,
skills: dev.level === 'Senior'
? ['Advanced JavaScript']
: ['Basic JavaScript']
}));

console.log(enhancedDevelopers);
// Résultat: Un tableau transformé avec des compétences`}
            </code>
          </pre>
        </div>
      </motion.div>
    </motion.div>
  )
}
