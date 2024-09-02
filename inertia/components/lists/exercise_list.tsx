import { useMemo, useCallback } from 'react'
import ExerciseCard from '#components/cards/exercise_card'
import PaginationComponent from '#components/pagination/pagination'
import { PaginationProvider, usePagination } from '#components/context/pagination_context'
import { router } from '@inertiajs/react'
import Exercise from '#models/exercise'

interface ExerciseListProps {
  exercises: Exercise[]
}

function ExerciseListContent({ exercises }: ExerciseListProps) {
  const { currentPage, setCurrentPage, setTotalPages } = usePagination()
  const exercisesPerPage = 16

  const groupedExercises = useMemo(() => {
    const groups = []
    for (let i = 0; i < exercises.length; i += exercisesPerPage) {
      groups.push(exercises.slice(i, i + exercisesPerPage))
    }
    return groups
  }, [exercises])

  const currentGroupIndex = useMemo(() => {
    let index = 0
    for (const [i, groupedExercise] of groupedExercises.entries()) {
      if (groupedExercise.every((exercise) => !exercise.is_locked)) {
        index = i
      } else {
        break
      }
    }
    return index
  }, [groupedExercises])

  useMemo(() => {
    setTotalPages(currentGroupIndex + 1)
  }, [currentGroupIndex, setTotalPages])

  const currentExercises = useMemo(() => {
    return groupedExercises[currentPage - 1] || []
  }, [groupedExercises, currentPage])

  const handlePageChange = useCallback(
    (page: number) => {
      if (page <= currentGroupIndex + 1) {
        setCurrentPage(page)
      }
    },
    [setCurrentPage, currentGroupIndex]
  )

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3 mt-4 max-h-[calc(100vh-100px)] overflow-y-auto">
        {currentExercises.length === 0 && (
          <div className="col-span-full text-center">No Exercises</div>
        )}
        {currentExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            number={exercise.number}
            title={exercise.title}
            difficulty={exercise.difficulty}
            isLocked={exercise.is_locked}
            onClick={() => {
              if (exercise.is_locked === true) {
                return alert(
                  'This exercise is locked you need to unlock it first by passing the previous challenge'
                )
              } else {
                return router.replace(`/exercises/${exercise.id}`)
              }
            }}
          />
        ))}
      </div>
      <div className="mt-4">
        <PaginationComponent onPageChange={handlePageChange} />
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
