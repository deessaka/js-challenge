import { useMemo, useCallback, useEffect } from 'react'
import ExerciseCard from '#components/cards/exercise_card'
import PaginationComponent from '#components/pagination/pagination'
import { PaginationProvider, usePagination } from '#components/context/pagination_context'
import { router } from '@inertiajs/react'
import Exercise from '#models/exercise'

interface Exo extends Exercise {
  isUnlocked: boolean
  isCompleted: boolean
  completedAt: Date | null
}

interface ExerciseListProps {
  data: { exercises: Exo[]; total: number; currentPage: number; lastPage: number }
}

function ExerciseListContent(exerciseList: ExerciseListProps) {
  const { setCurrentPage, setTotalPages } = usePagination()
  console.log(typeof exerciseList.data, 'data', exerciseList.data)
  const { exercises, total, currentPage, lastPage } = exerciseList.data
  const EXERCISES_PER_PAGE = 16

  // Grouper les exercices par pages de 16
  const groupedExercises = useMemo(() => {
    const groups = []
    for (let i = 0; i < total; i += EXERCISES_PER_PAGE) {
      groups.push(exercises.slice(i, i + EXERCISES_PER_PAGE))
    }
    return groups
  }, [exercises, total])

  // Trouver la dernière page accessible (où tous les exercices précédents sont débloqués)
  const lastAccessiblePage = useMemo(() => {
    let lastPage = 1
    for (let i = 0; i < groupedExercises.length; i++) {
      const currentGroup = groupedExercises[i]
      const allUnlocked = currentGroup.every((exercise) => exercise.isUnlocked)

      if (!allUnlocked) {
        break
      }
      lastPage = i + 1
    }
    return lastPage
  }, [groupedExercises])

  // Mettre à jour le nombre total de pages
  useEffect(() => {
    setTotalPages(lastPage)
  }, [lastPage, setTotalPages])

  // Obtenir les exercices de la page courante
  const currentExercises = useMemo(() => {
    return groupedExercises[currentPage - 1] || []
  }, [groupedExercises, currentPage])

  // Vérifier si la page demandée est accessible
  const isPageAccessible = useCallback(
    (page: number) => {
      if (page <= lastAccessiblePage) {
        return true
      }
      // Si on essaie d'accéder à la page suivante, vérifier si tous les exercices de la page courante sont débloqués
      if (page === lastAccessiblePage + 1) {
        const currentGroup = groupedExercises[lastAccessiblePage - 1]
        return currentGroup?.every((exercise) => exercise.isUnlocked) || false
      }
      return false
    },
    [groupedExercises, lastAccessiblePage]
  )

  // Gérer le changement de page
  const handlePageChange = useCallback(
    (page: number) => {
      if (isPageAccessible(page)) {
        setCurrentPage(page)
        router.get(`/?page=${page}`, undefined, { preserveState: true })
      }
    },
    [setCurrentPage, isPageAccessible]
  )

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3 mt-4 overflow-y-auto">
        {currentExercises.length === 0 && (
          <div className="col-span-full text-center">No Exercises</div>
        )}
        {currentExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            number={Number.parseInt(exercise.id)}
            title={exercise.title}
            difficulty={exercise.difficulty}
            isLocked={!exercise.isUnlocked}
            isCompleted={exercise.isCompleted}
            {...(exercise.isUnlocked && {
              onClick: () => {
                router.visit(`/exercises/${exercise.id}`, {
                  method: 'get',
                })
              },
            })}
          />
        ))}
      </div>
      <div className="mt-4">
        <PaginationComponent onPageChange={handlePageChange} isPageAccessible={isPageAccessible} />
      </div>
    </>
  )
}

function ExerciseList(props: ExerciseListProps) {
  return (
    <PaginationProvider>
      <ExerciseListContent {...props} />
    </PaginationProvider>
  )
}

export default ExerciseList
