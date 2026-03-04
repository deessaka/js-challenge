import { motion } from 'framer-motion'
import { methodSections } from './constants'

type Variants = Record<string, any>

interface MethodSectionProps {
  containerVariants: Variants
  itemVariants: Variants
}


export const MethodSection = ({ containerVariants, itemVariants }: MethodSectionProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-card border border-border/50 p-8 rounded-2xl shadow-lg shadow-black/5"
    >
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Votre Parcours d'Apprentissage Personnalisé
        </motion.h2>

        <motion.p
          className="text-xl text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Progressez à votre rythme avec des défis adaptés à votre niveau. Chaque exercice est
          conçu pour renforcer vos compétences JavaScript de manière progressive et engageante.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-4">
          {methodSections.map((method, index) => (
            <motion.div
              key={index}
              className="bg-muted/30 border border-border/50 p-4 rounded-xl hover:bg-muted/50 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <method.icon className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white text-center">{method.title}</h3>
              <p className="text-muted-foreground text-center text-sm">
                {method.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}