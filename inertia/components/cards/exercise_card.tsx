import { Card, CardHeader, CardTitle } from '#components/ui/components/ui/card'
import { StarIcon, BracesIcon, Lock, LockOpenIcon, NotepadTextDashed } from 'lucide-react'

interface Props {
  number: number
  title: string
  difficulty: number
  isLocked: boolean
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
  const { title, difficulty, isLocked = true, number, onClick } = props

  const isLockedStyle = isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <Card
      onClick={onClick}
      className={`border-accent-content-light shadow-lg bg-card dark:border-primary-light dark:bg-primary-dark/70 drop-shadow-sm relative ${isLockedStyle} max-h-fit p-0`}
    >
      <div className="absolute -top-3 -right-1 flex items-center justify-center p-2 rounded-full bg-secondary-light dark:bg-secondary-light border border-accent-content-light dark:border-primary-light cursor-default">
        {isLocked ? <Lock size={12} /> : <LockOpenIcon size={12} />}
      </div>
      <CardHeader>
        <CardTitle className="flex flex-col gap-4">
          <div className="flex items-center gap-9 justify-center w-full">
            <div className="flex flex-col items-center justify-center rounded-lg border p-1">
              <span className="text-xl font-bold flex-1 text-center">Exo</span>
              <span className="text-sm font-bold flex-1 text-center">{number}</span>
            </div>
            <span className="text-accent-content-light font-rbBold text-md flex flex-col gap-1 justify-center items-center">
              <span className="font-dmBold text-xl">
                {difficulty > 1 ? `${difficulty} skys` : `${difficulty} sky`}
              </span>
              {difficultyStarIcons({ difficulty: Number(difficulty) })}
            </span>
          </div>
          <span
            className={`text-accent-content-light font-rbBold text-sm text-wrap ${title.length > 16 ? 'line-clamp-2' : ''}`}
          >
            {title}
          </span>
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

export default ExerciseCard
