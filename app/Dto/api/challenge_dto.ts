import Exercise from '#models/exercise'
import UserProgress from '#models/user_progress'

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard'
export type ChallengeStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface ApiChallenge {
  id: string
  slug: string
  number: number
  title: string
  description: string
  language: 'javascript'
  difficulty: number
  difficultyLabel: ChallengeDifficulty
  category: string
  points: number
  status: 'published'
  starterCode: string | null
  hint: string | null
  prerequisiteId: string | null
  isUnlocked: boolean
  isCompleted: boolean
  progressStatus: ChallengeStatus
}

export function difficultyLabel(value: number): ChallengeDifficulty {
  if (value >= 7) return 'easy'
  if (value >= 5) return 'medium'
  return 'hard'
}

export function challengeSlug(exercise: Exercise): string {
  return exercise.slug || `exercise-${exercise.number}`
}

export function serializeChallenge(
  exercise: Exercise,
  progress?: UserProgress | null,
  options: { includeStarterCode?: boolean; hasAttempts?: boolean } = {}
): ApiChallenge {
  const isUnlocked = progress?.isUnlocked ?? false
  const isCompleted = progress?.completed ?? false

  return {
    id: String(exercise.id),
    slug: challengeSlug(exercise),
    number: exercise.number,
    title: exercise.title,
    description: exercise.description,
    language: 'javascript',
    difficulty: exercise.difficulty,
    difficultyLabel: difficultyLabel(exercise.difficulty),
    category: exercise.category || 'JavaScript',
    points: exercise.points ?? 0,
    status: 'published',
    starterCode: options.includeStarterCode ? exercise.starterCode || null : null,
    hint: options.includeStarterCode ? exercise.hint || null : null,
    prerequisiteId: exercise.prerequisiteId ? String(exercise.prerequisiteId) : null,
    isUnlocked,
    isCompleted,
    progressStatus:
      isUnlocked && !isCompleted && options.hasAttempts
        ? 'in_progress'
        : challengeProgressStatus(progress),
  }
}

export function challengeProgressStatus(progress?: UserProgress | null): ChallengeStatus {
  if (!progress?.isUnlocked) return 'locked'
  if (progress.completed) return 'completed'
  return 'available'
}
