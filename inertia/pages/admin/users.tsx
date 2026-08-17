import { router } from '@inertiajs/react'
import { Search, ShieldAlert, UserCheck, UserCog } from 'lucide-react'
import { useState } from 'react'
import AdminLayout from '#components/layouts/admin_layout'
import { DataTable, type DataTableColumn } from '#components/ui/data-table'
import { Badge } from '#components/ui/badge'
import { Button } from '#components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#components/ui/dialog'
import { Input } from '#components/ui/input'
import { Label } from '#components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select'
import { Textarea } from '#components/ui/textarea'

type AdminUser = {
  id: string
  username: string
  email: string
  role: 'user' | 'admin' | 'super_admin'
  status: 'active' | 'suspended'
  totalPoints: number
  suspendedReason?: string | null
}

type UsersProps = {
  users: {
    data: AdminUser[]
    meta?: { currentPage: number; lastPage: number; total: number }
  }
  filters: { search: string; status: string; role: string }
}

function UserStatusBadge({ status }: { status: AdminUser['status'] }) {
  return (
    <Badge variant={status === 'active' ? 'success' : 'warning'}>
      {status === 'active' ? 'Actif' : 'Suspendu'}
    </Badge>
  )
}

function UserRoleBadge({ role }: { role: AdminUser['role'] }) {
  return (
    <Badge
      variant={role === 'super_admin' ? 'default' : role === 'admin' ? 'secondary' : 'outline'}
    >
      {role === 'super_admin' ? 'Super admin' : role === 'admin' ? 'Admin' : 'Utilisateur'}
    </Badge>
  )
}

export default function AdminUsers({ users, filters }: UsersProps) {
  const [search, setSearch] = useState(filters.search)
  const [statusTarget, setStatusTarget] = useState<AdminUser | null>(null)
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null)
  const [reason, setReason] = useState('')

  function applyFilters(event: React.FormEvent) {
    event.preventDefault()
    router.get(
      '/admin/users',
      { search, status: filters.status, role: filters.role, page: 1 },
      { preserveState: true, replace: true }
    )
  }

  function changeRole(user: AdminUser, role: string) {
    router.post(`/admin/users/${user.id}/role`, { role }, { preserveScroll: true })
  }

  function openStatusDialog(user: AdminUser) {
    if (user.status === 'suspended') {
      router.post(
        `/admin/users/${user.id}/status`,
        { status: 'active', reason: '' },
        { preserveScroll: true }
      )
      return
    }
    setReason('')
    setStatusTarget(user)
  }

  function confirmStatus() {
    if (!statusTarget || !reason.trim()) return
    router.post(
      `/admin/users/${statusTarget.id}/status`,
      { status: 'suspended', reason: reason.trim() },
      { preserveScroll: true, onSuccess: () => setStatusTarget(null) }
    )
  }

  function confirmReset() {
    if (!resetTarget || !reason.trim()) return
    router.post(
      `/admin/users/${resetTarget.id}/reset-progress`,
      { reason: reason.trim() },
      { preserveScroll: true, onSuccess: () => setResetTarget(null) }
    )
  }

  const columns: DataTableColumn<AdminUser>[] = [
    {
      id: 'user',
      header: 'Utilisateur',
      cell: (user) => (
        <div>
          <p className="font-medium">{user.username}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Rôle',
      cell: (user) => (
        <Select value={user.role} onValueChange={(role) => changeRole(user, role)}>
          <SelectTrigger className="h-8 w-[132px] text-xs" aria-label={`Rôle de ${user.username}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Utilisateur</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="super_admin">Super admin</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: 'status',
      header: 'Statut',
      cell: (user) => <UserStatusBadge status={user.status} />,
    },
    {
      id: 'score',
      header: 'Score',
      className: 'font-mono text-xs',
      cell: (user) => `${user.totalPoints} pts`,
    },
    {
      id: 'actions',
      header: <span className="block text-right">Actions</span>,
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (user) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => openStatusDialog(user)}>
            {user.status === 'active' ? (
              <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
            ) : (
              <UserCheck className="mr-1.5 h-3.5 w-3.5" />
            )}
            {user.status === 'active' ? 'Suspendre' : 'Réactiver'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setReason('')
              setResetTarget(user)
            }}
          >
            <UserCog className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      ),
    },
  ]

  const currentPage = users.meta?.currentPage ?? 1
  const lastPage = users.meta?.lastPage ?? 1

  function goToPage(page: number) {
    if (page < 1 || page > lastPage) return
    router.get(
      '/admin/users',
      { ...filters, page },
      { preserveState: true, preserveScroll: true, replace: true }
    )
  }

  return (
    <AdminLayout title="Les utilisateurs, sans angle mort.">
      <section className="surface rounded-2xl p-5 sm:p-6">
        <form onSubmit={applyFilters} className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Label htmlFor="user-search" className="sr-only">
              Rechercher un utilisateur
            </Label>
            <Input
              id="user-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nom ou adresse email"
              className="pl-9"
            />
          </div>
          <Select
            value={filters.status}
            onValueChange={(status) =>
              router.get(
                '/admin/users',
                { search, status, role: filters.role, page: 1 },
                { preserveState: true, replace: true }
              )
            }
          >
            <SelectTrigger aria-label="Filtrer par statut">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="suspended">Suspendus</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.role}
            onValueChange={(role) =>
              router.get(
                '/admin/users',
                { search, status: filters.status, role, page: 1 },
                { preserveState: true, replace: true }
              )
            }
          >
            <SelectTrigger aria-label="Filtrer par rôle">
              <SelectValue placeholder="Tous les rôles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="user">Utilisateurs</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="super_admin">Super admins</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Rechercher</Button>
        </form>
      </section>

      <section className="surface mt-6 rounded-2xl p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Annuaire</p>
            <h2 className="text-xl font-semibold">
              {users.meta?.total ?? users.data.length} utilisateurs
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">Les actions sensibles sont journalisées.</p>
        </div>
        <DataTable
          columns={columns}
          data={users.data}
          getRowId={(user) => user.id}
          emptyState="Aucun utilisateur ne correspond à ces filtres."
        />
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} sur {lastPage}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= lastPage}
              onClick={() => goToPage(currentPage + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={Boolean(statusTarget)} onOpenChange={(open) => !open && setStatusTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspendre {statusTarget?.username} ?</DialogTitle>
            <DialogDescription>
              La suspension est réversible. L’utilisateur sera déconnecté des routes protégées.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="suspension-reason">Motif obligatoire</Label>
            <Textarea
              id="suspension-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Décris brièvement la raison…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusTarget(null)}>
              Annuler
            </Button>
            <Button variant="destructive" disabled={!reason.trim()} onClick={confirmStatus}>
              Confirmer la suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(resetTarget)} onOpenChange={(open) => !open && setResetTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser la progression ?</DialogTitle>
            <DialogDescription>
              Cette action supprime la progression et les solutions sauvegardées de{' '}
              {resetTarget?.username}. Une justification est obligatoire.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reset-reason">Justification</Label>
            <Textarea
              id="reset-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Pourquoi cette réinitialisation ?"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetTarget(null)}>
              Annuler
            </Button>
            <Button variant="destructive" disabled={!reason.trim()} onClick={confirmReset}>
              Réinitialiser
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
