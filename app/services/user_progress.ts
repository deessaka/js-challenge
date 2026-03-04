import Exercise from '#models/exercise'
import User from '#models/user'
import UserProgress from '#models/user_progress'
import { DateTime } from 'luxon'
import redis from '@adonisjs/redis/services/main'

export default class UserProgressService {
  /**
   * Render all exercises and their progress
   * @param {number} page
   * @param {User} user
   * @returns {Promise<{exercises: Exercise[], total: number, currentPage: number, lastPage: number}>}
   */
  async renderExercisesWithProgress(page: number, user: User): Promise<any> {
    const exercises = await Exercise.query().orderBy('id', 'asc').paginate(page, 16)
    const progresses = await UserProgress.query()
      .where('user_id', user.id)
      .orderBy('exercise_id', 'asc')

    const progressMap = new Map(progresses.map((progress) => [progress.exerciseId, progress]))

    const exercisesWithProgress = exercises.toJSON().data.map((exercise) => {
      const progress = progressMap.get(exercise.id)
      return {
        ...exercise.toJSON(),
        isUnlocked: progress?.$attributes.isUnlocked ?? false,
        isCompleted: progress?.$attributes.completed ?? false,
      }
    })

    return {
      exercises: exercisesWithProgress,
      total: exercises.total,
      currentPage: exercises.currentPage,
      lastPage: exercises.lastPage,
    }
  }

  /**
   * render all exercises and their progress
   * Check if there is a next exercise to unlock
   * @param {User} user
   * @returns {Promise<void>}
   */
  async unlockNextExercise(user: User): Promise<void> {
    const lastCompletedExercise = await UserProgress.query()
      .where('user_id', user.id)
      .where('completed', true)
      .orderBy('exercise_id', 'desc')
      .first()

    const nextExerciseId = lastCompletedExercise ? lastCompletedExercise.exerciseId + 1 : 1
    try {
      const nextExercise = await Exercise.find(nextExerciseId)
      if (!nextExercise) {
        // Just return gracefully if no exercise is found (e.g. empty database)
        return
      }

      await UserProgress.firstOrCreate({
        userId: user.id,
        exerciseId: Number(nextExercise.id),
        isUnlocked: true,
        completed: false,
        unlockedAt: DateTime.now(),
      })
    } catch (error) {
      console.log('error unlocking exercise:', error)
      // Do not throw here so it doesn't break the auth flow
    }
  }

  /**
   * Mark an exercise as completed and unlock the next exercise
   * @param {User} user
   * @param {number} exerciseId
   */
  async completeExercise(user: User, exerciseId: string): Promise<void> {
    const progress = await UserProgress.query()
      .where('user_id', user.id)
      .where('exercise_id', exerciseId)
      .first()

    if (progress && !progress.completed) {
      progress.completed = true
      progress.completedAt = DateTime.now()
      await progress.save()

      await this.unlockNextExercise(user)
    }
  }

  /**
   * Get the user statistics
   * @param {User} user
   * @returns {Promise<{ completeCount: number; totalPoints: number }>}
   */
  async getUserStats(user: User): Promise<{ completeCount: number; totalPoints: number }> {
    const completedExercises = await UserProgress.query()
      .where('user_id', user.id)
      .where('completed', true)

    const totalPoints = await Exercise.query()
      .whereIn(
        'id',
        completedExercises.map((progress) => progress.exerciseId)
      )
      .sum('difficulty')

    return {
      completeCount: completedExercises.length,
      totalPoints: totalPoints[0].$extras.sum || 0,
    }
  }

  /**
   * get all users with their stats
   * @returns {Promise<{users: User[], total: number, currentPage: number, lastPage: number}>}
   */

  async getUsersWithStats() {
    const users = await User.all()
    const userStat = users.map(async (user) => {
      const stats = await this.getUserStats(user)
      return {
        ...user.toJSON(),
        unlockedExercises: stats.completeCount,
        totalPoints: stats.totalPoints,
      }
    })
    const usersWithStats = await Promise.all(userStat)
    await redis.set('users:stats', JSON.stringify(usersWithStats), 'EX', 3600)
    return usersWithStats
  }
}
