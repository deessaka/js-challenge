import Exercise from '#models/exercise'
import Submission from '#models/submission'
import UserProgress from '#models/user_progress'
import User from '#models/user'
import UserProgressService from '#services/user_progress'
import { inject } from '@adonisjs/core'
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
  lastAttemptAt: string | null
  completedAt: string | null
}

@inject()
export default class ApiV1Service {
  constructor(private userProgressService: UserProgressService) {}

  async listChallenges(
    userId: string,
    page = 1,
    perPage = 16,
    filters: ChallengeListFilters = {}
  ): Promise<ChallengeListResult> {
    const user = await User.findOrFail(userId)
    await this.userProgressService.reconcileProgress(user)
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
    const attemptedIds = new Set(
      exercises.length
        ? (
            await Submission.query()
              .where('user_id', userId)
              .whereIn(
                'exercise_id',
                exercises.map((exercise) => Number(exercise.id))
              )
              .select('exercise_id')
          ).map((submission) => String(submission.exerciseId))
        : []
    )

    return {
      data: exercises.map((exercise) =>
        serializeChallenge(exercise, progressMap.get(String(exercise.id)), {
          hasAttempts: attemptedIds.has(String(exercise.id)),
        })
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
    const user = await User.findOrFail(userId)
    await this.userProgressService.reconcileProgress(user)
    const exercise = await Exercise.query()
      .where('status', 'published')
      .where((query) => this.applySlugOrId(query, slugOrId))
      .first()

    if (!exercise) return null

    const progress = await UserProgress.query()
      .where('user_id', userId)
      .where('exercise_id', Number(exercise.id))
      .first()
    const hasAttempts = Boolean(
      await Submission.query()
        .where('user_id', userId)
        .where('exercise_id', Number(exercise.id))
        .first()
    )
    return serializeChallenge(exercise, progress, { includeStarterCode: true, hasAttempts })
  }

  async getProgressSummary(userId: string): Promise<ProgressSummary> {
    const user = await User.findOrFail(userId)
    await this.userProgressService.reconcileProgress(user)
    const [publishedExercises, progresses] = await Promise.all([
      Exercise.query().where('status', 'published'),
      UserProgress.query().where('user_id', userId),
    ])
    const publishedIds = new Set(publishedExercises.map((exercise) => Number(exercise.id)))
    const publicProgresses = progresses.filter((progress) => publishedIds.has(progress.exerciseId))
    const completed = progresses.filter((progress) => progress.completed)
    const unlocked = publicProgresses.filter((progress) => progress.isUnlocked)
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
      currentStreak: await this.userProgressService.currentStreak(userId),
    }
  }

  async getChallengeProgress(
    userId: string,
    challengeId: string
  ): Promise<ChallengeProgressResult | null> {
    const user = await User.findOrFail(userId)
    await this.userProgressService.reconcileProgress(user)
    const exercise = await Exercise.query()
      .where('status', 'published')
      .where((query) => this.applySlugOrId(query, challengeId))
      .first()
    if (!exercise) return null

    const progress = await UserProgress.query()
      .where('user_id', userId)
      .where('exercise_id', Number(exercise.id))
      .first()

    const submissions = await Submission.query()
      .where('user_id', userId)
      .where('exercise_id', Number(exercise.id))
      .select(['accepted', 'completed_at', 'created_at'])
      .orderBy('created_at', 'desc')
    const successfulAttempts = submissions.filter((submission) => submission.accepted).length

    return {
      challengeId: String(exercise.id),
      status:
        progress?.isUnlocked && !progress.completed && submissions.length > 0
          ? 'in_progress'
          : challengeProgressStatus(progress),
      attempts: submissions.length,
      successfulAttempts,
      lastAttemptAt:
        submissions[0]?.completedAt?.toISO() || submissions[0]?.createdAt?.toISO() || null,
      completedAt: progress?.completedAt?.toISO() || null,
    }
  }

  private applySlugOrId(query: any, slugOrId: string): void {
    const trimmed = slugOrId.trim()
    const match = /^exercise-(\d+)$/i.exec(trimmed)
    if (match) {
      const numeric = Number(match[1])
      query.where((q: any) =>
        q.where('id', numeric).orWhere('number', numeric).orWhere('slug', trimmed)
      )
    } else if (Number.isInteger(Number(trimmed))) {
      const numeric = Number(trimmed)
      query.where((q: any) =>
        q.where('id', numeric).orWhere('number', numeric).orWhere('slug', trimmed)
      )
    } else {
      query.where('slug', trimmed)
    }
  }

  async getNextChallenge(userId: string): Promise<ApiChallenge | null> {
    const user = await User.findOrFail(userId)
    await this.userProgressService.reconcileProgress(user)
    const progress = await UserProgress.query()
      .where('user_id', userId)
      .where('is_unlocked', true)
      .where('completed', false)
      .preload('exercise', (query) => query.where('status', 'published'))
      .orderBy('exercise_id', 'asc')
      .first()
    if (!progress?.exercise) return null
    return serializeChallenge(progress.exercise, progress)
  }
}
