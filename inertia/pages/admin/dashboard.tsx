import { ArrowUpRight, BookOpen, ShieldAlert, Sparkles, Users } from 'lucide-react'
import { Link } from '@inertiajs/react'
import AdminLayout from '#components/layouts/admin_layout'

type Stat = { label: string; value: number; detail: string; tone: string; icon: typeof Users }
type DashboardProps = {
  stats: {
    activeUsers: number
    suspendedUsers: number
    newUsers: number
    publishedExercises: number
    draftExercises: number
    archivedExercises: number
  }
  recentLogs: Array<{
    id: number
    action: string
    entityType: string
    entityId: string
    reason?: string | null
    actor: string
    createdAt: string
  }>
}

function formatAction(action: string) {
  return action.replaceAll('.', ' · ').replaceAll('_', ' ')
}

export default function AdminDashboard({ stats, recentLogs }: DashboardProps) {
  const cards: Stat[] = [
    {
      label: 'Utilisateurs actifs',
      value: stats.activeUsers,
      detail: `+${stats.newUsers} sur les 30 derniers jours`,
      tone: 'bg-primary/10 text-primary',
      icon: Users,
    },
    {
      label: 'Comptes suspendus',
      value: stats.suspendedUsers,
      detail: 'À examiner régulièrement',
      tone: 'bg-[#F4D35E]/25 text-[#8A6400]',
      icon: ShieldAlert,
    },
    {
      label: 'Exercices publiés',
      value: stats.publishedExercises,
      detail: `${stats.draftExercises} brouillons à traiter`,
      tone: 'bg-[#86E3C0]/25 text-[#17644A]',
      icon: BookOpen,
    },
    {
      label: 'Exercices archivés',
      value: stats.archivedExercises,
      detail: 'Historique conservé',
      tone: 'bg-foreground/8 text-foreground',
      icon: Sparkles,
    },
  ]

  return (
    <AdminLayout title="Un cockpit pour garder le contrôle.">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs admin">
        {cards.map(({ label, value, detail, tone, icon: Icon }) => (
          <article key={label} className="surface rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-mono text-2xl font-semibold tracking-tight">{value}</span>
            </div>
            <h2 className="mt-6 text-sm font-semibold">{label}</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="surface rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Journal d’activité</p>
              <h2 className="text-xl font-semibold tracking-tight">
                Les dernières décisions prises.
              </h2>
            </div>
            <span className="rounded-full bg-foreground/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Audit
            </span>
          </div>
          <div className="mt-6 divide-y divide-foreground/10">
            {recentLogs.length === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">
                Aucune action sensible enregistrée.
              </p>
            ) : (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-semibold">{formatAction(log.action)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {log.actor} · {log.entityType} #{log.entityId}
                    </p>
                    {log.reason && (
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">{log.reason}</p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {new Date(log.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-2xl bg-foreground p-6 text-background">
          <p className="eyebrow text-[#86E3C0]">Raccourcis</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Passer à l’action.</h2>
          <div className="mt-6 space-y-3">
            <Link
              href="/admin/users"
              className="focus-ring flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              Gérer les utilisateurs <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/admin/exercises"
              className="focus-ring flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              Gérer les exercices <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </section>
    </AdminLayout>
  )
}
