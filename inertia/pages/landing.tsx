import { Link } from '@inertiajs/react'
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Code2,
  Github,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'

import BaseLayout from '#components/layouts/base_layout'
import { Badge } from '#components/ui/badge'
import { Button } from '#components/ui/button'
import { Card, CardContent } from '#components/ui/card'

const benefits = [
  {
    icon: BarChart3,
    title: 'Une progression lisible',
    text: 'Voyez vos acquis, vos prochaines étapes et votre rythme sans chercher dans plusieurs écrans.',
  },
  {
    icon: Terminal,
    title: 'Un vrai environnement de code',
    text: 'Éditez et exécutez vos solutions dans Codojo CLI, directement dans votre terminal.',
  },
  {
    icon: Zap,
    title: 'Un feedback qui compte',
    text: 'Validez vos exercices, synchronisez vos résultats et reprenez votre parcours quand vous voulez.',
  },
]

const workflow = [
  {
    number: '01',
    title: 'Choisissez votre prochaine compétence',
    text: 'Le dashboard vous montre les étapes disponibles et les notions à travailler.',
  },
  {
    number: '02',
    title: 'Ouvrez Codojo CLI',
    text: 'Installez le CLI, récupérez votre exercice et pratiquez dans votre environnement local.',
  },
  {
    number: '03',
    title: 'Validez et suivez vos acquis',
    text: 'Les résultats remontent sur Codojo pour garder une vue claire de votre progression.',
  },
]

export default function Landing() {
  return (
    <BaseLayout>
      <div className="space-y-24 pb-10 sm:space-y-32">
        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[#111a2d] px-6 py-12 text-slate-50 shadow-[0_30px_100px_rgba(15,23,42,0.18)] sm:px-12 sm:py-16 lg:px-20 lg:py-20">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="relative z-10 grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-300" /> Le dojo pour apprendre en
                construisant
              </div>
              <h1 className="mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
                Comprendre le code. Construire des réflexes.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                Codojo vous accompagne dans une progression JavaScript concrète. Le Web vous guide.
                Le CLI vous laisse coder pour de vrai.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  className="rounded-xl bg-emerald-300 px-6 py-3.5 font-semibold text-slate-950 hover:bg-emerald-200"
                >
                  <Link href="/auth/register">
                    Commencer gratuitement <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-slate-600 bg-transparent text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <Link href="#workflow">
                    Voir le fonctionnement <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-300" /> Progression sauvegardée
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-300" /> CLI local
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-300" /> Parcours progressif
                </span>
              </div>
            </div>
            <Card className="relative z-10 mx-auto w-full max-w-[480px] overflow-hidden border-white/10 bg-white/[0.07] text-slate-50 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-300 text-slate-950">
                    <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  Codojo workspace
                </div>
                <Badge variant="success">EN COURS</Badge>
              </div>
              <CardContent className="space-y-5 p-5 sm:p-7">
                <div>
                  <p className="font-mono text-xs text-emerald-300">/parcours / javascript / 03</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    Reprendre votre pratique
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Compter les occurrences</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Progression du parcours</span>
                    <span className="font-mono text-emerald-300">42%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[42%] rounded-full bg-emerald-300" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="font-mono text-lg font-semibold">08</p>
                      <p className="text-[10px] text-slate-400">validés</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-semibold">12</p>
                      <p className="text-[10px] text-slate-400">disponibles</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-semibold">80</p>
                      <p className="text-[10px] text-slate-400">points</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                    <Terminal className="h-3.5 w-3.5" aria-hidden="true" /> Codojo CLI
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-300 px-3 py-2 text-xs font-semibold text-slate-950">
                    Continuer <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-4">Un workspace, deux usages</p>
          <h2 className="display-heading text-4xl sm:text-6xl">
            Le Web pour voir clair. Le terminal pour aller plus loin.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Codojo sépare la réflexion de l’exécution : le dashboard vous aide à décider quoi
            pratiquer, le CLI vous donne l’environnement pour le faire.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-3" aria-label="Bénéfices">
          <>
            {benefits.map(({ icon: Icon, title, text }) => (
              <Card
                key={title}
                className="border-border/70 bg-card/75 shadow-none transition-transform duration-200 hover:-translate-y-1"
              >
                <CardContent className="p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </>
        </section>

        <section id="workflow" className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow mb-4">Le fonctionnement</p>
            <h2 className="display-heading max-w-md text-4xl sm:text-5xl">
              Une boucle courte qui donne envie de continuer.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Vous n’avez pas besoin d’un deuxième éditeur dans votre navigateur. Codojo garde le
              Web concentré sur ce qu’il fait de mieux : vous aider à garder le cap.
            </p>
          </div>
          <div className="divide-y divide-border/70 border-y border-border/70">
            {workflow.map((step) => (
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

        <section className="rounded-[2rem] border border-primary/20 bg-primary/[0.04] px-6 py-12 sm:px-12 sm:py-16 lg:px-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Le prochain pas</p>
              <h2 className="display-heading mt-4 max-w-2xl text-4xl sm:text-5xl">
                Votre progression mérite un espace à elle.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                Créez votre compte, installez le CLI et laissez Codojo organiser votre pratique.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-xl">
                <Link href="/auth/register">
                  Créer mon espace <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <a href="https://github.com/Ekole237/js-challenge" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" aria-hidden="true" /> Voir le projet
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </BaseLayout>
  )
}
