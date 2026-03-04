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
      className="relative overflow-hidden bg-card border border-border/50 p-8 rounded-2xl shadow-xl"
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-slate-900/[0.04] opacity-30 z-0 pointer-events-none"></div>

      <motion.div
        className="relative z-10 grid md:grid-cols-2 gap-12 items-center"
        variants={itemVariants}
      >
        {/* Explication et Méthodes */}
        <div className="space-y-8">
          <div className="space-y-4">
            <motion.h2
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Apprenez JavaScript <br />
              <span className="text-accent-light">Comme un Pro</span>
            </motion.h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Une méthode interactive basée sur la pratique réelle et les meilleures conventions de l'industrie.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start space-x-4 group">
              <div className="p-2 rounded-lg bg-accent/20 ring-1 ring-accent/30 group-hover:ring-accent/50 transition-all">
                <Book className="w-5 h-5 text-accent-light" />
              </div>
              <p className="text-foreground/90">
                <span className="font-bold text-accent-light">Méthode 1:</span>{" "}
                Pratiquez la programmation fonctionnelle avec <code>map</code>, <code>filter</code>,
                et <code>reduce</code>.
              </p>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="p-2 rounded-lg bg-accent/20 ring-1 ring-accent/30 group-hover:ring-accent/50 transition-all">
                <Trophy className="w-5 h-5 text-accent-light" />
              </div>
              <p className="text-foreground/90">
                <span className="font-bold text-accent-light">Méthode 2:</span>{" "}
                Maîtrisez les expressions régulières et les méthodes de manipulation de chaînes.
              </p>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="p-2 rounded-lg bg-accent/20 ring-1 ring-accent/30 group-hover:ring-accent/50 transition-all">
                <Clock className="w-5 h-5 text-accent-light" />
              </div>
              <p className="text-foreground/90">
                <span className="font-bold text-accent-light">Méthode 3:</span>{" "}
                Résolvez des défis de code courts et ciblés pour une progression rapide.
              </p>
            </div>
          </div>

          <motion.div
            className="flex items-center gap-4 pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <MotionLink
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Commencez maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </MotionLink>
          </motion.div>
        </div>

        {/* Exemple de Code Rétro */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-primary/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-muted/90 backdrop-blur border border-white/10 p-6 font-mono text-sm rounded-2xl shadow-2xl overflow-hidden">
            {/* Window controls */}
            <div className="flex gap-1.5 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            </div>
            <pre className="text-foreground/80 overflow-x-auto leading-relaxed">
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

console.log(enhancedDevelopers);`}
              </code>
            </pre>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
