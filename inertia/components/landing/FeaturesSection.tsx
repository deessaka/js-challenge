import { motion } from 'framer-motion'
import { features } from './constants'

type Variants = Record<string, any>

interface FeaturesProps {
  containerVariants: Variants
  itemVariants: Variants
}


export const FeaturesSection = ({ containerVariants, itemVariants }: FeaturesProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-card border border-border/50 p-8 rounded-2xl shadow-lg shadow-black/5"
    >
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Votre Parcours d'Apprentissage JavaScript
        </motion.h2>

        <motion.p
          className="text-xl text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Une approche complète et interactive pour maîtriser JavaScript, conçue pour les
          développeurs de tous niveaux.
        </motion.p>

        <div className="grid md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-muted/30 border border-border/50 p-6 rounded-xl hover:bg-muted/50 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              {feature.icon}
              <h3 className="text-lg font-bold text-white text-center mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-center text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}