import Exercise from '#models/exercise'
import Submission from '#models/submission'
import User from '#models/user'
import UserProgress from '#models/user_progress'
import { DateTime } from 'luxon'

export default class UserProgressService {
  async renderExercisesWithProgress(page: number, user: User) {
    const exercises = await Exercise.query()
      .where('status', 'published')
      .orderBy('number', 'asc')
      .paginate(page, 16)
    const progresses = await UserProgress.query().where('user_id', user.id)
    const progressMap = new Map(progresses.map((progress) => [progress.exerciseId, progress]))

    return {
      exercises: exercises.all().map((exercise) => {
        const progress = progressMap.get(Number(exercise.id))
        return {
          ...exercise.serialize(),
          isUnlocked: progress?.isUnlocked ?? false,
          isCompleted: progress?.completed ?? false,
        }
      }),
      total: exercises.total,
      currentPage: exercises.currentPage,
      lastPage: exercises.lastPage,
    }
  }

  /** Rebuild every currently eligible unlock from the published catalog. */
  async reconcileProgress(user: User): Promise<void> {
    const exercises = await Exercise.query().where('status', 'published').orderBy('number', 'asc')
    if (exercises.length === 0) return

    const progresses = await UserProgress.query().where('user_id', user.id)
    const progressMap = new Map(progresses.map((progress) => [progress.exerciseId, progress]))
    const completedIds = new Set(
      progresses.filter((progress) => progress.completed).map((progress) => progress.exerciseId)
    )

    for (let index = 0; index < exercises.length; index += 1) {
      const exercise = exercises[index]
      const prerequisiteId = exercise.prerequisiteId
        ? Number(exercise.prerequisiteId)
        : index > 0
          ? Number(exercises[index - 1].id)
          : null
      const eligible = prerequisiteId === null || completedIds.has(prerequisiteId)
      if (!eligible) continue

      const existing = progressMap.get(Number(exercise.id))
      if (existing) {
        if (!existing.isUnlocked) {
          existing.isUnlocked = true
          existing.unlockedAt = existing.unlockedAt || DateTime.now()
          await existing.save()
        }
      } else {
        const created = await UserProgress.create({
          userId: user.id,
          exerciseId: Number(exercise.id),
          isUnlocked: true,
          completed: false,
          unlockedAt: DateTime.now(),
        })
        progressMap.set(Number(exercise.id), created)
      }
    }
  }

  async unlockNextExercise(user: User): Promise<void> {
    await this.reconcileProgress(user)
  }

  async completeExercise(user: User, exerciseId: string): Promise<void> {
    const progress = await UserProgress.query()
      .where('user_id', user.id)
      .where('exercise_id', exerciseId)
      .where('is_unlocked', true)
      .first()
    if (!progress) throw new Error('CHALLENGE_LOCKED')

    if (!progress.completed) {
      progress.completed = true
      progress.completedAt = DateTime.now()
      await progress.save()
    }
    await this.reconcileProgress(user)
  }

  async isUnlocked(userId: string, exerciseId: number): Promise<boolean> {
    return Boolean(
      await UserProgress.query()
        .where('user_id', userId)
        .where('exercise_id', exerciseId)
        .where('is_unlocked', true)
        .first()
    )
  }

  async getUserStats(user: User): Promise<{ completeCount: number; totalPoints: number }> {
    const completed = await UserProgress.query()
      .where('user_id', user.id)
      .where('completed', true)
    const completedIds = completed.map((progress) => progress.exerciseId)
    const points = completedIds.length
      ? await Exercise.query().whereIn('id', completedIds).sum('points as total')
      : []
    return { completeCount: completed.length, totalPoints: Number(points[0]?.$extras.total || 0) }
  }

  async getUsersWithStats() {
    const users = await User.all()
    return Promise.all(
      users.map(async (user) => {
        const stats = await this.getUserStats(user)
        return { ...user.serialize(), unlockedExercises: stats.completeCount, totalPoints: stats.totalPoints }
      })
    )
  }

  async currentStreak(userId: string): Promise<number> {
    const accepted = await Submission.query()
      .where('user_id', userId)
      .where('accepted', true)
      .whereNotNull('completed_at')
      .orderBy('completed_at', 'desc')
    const activeDays = new Set(
      accepted
        .map((submission) => submission.completedAt?.toUTC().toISODate())
        .filter((day): day is string => Boolean(day))
    )
    if (activeDays.size === 0) return 0

    const today = DateTime.utc().startOf('day')
    let cursor = activeDays.has(today.toISODate()!) ? today : today.minus({ days: 1 })
    let streak = 0
    while (activeDays.has(cursor.toISODate()!)) {
      streak += 1
      cursor = cursor.minus({ days: 1 })
    }
    return streak
  }
}
