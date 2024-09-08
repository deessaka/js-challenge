import { useMemo, useCallback } from 'react'
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

function ExerciseListContent({ data }: ExerciseListProps) {
  const { setCurrentPage, setTotalPages } = usePagination()
  const { exercises, total, currentPage, lastPage } = data
  const exercisesPerPage = exercises.length

  const groupedExercises = useMemo(() => {
    const groups = []
    for (let i = 0; i < total; i += exercisesPerPage) {
      groups.push(exercises.slice(i, i + exercisesPerPage))
    }
    return groups
  }, [data])

  const currentGroupIndex = useMemo(() => {
    let index = 0
    for (const [i, groupedExercise] of groupedExercises.entries()) {
      if (groupedExercise.every((exercise) => exercise.isUnlocked)) {
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
                router.replace(`/exercises/${exercise.id}`)
              },
            })}
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
