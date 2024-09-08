import { Card, CardHeader, CardTitle } from '#components/ui/components/ui/card'
import { StarIcon, Lock, LockOpenIcon, CheckCheck } from 'lucide-react'

interface Props {
  number: number
  title: string
  difficulty: number
  isLocked: boolean
  isCompleted: boolean
  onClick?: () => void
}

interface DifficultyStar {
  difficulty: number
}

const difficultyStarIcons = ({ difficulty }: DifficultyStar) => {
  const maxDifficulty = 10
  const totalStars = 4
  const normalizedDifficulty = difficulty / maxDifficulty
  const filledStars = normalizedDifficulty * totalStars

  const renderStar = (starIndex: number) => {
    const fillPercentage = Math.max(0, Math.min(1, filledStars - starIndex)) * 100
    return (
      <div key={starIndex} className="relative inline-block">
        <StarIcon size={12} className="text-gray-300" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
          <StarIcon size={12} className="text-yellow-400" fill="currentColor" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => renderStar(index))}
    </div>
  )
}

function ExerciseCard(props: Props) {
  const { title, difficulty, isLocked = true, number, onClick, isCompleted } = props

  const cardClasses = `
    relative
    p-4
    border
    rounded-lg
    shadow-md
    transition
    duration-300
    dark:bg-primary-dark 
    min-h-32
    max-h-32
    ${isLocked ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:shadow-lg cursor-pointer'}
  `

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-600">Exercise {number}</span>
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-600">{difficulty} points</span>
          {difficultyStarIcons({ difficulty: Number(difficulty) })}
        </div>
      </div>
      <h3
        className={`text-accent-content-light mt-4 font-rbBold text-sm text-wrap ${title.length > 16 ? 'line-clamp-2' : ''}`}
      >
        {title}
      </h3>
      {isLocked && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center rounded-lg">
          <Lock size={24} className="text-gray-500 shadow-sm roun" />
        </div>
      )}
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold p-1 rounded-full">
          <CheckCheck size={16} />
        </div>
      )}
    </div>
  )
}

export default ExerciseCard
