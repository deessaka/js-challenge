// /home/ekodev/Ekodev/js-challenge/inertia/components/landing/constants.tsx
import { Users, Book, Zap, Clock, Target, Award } from 'lucide-react'

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export const itemVariants = {
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

export const features = [
  {
    icon: <Users className="w-12 h-12 text-primary mx-auto mb-4" />,
    title: 'Communauté Active',
    description: 'Connectez-vous avec des développeurs partageant la même passion',
  },
  {
    icon: <Book className="w-12 h-12 text-primary mx-auto mb-4" />,
    title: 'Ressources Complètes',
    description: 'Accès à des guides et tutoriels détaillés',
  },
  {
    icon: <Zap className="w-12 h-12 text-primary mx-auto mb-4" />,
    title: 'Apprentissage Rapide',
    description: 'Progressez rapidement grâce à des défis ciblés',
  },
  {
    icon: <Clock className="w-12 h-12 text-primary mx-auto mb-4" />,
    title: 'Progression Continue',
    description: 'Suivez votre évolution et relevez de nouveaux défis',
  },
]

export const methodSections = [
  {
    icon: Book,
    title: 'Méthode 1',
    description: 'Pratiquez la programmation fonctionnelle avec map, filter, et reduce',
  },
  {
    icon: Target,
    title: 'Méthode 2',
    description: 'Maîtrisez les expressions régulières et les méthodes de manipulation de chaînes',
  },
  {
    icon: Clock,
    title: 'Méthode 3',
    description: 'Résolvez des défis de code courts et ciblés',
  },
]