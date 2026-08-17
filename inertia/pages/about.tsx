import { motion } from 'framer-motion'
import { Brain, Book, Clock, Sparkles, Target, Trophy } from 'lucide-react'

import BaseLayout from '#components/layouts/base_layout'
import PageHeader from '#components/page/page_header'
import PageSection from '#components/page/page_section'
import { Badge } from '#components/ui/badge'
import { Card, CardContent } from '#components/ui/card'

const topics = [
  {
    icon: Trophy,
    title: 'Programmation fonctionnelle',
    description:
      'Maîtrisez les transformations de données avec des méthodes déclaratives et immutables.',
    tags: ['map', 'filter', 'reduce'],
  },
  {
    icon: Book,
    title: 'Expressions régulières',
    description: 'Apprenez à manipuler et valider des chaînes de caractères avec précision.',
    tags: ['match', 'test', 'replace'],
  },
  {
    icon: Clock,
    title: 'Méthodes avancées',
    description: 'Développez des algorithmes robustes avec des méthodes de tableau puissantes.',
    tags: ['every', 'some', 'find'],
  },
]

const benefits = [
  {
    icon: Brain,
    title: 'Apprentissage intelligent',
    description: 'Une progression structurée pour pratiquer les notions au bon moment.',
  },
  {
    icon: Target,
    title: 'Objectifs clairs',
    description: 'Chaque exercice est conçu autour d’une compétence concrète à maîtriser.',
  },
  {
    icon: Sparkles,
    title: 'Progression continue',
    description: 'Suivez vos acquis et débloquez progressivement de nouveaux défis.',
  },
]

export default function About() {
  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Le projet"
        title="À propos de Codojo"
        description="Un espace d’apprentissage pratique pour transformer la théorie JavaScript en réflexes de développement."
      />

      <PageSection
        title="Apprendre en construisant"
        description="Inspiré par 160 Challenges et pensé pour la pratique régulière."
      >
        <Card className="surface overflow-hidden">
          <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="eyebrow mb-4">Une pratique guidée</p>
              <h2 className="display-heading text-3xl sm:text-4xl">
                Résoudre. Comprendre. Recommencer.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                Codojo est né de la passion d’Eric Schrafstetter pour l’apprentissage du JavaScript.
                La plateforme accompagne les personnes qui cherchent un support technique concret
                pour progresser dans leurs problèmes de programmation.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Une progression visible</p>
                  <p className="text-xs text-muted-foreground">
                    Des défis courts, une boucle de feedback claire.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <PageSection
        title="Les notions au programme"
        description="Des exercices ciblés pour consolider les bases et aller plus loin."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {topics.map(({ icon: Icon, title, description, tags }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="h-full transition-transform duration-200 hover:-translate-y-1">
                <CardContent className="flex h-full flex-col p-6">
                  <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Pourquoi pratiquer ici?">
        <div className="grid gap-5 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="bg-card/70">
              <CardContent className="p-6">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  )
}

About.layout = (page: React.ReactNode) => <BaseLayout>{page}</BaseLayout>
