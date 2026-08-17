import { router } from '@inertiajs/react'
import { Search, ShieldAlert, UserCheck, UserCog } from 'lucide-react'
import { useState } from 'react'
import AdminLayout from '#components/layouts/admin_layout'

type AdminUser = {
  id: string
  username: string
  email: string
  avatar?: string
  role: 'user' | 'admin' | 'super_admin'
  status: 'active' | 'suspended'
  totalPoints: number
  emailVerifiedAt?: string | null
  suspendedAt?: string | null
  suspensionReason?: string | null
  createdAt: string
}

type UsersProps = {
  users: { data: AdminUser[]; meta?: { currentPage: number; lastPage: number; total: number } }
  filters: { search: string; status: string; role: string }
}

function badgeClass(value: string) {
  if (value === 'active' || value === 'published') return 'bg-[#86E3C0]/25 text-[#17644A]'
  if (value === 'suspended' || value === 'archived') return 'bg-[#F4D35E]/25 text-[#8A6400]'
  return 'bg-foreground/8 text-muted-foreground'
}

export default function AdminUsers({ users, filters }: UsersProps) {
  const [search, setSearch] = useState(filters.search)

  function applyFilters(event: React.FormEvent) {
    event.preventDefault()
    router.get(
      '/admin/users',
      { search, status: filters.status, role: filters.role },
      { preserveState: true, replace: true }
    )
  }

  function changeRole(user: AdminUser, role: string) {
    router.post(`/admin/users/${user.id}/role`, { role }, { preserveScroll: true })
  }

  function changeStatus(user: AdminUser) {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active'
    const reason =
      nextStatus === 'suspended' ? window.prompt('Pourquoi suspendre cet utilisateur ?') : ''
    if (nextStatus === 'suspended' && !reason) return
    router.post(
      `/admin/users/${user.id}/status`,
      { status: nextStatus, reason },
      { preserveScroll: true }
    )
  }

  function resetProgress(user: AdminUser) {
    const reason = window.prompt(`Pourquoi réinitialiser la progression de ${user.username} ?`)
    if (
      !reason ||
      !window.confirm('Cette action supprimera aussi les solutions sauvegardées. Continuer ?')
    )
      return
    router.post(`/admin/users/${user.id}/reset-progress`, { reason }, { preserveScroll: true })
  }

  return (
    <AdminLayout title="Les utilisateurs, sans angle mort.">
      <section className="surface rounded-2xl p-5 sm:p-6">
        <form onSubmit={applyFilters} className="grid gap-3 lg:grid-cols-[1fr_160px_160px_auto]">
          <label className="relative block">
            <span className="sr-only">Rechercher un utilisateur</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nom ou adresse email"
              className="focus-ring h-11 w-full rounded-xl border border-foreground/10 bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <select
            defaultValue={filters.status}
            name="status"
            onChange={(event) =>
              router.get(
                '/admin/users',
                { search, status: event.target.value, role: filters.role },
                { preserveState: true, replace: true }
              )
            }
            className="focus-ring h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="suspended">Suspendus</option>
          </select>
          <select
            defaultValue={filters.role}
            name="role"
            onChange={(event) =>
              router.get(
                '/admin/users',
                { search, status: filters.status, role: event.target.value },
                { preserveState: true, replace: true }
              )
            }
            className="focus-ring h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="all">Tous les rôles</option>
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super admin</option>
          </select>
          <button
            type="submit"
            className="focus-ring h-11 rounded-full bg-foreground px-5 text-sm font-semibold text-background hover:-translate-y-0.5"
          >
            Rechercher
          </button>
        </form>
      </section>

      <section className="surface mt-6 overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-2 border-b border-foreground/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="eyebrow mb-2">Annuaire</p>
            <h2 className="text-xl font-semibold">
              {users.meta?.total ?? users.data.length} utilisateurs
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">Les actions sensibles sont journalisées.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Utilisateur</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {users.data.map((user) => (
                <tr
                  key={user.id}
                  className="align-top transition-colors hover:bg-foreground/[0.02]"
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold">{user.username}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-6 py-5">
                    <select
                      value={user.role}
                      onChange={(event) => changeRole(user, event.target.value)}
                      className="focus-ring rounded-lg border border-foreground/10 bg-background px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary"
                      aria-label={`Rôle de ${user.username}`}
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${badgeClass(user.status)}`}
                    >
                      {user.status === 'active' ? 'Actif' : 'Suspendu'}
                    </span>
                    {user.suspensionReason && (
                      <p className="mt-2 max-w-[180px] text-xs text-muted-foreground">
                        {user.suspensionReason}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-5 font-mono text-xs">{user.totalPoints} pts</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => changeStatus(user)}
                        className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-foreground/10 px-3 py-2 text-xs font-semibold hover:bg-foreground/5"
                      >
                        {user.status === 'active' ? (
                          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {user.status === 'active' ? 'Suspendre' : 'Réactiver'}
                      </button>
                      <button
                        type="button"
                        onClick={() => resetProgress(user)}
                        className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-foreground/10 px-3 py-2 text-xs font-semibold hover:bg-foreground/5"
                      >
                        <UserCog className="h-3.5 w-3.5" aria-hidden="true" /> Reset
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.data.length === 0 && (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            Aucun utilisateur ne correspond à ces filtres.
          </p>
        )}
      </section>
    </AdminLayout>
  )
}
