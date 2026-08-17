import { router, useForm } from '@inertiajs/react'
import { CheckCircle2, FileCode2, Pencil, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import AdminLayout from '#components/layouts/admin_layout'

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
  exercises: { data: Exercise[]; meta?: { total: number } }
  filters: { search: string; status: string }
}

const statusLabels = { draft: 'Brouillon', published: 'Publié', archived: 'Archivé' }

function badgeClass(status: Exercise['status']) {
  if (status === 'published') return 'bg-[#86E3C0]/25 text-[#17644A]'
  if (status === 'archived') return 'bg-[#F4D35E]/25 text-[#8A6400]'
  return 'bg-foreground/8 text-muted-foreground'
}

function ExerciseEditor({ exercise }: { exercise: Exercise }) {
  const [open, setOpen] = useState(false)
  const { data, setData, post, processing } = useForm({
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
    prerequisiteId: exercise.prerequisiteId || '',
  })

  function submit(event: React.FormEvent) {
    event.preventDefault()
    post(`/admin/exercises/${exercise.id}`, {
      preserveScroll: true,
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <>
      <tr className="align-top transition-colors hover:bg-foreground/[0.02]">
        <td className="px-6 py-5 font-mono text-xs text-muted-foreground">
          #{String(exercise.number).padStart(2, '0')}
        </td>
        <td className="px-6 py-5">
          <p className="font-semibold">{exercise.title}</p>
          <p className="mt-1 max-w-[340px] truncate text-xs text-muted-foreground">
            {exercise.description}
          </p>
        </td>
        <td className="px-6 py-5">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-primary">
            {exercise.category}
          </span>
        </td>
        <td className="px-6 py-5">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${badgeClass(exercise.status)}`}
          >
            {statusLabels[exercise.status]}
          </span>
        </td>
        <td className="px-6 py-5 font-mono text-xs">{exercise.points} pts</td>
        <td className="px-6 py-5">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-foreground/10 px-3 py-2 text-xs font-semibold hover:bg-foreground/5"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> {open ? 'Fermer' : 'Modifier'}
            </button>
            <button
              type="button"
              onClick={() =>
                router.post(
                  `/admin/exercises/${exercise.id}/verify-tests`,
                  {},
                  { preserveScroll: true }
                )
              }
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-foreground/10 px-3 py-2 text-xs font-semibold hover:bg-foreground/5"
            >
              <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" /> Tests
            </button>
          </div>
        </td>
      </tr>
      {open && (
        <tr className="bg-foreground/[0.02]">
          <td colSpan={6} className="px-6 py-5">
            <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
              <label className="text-xs font-semibold">
                Titre
                <input
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm font-normal outline-none focus:border-primary"
                />
              </label>
              <label className="text-xs font-semibold">
                Slug
                <input
                  value={data.slug}
                  onChange={(e) => setData('slug', e.target.value)}
                  className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm font-normal outline-none focus:border-primary"
                />
              </label>
              <label className="text-xs font-semibold lg:col-span-2">
                Description
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={3}
                  className="focus-ring mt-2 w-full rounded-xl border border-foreground/10 bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary"
                />
              </label>
              <label className="text-xs font-semibold">
                Catégorie
                <input
                  value={data.category}
                  onChange={(e) => setData('category', e.target.value)}
                  className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm font-normal outline-none focus:border-primary"
                />
              </label>
              <label className="text-xs font-semibold">
                Statut
                <select
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value as Exercise['status'])}
                  className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm font-normal outline-none focus:border-primary"
                >
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </select>
              </label>
              <label className="text-xs font-semibold">
                Difficulté
                <input
                  type="number"
                  min="1"
                  value={data.difficulty}
                  onChange={(e) => setData('difficulty', Number(e.target.value))}
                  className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm font-normal outline-none focus:border-primary"
                />
              </label>
              <label className="text-xs font-semibold">
                Points
                <input
                  type="number"
                  min="1"
                  value={data.points}
                  onChange={(e) => setData('points', Number(e.target.value))}
                  className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm font-normal outline-none focus:border-primary"
                />
              </label>
              <label className="text-xs font-semibold lg:col-span-2">
                Code de départ
                <textarea
                  value={data.starterCode}
                  onChange={(e) => setData('starterCode', e.target.value)}
                  rows={4}
                  className="focus-ring mt-2 w-full rounded-xl border border-foreground/10 bg-[#0E1426] px-3 py-3 font-mono text-xs text-white outline-none focus:border-[#86E3C0]"
                />
              </label>
              <label className="text-xs font-semibold lg:col-span-2">
                Indice
                <textarea
                  value={data.hint}
                  onChange={(e) => setData('hint', e.target.value)}
                  rows={2}
                  className="focus-ring mt-2 w-full rounded-xl border border-foreground/10 bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary"
                />
              </label>
              <div className="flex justify-end lg:col-span-2">
                <button
                  disabled={processing}
                  className="focus-ring rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background disabled:opacity-50"
                >
                  {processing ? 'Enregistrement…' : 'Enregistrer les changements'}
                </button>
              </div>
            </form>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AdminExercises({ exercises, filters }: ExercisesProps) {
  const [search, setSearch] = useState(filters.search)
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
      { search, status: filters.status },
      { preserveState: true, replace: true }
    )
  }

  function create(event: React.FormEvent) {
    event.preventDefault()
    createForm.post('/admin/exercises', {
      preserveScroll: true,
      onSuccess: () => createForm.reset(),
    })
  }

  return (
    <AdminLayout title="Un catalogue qui reste vivant.">
      <section className="surface rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow mb-2">Nouveau contenu</p>
            <h2 className="text-xl font-semibold">Créer un exercice</h2>
          </div>
        </div>
        <form onSubmit={create} className="mt-6 grid gap-4 lg:grid-cols-2">
          <label className="text-xs font-semibold">
            Titre
            <input
              required
              value={createForm.data.title}
              onChange={(e) => createForm.setData('title', e.target.value)}
              placeholder="Ex. Trouver le maximum"
              className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm font-normal outline-none focus:border-primary"
            />
          </label>
          <label className="text-xs font-semibold">
            Catégorie
            <input
              value={createForm.data.category}
              onChange={(e) => createForm.setData('category', e.target.value)}
              className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm font-normal outline-none focus:border-primary"
            />
          </label>
          <label className="text-xs font-semibold lg:col-span-2">
            Description
            <textarea
              required
              value={createForm.data.description}
              onChange={(e) => createForm.setData('description', e.target.value)}
              rows={2}
              className="focus-ring mt-2 w-full rounded-xl border border-foreground/10 bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary"
            />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs font-semibold">
              Difficulté
              <input
                type="number"
                min="1"
                value={createForm.data.difficulty}
                onChange={(e) => createForm.setData('difficulty', Number(e.target.value))}
                className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm font-normal outline-none focus:border-primary"
              />
            </label>
            <label className="text-xs font-semibold">
              Points
              <input
                type="number"
                min="1"
                value={createForm.data.points}
                onChange={(e) => createForm.setData('points', Number(e.target.value))}
                className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-3 text-sm font-normal outline-none focus:border-primary"
              />
            </label>
            <label className="text-xs font-semibold">
              Statut
              <select
                value={createForm.data.status}
                onChange={(e) => createForm.setData('status', e.target.value as Exercise['status'])}
                className="focus-ring mt-2 h-11 w-full rounded-xl border border-foreground/10 bg-background px-2 text-sm font-normal outline-none focus:border-primary"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </label>
          </div>
          <div className="flex items-end justify-end lg:col-span-2">
            <button
              disabled={createForm.processing}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background disabled:opacity-50"
            >
              {createForm.processing ? 'Création…' : 'Créer le brouillon'}{' '}
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>

      <section className="surface mt-6 overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-foreground/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="eyebrow mb-2">Catalogue</p>
            <h2 className="text-xl font-semibold">
              {exercises.meta?.total ?? exercises.data.length} exercices
            </h2>
          </div>
          <form onSubmit={applyFilters} className="flex gap-2">
            <label className="relative">
              <span className="sr-only">Rechercher un exercice</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Titre ou catégorie"
                className="focus-ring h-10 w-52 rounded-xl border border-foreground/10 bg-background pl-9 pr-3 text-xs outline-none focus:border-primary"
              />
            </label>
            <select
              defaultValue={filters.status}
              onChange={(e) =>
                router.get(
                  '/admin/exercises',
                  { search, status: e.target.value },
                  { preserveState: true, replace: true }
                )
              }
              className="focus-ring h-10 rounded-xl border border-foreground/10 bg-background px-2 text-xs outline-none focus:border-primary"
            >
              <option value="all">Tous</option>
              <option value="draft">Brouillons</option>
              <option value="published">Publiés</option>
              <option value="archived">Archivés</option>
            </select>
            <button className="focus-ring rounded-xl bg-foreground px-3 text-xs font-semibold text-background">
              Filtrer
            </button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Exercice</th>
                <th className="px-6 py-4 font-medium">Catégorie</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Valeur</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {exercises.data.map((exercise) => (
                <ExerciseEditor key={exercise.id} exercise={exercise} />
              ))}
            </tbody>
          </table>
        </div>
        {exercises.data.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            <CheckCircle2 className="mx-auto mb-3 h-5 w-5" aria-hidden="true" />
            Aucun exercice ne correspond à ces filtres.
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
