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
  contract?: {
    publishedVersion: number | null
    draftVersion: number | null
    hash: string | null
    definition: ContractDefinition | null
  }
}

type ContractDefinition = {
  metadata?: {
    title?: string
    description?: string
    difficulty?: number
    category?: string
    points?: number
    hint?: string
  }
  instruction?: string
  entry?: { name?: string }
  behavior?: { kind?: string; where?: { value?: unknown }; operation?: string }
}

type ContractForm = {
  title: string
  description: string
  category: string
  difficulty: number
  points: number
  status: Exercise['status']
  hint: string
  functionName: string
  family: string
  countValue: string
}

function buildContract(data: ContractForm) {
  const family = data.family as
    | 'count'
    | 'transform'
    | 'aggregate'
    | 'predicate'
    | 'lookup'
    | 'compare'
  const examples: Record<string, { input: unknown[]; output: unknown }> = {
    count: { input: [[true, false]], output: 1 },
    transform: { input: [[1, 2]], output: [2, 3] },
    aggregate: { input: [[1, 2]], output: 3 },
    predicate: { input: [[true, false]], output: false },
    lookup: { input: ['key'], output: 1 },
    compare: { input: [1, 1], output: true },
  }
  const example = examples[family]
  const behavior =
    family === 'count' || family === 'predicate'
      ? { kind: family, where: { operator: 'strictEquals', value: data.countValue === 'true' } }
      : family === 'transform'
        ? { kind: family, operation: 'increment' }
        : family === 'aggregate'
          ? { kind: family, operation: 'sum' }
          : family === 'lookup'
            ? { kind: family, table: { key: 1 }, keyParameter: 0, defaultValue: null }
            : { kind: family, comparator: 'strictEquals' }

  const caseGenerator =
    family === 'compare'
      ? undefined
      : {
          kind: 'arrayValues' as const,
          seed: 1,
          count: 4,
          minLength: 0,
          maxLength: 4,
          values: [true, false, 0, 1],
        }

  return {
    metadata: {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      category: data.category,
      points: data.points,
      hint: data.hint,
    },
    instruction: data.description,
    entry: {
      kind: 'function',
      name: data.functionName,
      parameters:
        family === 'compare'
          ? [
              { name: 'left', type: 'unknown' },
              { name: 'right', type: 'unknown' },
            ]
          : [
              {
                name: 'input',
                type: family === 'lookup' ? 'unknown' : 'array',
                items: 'unknown',
              },
            ],
      returns:
        family === 'count' || family === 'aggregate'
          ? 'number'
          : family === 'predicate' || family === 'compare'
            ? 'boolean'
            : 'unknown',
    },
    behavior,
    examples: [{ description: 'exemple guidé', ...example }],
    edgeCases:
      family === 'count' || family === 'predicate'
        ? [
            {
              description: 'cas vide',
              input: [[]],
              output: family === 'count' ? 0 : data.countValue !== 'true',
            },
          ]
        : family === 'compare'
          ? [{ description: 'valeurs différentes', input: [1, 2], output: false }]
          : family === 'lookup'
            ? [{ description: 'clé absente', input: ['missing'], output: null }]
            : [],
    caseGenerator,
  }
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
  const definition = exercise.contract?.definition
  const form = useForm({
    number: exercise.number,
    title: exercise.title,
    slug: exercise.slug,
    description: exercise.description,
    difficulty: exercise.difficulty,
    category: exercise.category,
    points: exercise.points,
    status: exercise.status,
    hint: exercise.hint,
    prerequisiteId: exercise.prerequisiteId ? String(exercise.prerequisiteId) : '',
    functionName: definition?.entry?.name || 'solution',
    family: definition?.behavior?.kind || 'count',
    countValue: String(definition?.behavior?.where?.value ?? true),
  })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    form
      .transform((data) => ({ ...data, contract: buildContract(data) }))
      .post(`/admin/exercises/${exercise.id}`, {
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
          Contrat
        </Button>
        {exercise.contract?.draftVersion && (
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              router.post(`/admin/exercises/${exercise.id}/contracts/publish`, {
                versionId: exercise.contract?.draftVersion,
              })
            }
          >
            Publier v{exercise.contract.draftVersion}
          </Button>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Modifier l’exercice #{exercise.number}</DialogTitle>
            <DialogDescription>
              Décrivez le comportement avec le formulaire guidé. Le starter et l’évaluateur sont
              générés à la publication.
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
              <Label htmlFor={`function-${exercise.id}`}>Nom de la fonction</Label>
              <Input
                id={`function-${exercise.id}`}
                value={form.data.functionName}
                onChange={(event) => form.setData('functionName', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Famille d’évaluation</Label>
              <Select
                value={form.data.family}
                onValueChange={(value) => form.setData('family', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Compter</SelectItem>
                  <SelectItem value="transform">Transformer</SelectItem>
                  <SelectItem value="aggregate">Agrégat</SelectItem>
                  <SelectItem value="predicate">Propriété booléenne</SelectItem>
                  <SelectItem value="lookup">Correspondance</SelectItem>
                  <SelectItem value="compare">Comparer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(form.data.family === 'count' || form.data.family === 'predicate') && (
              <div className="space-y-2">
                <Label>Valeur recherchée</Label>
                <Select
                  value={form.data.countValue}
                  onValueChange={(value) => form.setData('countValue', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
    hint: '',
    functionName: 'solution',
    family: 'count',
    countValue: 'true',
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
    createForm
      .transform((data) => ({ ...data, contract: buildContract(data) }))
      .post('/admin/exercises', {
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
              <Label htmlFor="new-function">Nom de la fonction</Label>
              <Input
                id="new-function"
                value={createForm.data.functionName}
                onChange={(event) => createForm.setData('functionName', event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Famille d’évaluation</Label>
              <Select
                value={createForm.data.family}
                onValueChange={(value) => createForm.setData('family', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Compter</SelectItem>
                  <SelectItem value="transform">Transformer</SelectItem>
                  <SelectItem value="aggregate">Agrégat</SelectItem>
                  <SelectItem value="predicate">Propriété booléenne</SelectItem>
                  <SelectItem value="lookup">Correspondance</SelectItem>
                  <SelectItem value="compare">Comparer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(createForm.data.family === 'count' || createForm.data.family === 'predicate') && (
              <div className="space-y-2">
                <Label>Valeur recherchée</Label>
                <Select
                  value={createForm.data.countValue}
                  onValueChange={(value) => createForm.setData('countValue', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
