import Exercise from '#models/exercise'
import UserProgress from '#models/user_progress'
import {
  challengeProgressStatus,
  serializeChallenge,
  type ApiChallenge,
} from '#dto/api/challenge_dto'

export interface ChallengeListFilters {
  category?: string
  difficulty?: number
}

export interface ChallengeListResult {
  data: ApiChallenge[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export interface ProgressSummary {
  total: number
  completed: number
  unlocked: number
  inProgress: number
  points: number
  currentStreak: number
}

export interface ChallengeProgressResult {
  challengeId: string
  status: ReturnType<typeof challengeProgressStatus>
  attempts: number
  successfulAttempts: number
  lastAttemptAt: null
  completedAt: string | null
}

export default class ApiV1Service {
  async listChallenges(
    userId: string,
    page = 1,
    perPage = 16,
    filters: ChallengeListFilters = {}
  ): Promise<ChallengeListResult> {
    const query = Exercise.query().where('status', 'published').orderBy('number', 'asc')

    if (filters.category) query.where('category', filters.category)
    if (filters.difficulty) query.where('difficulty', filters.difficulty)

    const paginator = await query.paginate(page, perPage)
    const exercises = paginator.all()
    const progresses = exercises.length
      ? await UserProgress.query()
          .where('user_id', userId)
          .whereIn(
            'exercise_id',
            exercises.map((exercise) => Number(exercise.id))
          )
      : []
    const progressMap = new Map(
      progresses.map((progress) => [String(progress.exerciseId), progress])
    )

    return {
      data: exercises.map((exercise) =>
        serializeChallenge(exercise, progressMap.get(String(exercise.id)))
      ),
      meta: {
        total: paginator.total,
        perPage: paginator.perPage,
        currentPage: paginator.currentPage,
        lastPage: paginator.lastPage,
      },
    }
  }

  async findChallenge(userId: string, slugOrId: string): Promise<ApiChallenge | null> {
    const exercise = await Exercise.query()
      .where('status', 'published')
      .where((query) => query.where('slug', slugOrId).orWhere('id', slugOrId))
      .first()

    if (!exercise) return null

    const progress = await UserProgress.query()
      .where('user_id', userId)
      .where('exercise_id', Number(exercise.id))
      .first()

    return serializeChallenge(exercise, progress, { includeStarterCode: true })
  }

  async getProgressSummary(userId: string): Promise<ProgressSummary> {
    const [publishedExercises, progresses] = await Promise.all([
      Exercise.query().where('status', 'published'),
      UserProgress.query().where('user_id', userId),
    ])
    const completed = progresses.filter((progress) => progress.completed)
    const unlocked = progresses.filter((progress) => progress.isUnlocked)
    const completedIds = completed.map((progress) => progress.exerciseId)
    const pointsResult = completedIds.length
      ? await Exercise.query().whereIn('id', completedIds).sum('points as total')
      : []

    return {
      total: publishedExercises.length,
      completed: completed.length,
      unlocked: unlocked.length,
      inProgress: unlocked.filter((progress) => !progress.completed).length,
      points: Number(pointsResult[0]?.$extras.total || 0),
      currentStreak: 0,
    }
  }

  async getChallengeProgress(
    userId: string,
    challengeId: string
  ): Promise<ChallengeProgressResult | null> {
    const exercise = await Exercise.query()
      .where('status', 'published')
      .where('id', challengeId)
      .first()
    if (!exercise) return null

    const progress = await UserProgress.query()
      .where('user_id', userId)
      .where('exercise_id', Number(exercise.id))
      .first()

    return {
      challengeId: String(exercise.id),
      status: challengeProgressStatus(progress),
      attempts: 0,
      successfulAttempts: progress?.completed ? 1 : 0,
      lastAttemptAt: null,
      completedAt: progress?.completedAt?.toISO() || null,
    }
  }

  async getNextChallenge(userId: string): Promise<ApiChallenge | null> {
    const challenges = await this.listChallenges(userId, 1, 1000)
    return (
      challenges.data.find((challenge) => challenge.isUnlocked && !challenge.isCompleted) || null
    )
  }
}
