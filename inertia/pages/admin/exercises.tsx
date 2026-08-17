import { router, useForm } from '@inertiajs/react'
import { CheckCircle2, FileCode2, Pencil, Plus, Search } from 'lucide-react'
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

type Exercise = {
  id: number
  number: number
  title: string
  description: string
  difficulty: number
  slug: string
  category: string
  points: number
  status: 'draft' | 'published' | 'archived'
  starterCode: string
  hint: string
  prerequisiteId?: number | null
}

type ExercisesProps = {
  exercises: { data: Exercise[]; meta?: { currentPage: number; lastPage: number; total: number } }
  filters: { search: string; status: string }
}

const statusLabels = { draft: 'Brouillon', published: 'Publié', archived: 'Archivé' }

function ExerciseStatusBadge({ status }: { status: Exercise['status'] }) {
  const variant =
    status === 'published' ? 'success' : status === 'archived' ? 'warning' : 'secondary'
  return <Badge variant={variant}>{statusLabels[status]}</Badge>
}

function ExerciseEditor({ exercise }: { exercise: Exercise }) {
  const [open, setOpen] = useState(false)
  const form = useForm({
    number: exercise.number,
    title: exercise.title,
    slug: exercise.slug,
    description: exercise.description,
    difficulty: exercise.difficulty,
    category: exercise.category,
    points: exercise.points,
    status: exercise.status,
    starterCode: exercise.starterCode,
    hint: exercise.hint,
    prerequisiteId: exercise.prerequisiteId ? String(exercise.prerequisiteId) : '',
  })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    form.post(`/admin/exercises/${exercise.id}`, {
      preserveScroll: true,
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Modifier
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.post(
              `/admin/exercises/${exercise.id}/verify-tests`,
              {},
              { preserveScroll: true }
            )
          }
        >
          <FileCode2 className="mr-1.5 h-3.5 w-3.5" />
          Tests
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Modifier l’exercice #{exercise.number}</DialogTitle>
            <DialogDescription>
              Le contenu pédagogique est éditable. Les tests restent versionnés dans Git.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4 py-2 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`title-${exercise.id}`}>Titre</Label>
              <Input
                id={`title-${exercise.id}`}
                value={form.data.title}
                onChange={(event) => form.setData('title', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`slug-${exercise.id}`}>Slug</Label>
              <Input
                id={`slug-${exercise.id}`}
                value={form.data.slug}
                onChange={(event) => form.setData('slug', event.target.value)}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor={`description-${exercise.id}`}>Description</Label>
              <Textarea
                id={`description-${exercise.id}`}
                value={form.data.description}
                onChange={(event) => form.setData('description', event.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`category-${exercise.id}`}>Catégorie</Label>
              <Input
                id={`category-${exercise.id}`}
                value={form.data.category}
                onChange={(event) => form.setData('category', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={form.data.status}
                onValueChange={(value) => form.setData('status', value as Exercise['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`difficulty-${exercise.id}`}>Difficulté</Label>
              <Input
                id={`difficulty-${exercise.id}`}
                type="number"
                min={1}
                value={form.data.difficulty}
                onChange={(event) => form.setData('difficulty', Number(event.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`points-${exercise.id}`}>Points</Label>
              <Input
                id={`points-${exercise.id}`}
                type="number"
                min={1}
                value={form.data.points}
                onChange={(event) => form.setData('points', Number(event.target.value))}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor={`starter-${exercise.id}`}>Code de départ</Label>
              <Textarea
                id={`starter-${exercise.id}`}
                value={form.data.starterCode}
                onChange={(event) => form.setData('starterCode', event.target.value)}
                rows={6}
                className="bg-slate-950 font-mono text-xs text-slate-50"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor={`hint-${exercise.id}`}>Indice</Label>
              <Textarea
                id={`hint-${exercise.id}`}
                value={form.data.hint}
                onChange={(event) => form.setData('hint', event.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter className="lg:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={form.processing}>
                {form.processing ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function AdminExercises({ exercises, filters }: ExercisesProps) {
  const [search, setSearch] = useState(filters.search)
  const [createOpen, setCreateOpen] = useState(false)
  const createForm = useForm({
    title: '',
    description: '',
    category: 'JavaScript',
    difficulty: 1,
    points: 10,
    status: 'draft' as Exercise['status'],
    starterCode: '',
    hint: '',
  })

  function applyFilters(event: React.FormEvent) {
    event.preventDefault()
    router.get(
      '/admin/exercises',
      { search, status: filters.status, page: 1 },
      { preserveState: true, replace: true }
    )
  }

  function create(event: React.FormEvent) {
    event.preventDefault()
    createForm.post('/admin/exercises', {
      preserveScroll: true,
      onSuccess: () => {
        createForm.reset()
        setCreateOpen(false)
      },
    })
  }

  const columns: DataTableColumn<Exercise>[] = [
    {
      id: 'number',
      header: '#',
      className: 'font-mono text-xs text-muted-foreground',
      cell: (exercise) => `#${String(exercise.number).padStart(2, '0')}`,
    },
    {
      id: 'exercise',
      header: 'Exercice',
      cell: (exercise) => (
        <div>
          <p className="font-medium">{exercise.title}</p>
          <p className="max-w-[320px] truncate text-xs text-muted-foreground">
            {exercise.description}
          </p>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Catégorie',
      cell: (exercise) => <Badge variant="outline">{exercise.category}</Badge>,
    },
    {
      id: 'status',
      header: 'Statut',
      cell: (exercise) => <ExerciseStatusBadge status={exercise.status} />,
    },
    {
      id: 'points',
      header: 'Valeur',
      className: 'font-mono text-xs',
      cell: (exercise) => `${exercise.points} pts`,
    },
    {
      id: 'actions',
      header: <span className="block text-right">Actions</span>,
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (exercise) => <ExerciseEditor exercise={exercise} />,
    },
  ]

  const currentPage = exercises.meta?.currentPage ?? 1
  const lastPage = exercises.meta?.lastPage ?? 1

  function goToPage(page: number) {
    if (page < 1 || page > lastPage) return
    router.get(
      '/admin/exercises',
      { ...filters, page },
      { preserveState: true, preserveScroll: true, replace: true }
    )
  }

  return (
    <AdminLayout title="Un catalogue qui reste vivant.">
      <section className="surface rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Nouveau contenu</p>
            <h2 className="text-xl font-semibold">Créer un exercice</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Commence par un brouillon, puis publie-le quand le contenu est prêt.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Créer un exercice
          </Button>
        </div>
      </section>

      <section className="surface mt-6 rounded-2xl p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Catalogue</p>
            <h2 className="text-xl font-semibold">
              {exercises.meta?.total ?? exercises.data.length} exercices
            </h2>
          </div>
          <form onSubmit={applyFilters} className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Label htmlFor="exercise-search" className="sr-only">
                Rechercher un exercice
              </Label>
              <Input
                id="exercise-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Titre ou catégorie"
                className="h-9 w-full pl-9 sm:w-52"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(status) =>
                router.get(
                  '/admin/exercises',
                  { search, status, page: 1 },
                  { preserveState: true, replace: true }
                )
              }
            >
              <SelectTrigger className="h-9 w-full sm:w-36" aria-label="Filtrer par statut">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
                <SelectItem value="published">Publiés</SelectItem>
                <SelectItem value="archived">Archivés</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" size="sm">
              Filtrer
            </Button>
          </form>
        </div>
        <DataTable
          columns={columns}
          data={exercises.data}
          getRowId={(exercise) => exercise.id}
          emptyState={
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Aucun exercice ne correspond à ces filtres.
            </span>
          }
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un exercice</DialogTitle>
            <DialogDescription>
              Le nouvel exercice est créé en brouillon par défaut.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={create} className="grid gap-4 py-2 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-title">Titre</Label>
              <Input
                id="new-title"
                required
                value={createForm.data.title}
                onChange={(event) => createForm.setData('title', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-category">Catégorie</Label>
              <Input
                id="new-category"
                value={createForm.data.category}
                onChange={(event) => createForm.setData('category', event.target.value)}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                required
                value={createForm.data.description}
                onChange={(event) => createForm.setData('description', event.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-difficulty">Difficulté</Label>
              <Input
                id="new-difficulty"
                type="number"
                min={1}
                value={createForm.data.difficulty}
                onChange={(event) => createForm.setData('difficulty', Number(event.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-points">Points</Label>
              <Input
                id="new-points"
                type="number"
                min={1}
                value={createForm.data.points}
                onChange={(event) => createForm.setData('points', Number(event.target.value))}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="new-starter">Code de départ</Label>
              <Textarea
                id="new-starter"
                value={createForm.data.starterCode}
                onChange={(event) => createForm.setData('starterCode', event.target.value)}
                rows={6}
                className="bg-slate-950 font-mono text-xs text-slate-50"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="new-hint">Indice</Label>
              <Textarea
                id="new-hint"
                value={createForm.data.hint}
                onChange={(event) => createForm.setData('hint', event.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter className="lg:col-span-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createForm.processing}>
                {createForm.processing ? 'Création…' : 'Créer le brouillon'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
