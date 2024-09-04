import Exercise from '#models/exercise'
import User from '#models/user'
import UserProgress from '#models/user_progress'
import { DateTime } from 'luxon'

export default class UserProgressService {
  /**
   * Render all exercises and their progress
   * @param {number} page
   * @returns {Promise<Exercise[]>}
   */
  async renderExercisesWithProgress(page: number): Promise<any> {
    const exercises = await Exercise.query().orderBy('id', 'asc').paginate(page, 16)
    return exercises.toJSON()
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
      const nextExercise = await Exercise.findOrFail(nextExerciseId)
      nextExercise.is_locked = false
      await nextExercise.save()

      await UserProgress.firstOrCreate({
        userId: user.id,
        exerciseId: Number(nextExercise.id),
        completed: false,
      })
    } catch (error) {
      console.log('error', error)
      throw new Error('Exercise not found', error)
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
      totalPoints: totalPoints[0].$extras.total || 0,
    }
  }
}
