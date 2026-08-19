import { Link, usePage } from '@inertiajs/react'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Gauge,
  Github,
  Sparkles,
  Terminal,
} from 'lucide-react'

import BaseLayout from '#components/layouts/base_layout'
import { Badge } from '#components/ui/badge'
import { Button } from '#components/ui/button'
import { Card, CardContent } from '#components/ui/card'
import type { SharedPageProps } from '~/types/page_props'

const steps = [
  {
    number: '01',
    title: 'Installez Codojo',
    text: 'Installez la CLI depuis npm et gardez votre environnement de travail dans le terminal.',
  },
  {
    number: '02',
    title: 'Connectez votre compte',
    text: 'Générez un token depuis ce portail puis utilisez codojo login.',
  },
  {
    number: '03',
    title: 'Codez dans le terminal',
    text: 'Testez, validez et débloquez la suite sans quitter votre workflow.',
  },
]

const benefits = [
  {
    icon: Gauge,
    title: 'Des formats courts',
    text: 'Des exercices ciblés pour pratiquer même quand vous n’avez que quinze minutes.',
  },
  {
    icon: Sparkles,
    title: 'Un feedback immédiat',
    text: 'Lancez votre code et voyez rapidement ce qui fonctionne avant de valider.',
  },
  {
    icon: Github,
    title: 'Une progression visible',
    text: 'Défis débloqués, points gagnés et classement : gardez le rythme sans pression.',
  },
]

const featuredChallenges = [
  {
    number: '01',
    category: 'Tableaux',
    title: 'Trouver le maximum',
    level: 'Débutant',
    points: '10 pts',
  },
  {
    number: '02',
    category: 'Chaînes',
    title: 'Inverser un mot',
    level: 'Débutant',
    points: '10 pts',
  },
  {
    number: '03',
    category: 'Algorithmes',
    title: 'Compter les occurrences',
    level: 'Intermédiaire',
    points: '20 pts',
  },
]

export default function Landing() {
  const { user } = usePage<SharedPageProps>().props
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const primaryCta = isAdmin
    ? { href: '/admin', label: 'Ouvrir l’administration' }
    : user
      ? { href: '/profile#api-token', label: 'Gérer mon terminal' }
      : { href: '/auth/register', label: 'Créer mon compte' }

  return (
    <BaseLayout>
      <div className="space-y-24 pb-10 sm:space-y-32">
        <section className="relative grid items-center gap-14 overflow-hidden rounded-[2rem] border border-foreground/10 bg-card px-6 py-12 shadow-[0_30px_100px_rgba(23,31,56,0.08)] sm:px-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-20 lg:py-20">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-brand-yellow/25 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <p className="eyebrow mb-6">Apprendre en construisant</p>
            <h1 className="display-heading max-w-xl text-5xl leading-[0.98] text-foreground sm:text-7xl">
              Le code se comprend mieux <span className="italic text-primary">en pratique.</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground sm:text-xl">
              Des challenges JavaScript courts, concrets et progressifs pour transformer chaque
              blocage en déclic.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background hover:bg-foreground/90"
              >
                <Link href={primaryCta.href}>
                  {primaryCta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              {isAdmin && (
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-5 py-3.5 text-sm font-semibold"
                >
                  <Link href="/profile#api-token">Profil terminal</Link>
                </Button>
              )}
              <Button
                asChild
                variant="ghost"
                className="rounded-full px-5 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                <a href="#method">
                  Voir comment ça marche <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
            <div className="mt-5 max-w-lg rounded-xl border border-foreground/10 bg-foreground px-4 py-3 font-mono text-sm text-background">
              npm install --global @codojo/cli
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Progression
                sauvegardée
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Exécution
                instantanée
              </span>
            </div>
          </div>

          <Card className="relative z-10 mx-auto w-full max-w-[500px] overflow-hidden border-brand-paper/10 bg-brand-ink text-brand-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-paper/10 px-5 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-paper/10">
                  <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                Challenge 03
              </div>
              <Badge variant="warning">INTERMÉDIAIRE</Badge>
            </div>
            <CardContent className="space-y-6 p-5 sm:p-7">
              <div>
                <p className="font-mono text-xs text-brand-green-soft">/arrays / reduce</p>
                <h2 className="mt-2 text-xl font-semibold">Compter les occurrences</h2>
                <p className="mt-2 text-sm leading-6 text-brand-paper/60">
                  Retournez un objet qui compte chaque valeur présente dans le tableau.
                </p>
              </div>
              <div className="rounded-xl border border-brand-paper/10 bg-brand-editor p-4 font-mono text-sm leading-7 text-brand-paper/80">
                <div>
                  <span className="text-brand-green-soft">const</span> counts ={' '}
                  <span className="text-brand-yellow">countValues</span>(items)
                </div>
                <div className="mt-2 text-brand-paper/35">
                  // votre solution ici<span className="animate-pulse text-brand-paper">▍</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-brand-paper/10 pt-4">
                <span className="text-xs text-brand-paper/45">Sauvegardé il y a 2 min</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-green-soft px-4 py-2 text-xs font-semibold text-brand-ink">
                  <Terminal className="h-3.5 w-3.5" aria-hidden="true" /> Tester
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-4">Un entraînement qui reste simple</p>
          <h2 className="display-heading text-4xl sm:text-6xl">
            Moins de théorie. Plus de <span className="italic text-primary">réflexes.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Chaque challenge est pensé comme une petite boucle d’apprentissage : comprendre le
            problème, faire une hypothèse, observer le résultat, recommencer.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-3" aria-label="Bénéfices">
          {benefits.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="transition-transform duration-200 hover:-translate-y-1">
              <CardContent className="p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="method" className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow mb-4">La méthode</p>
            <h2 className="display-heading max-w-md text-4xl sm:text-5xl">
              Une boucle courte qui donne envie de continuer.
            </h2>
          </div>
          <div className="divide-y divide-foreground/10 border-y border-foreground/10">
            {steps.map((step) => (
              <div key={step.number} className="grid gap-4 py-7 sm:grid-cols-[72px_1fr] sm:gap-8">
                <span className="font-mono text-sm text-primary">{step.number}</span>
                <div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 max-w-xl leading-7 text-muted-foreground">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-brand-ink px-6 py-12 text-brand-paper sm:px-12 sm:py-16 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow text-brand-green-soft">Commencer maintenant</p>
              <h2 className="display-heading mt-4 text-4xl sm:text-5xl">
                Votre prochain déclic est à un challenge.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {featuredChallenges.map((challenge) => (
                <Card
                  key={challenge.number}
                  className="border-brand-paper/15 bg-brand-paper/5 text-brand-paper"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between font-mono text-[10px] text-brand-paper/50">
                      <span>#{challenge.number}</span>
                      <span>{challenge.points}</span>
                    </div>
                    <p className="mt-5 text-[11px] text-brand-green-soft">{challenge.category}</p>
                    <h3 className="mt-1 font-semibold">{challenge.title}</h3>
                    <p className="mt-3 text-xs text-brand-paper/50">{challenge.level}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Button
            asChild
            className="mt-10 rounded-full bg-brand-yellow px-6 py-3.5 text-sm font-semibold text-brand-ink hover:bg-brand-yellow/90"
          >
            <Link href={primaryCta.href}>
              {primaryCta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </section>
      </div>
    </BaseLayout>
  )
}
