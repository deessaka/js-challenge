import { motion } from 'framer-motion'
import { StarIcon, Lock, CheckCheck } from 'lucide-react'

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

  return (
    <motion.div
      whileHover={!isLocked ? { y: -4, scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      className={`
        relative group p-5 border rounded-2xl transition-all duration-300 overflow-hidden
        ${isLocked
          ? 'bg-muted/40 border-border/30 cursor-not-allowed opacity-80'
          : 'bg-card border-border/50 hover:border-accent-light/50 hover:shadow-2xl hover:shadow-accent-light/5 shadow-sm cursor-pointer'
        }
      `}
    >
      {/* Exercise Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-0.5">Challenge</span>
          <span className="text-xl font-black text-foreground/20 group-hover:text-accent-light/20 transition-colors font-mono tracking-tighter">
            #{number.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold text-accent-light bg-accent-light/10 px-2 py-0.5 rounded-full ring-1 ring-accent-light/20">
            {difficulty} pts
          </span>
          {difficultyStarIcons({ difficulty: Number(difficulty) })}
        </div>
      </div>

      {/* Title */}
      <h3
        className={`text-foreground font-rbBold text-base leading-tight mt-2 ${isLocked ? 'text-muted-foreground/60' : ''} ${title.length > 20 ? 'line-clamp-2' : ''}`}
      >
        {title}
      </h3>

      {/* Bottom status/action */}
      <div className="mt-4 flex items-center justify-between">
        {isLocked ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/50">
            <Lock size={12} />
            <span>Verrouillé</span>
          </div>
        ) : (
          <div className={`text-xs font-bold ${isCompleted ? 'text-emerald-500' : 'text-accent-light group-hover:translate-x-1 transition-transform'}`}>
            {isCompleted ? 'Complété' : 'Lancer →'}
          </div>
        )}
      </div>

      {/* States Overlays & Badges */}
      {isLocked && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-muted/20" />
      )}

      {isCompleted && (
        <div className="absolute top-0 right-0 p-1.5 bg-emerald-500/10 rounded-bl-xl border-l border-b border-emerald-500/20">
          <CheckCheck size={14} className="text-emerald-500" />
        </div>
      )}
    </motion.div>
  )
}

export default ExerciseCard
