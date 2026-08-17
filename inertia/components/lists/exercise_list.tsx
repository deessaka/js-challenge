import { router } from '@inertiajs/react'
import { useCallback, useEffect, useMemo } from 'react'

import ExerciseCard from '#components/cards/exercise_card'
import PaginationComponent from '#components/pagination/pagination'
import { PaginationProvider, usePagination } from '#components/context/pagination_context'

interface ExerciseItem {
  id: number | string
  title: string
  difficulty: number
  isUnlocked: boolean
  isCompleted: boolean
  completedAt: Date | null
}

interface ExerciseListProps {
  data: { exercises: ExerciseItem[]; total: number; currentPage: number; lastPage: number }
}

function ExerciseListContent({ data }: ExerciseListProps) {
  const { setCurrentPage, setTotalPages } = usePagination()
  const { exercises, total, currentPage, lastPage } = data
  const exercisesPerPage = 16

  const groupedExercises = useMemo(() => {
    const groups: ExerciseItem[][] = []
    for (let index = 0; index < exercises.length; index += exercisesPerPage) {
      groups.push(exercises.slice(index, index + exercisesPerPage))
    }
    return groups
  }, [exercises])

  const lastAccessiblePage = useMemo(() => {
    let page = 1
    groupedExercises.forEach((group, index) => {
      if (group.every((exercise) => exercise.isUnlocked)) page = index + 1
    })
    return Math.min(Math.max(page, 1), lastPage || 1)
  }, [groupedExercises, lastPage])

  useEffect(() => {
    setTotalPages(lastPage || 1)
  }, [lastPage, setTotalPages])

  const currentExercises = groupedExercises[currentPage - 1] || []

  const isPageAccessible = useCallback(
    (page: number) => page >= 1 && page <= lastAccessiblePage,
    [lastAccessiblePage]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      if (!isPageAccessible(page)) return
      setCurrentPage(page)
      router.get(`/home?page=${page}`, undefined, { preserveState: true, preserveScroll: true })
    },
    [isPageAccessible, setCurrentPage]
  )

  return (
    <section aria-labelledby="challenge-list-title">
      <div className="flex flex-col gap-4 border-b border-foreground/10 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div>
          <p className="eyebrow">Bibliothèque</p>
          <h2 id="challenge-list-title" className="mt-2 text-2xl font-semibold tracking-tight">
            Tous les challenges
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} exercices pour muscler vos réflexes JavaScript.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" /> Débloqué
          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" aria-hidden="true" />{' '}
          Verrouillé
        </div>
      </div>

      {currentExercises.length === 0 ? (
        <div className="px-6 py-16 text-center text-muted-foreground">
          Aucun challenge disponible pour le moment.
        </div>
      ) : (
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3 xl:grid-cols-4">
          {currentExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              number={Number(exercise.id)}
              title={exercise.title}
              difficulty={exercise.difficulty}
              isLocked={!exercise.isUnlocked}
              isCompleted={exercise.isCompleted}
              onClick={
                exercise.isUnlocked ? () => router.visit(`/exercises/${exercise.id}`) : undefined
              }
            />
          ))}
        </div>
      )}

      <div className="border-t border-foreground/10 px-5 py-5 sm:px-7">
        <PaginationComponent onPageChange={handlePageChange} isPageAccessible={isPageAccessible} />
      </div>
    </section>
  )
}

export default function ExerciseList(props: ExerciseListProps) {
  return (
    <PaginationProvider>
      <ExerciseListContent {...props} />
    </PaginationProvider>
  )
}
