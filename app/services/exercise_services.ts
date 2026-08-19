import { inject } from '@adonisjs/core'
import redis from '@adonisjs/redis/services/main'
import encryption from '@adonisjs/core/services/encryption'

import Exercise from '#models/exercise'
import UserSolution from '#models/user_solution'

interface ExerciseWithSolution extends Exercise {
  code?: string | null
}

@inject()
export default class ExerciseServices {
  private readonly CACHE_TTL = 60 * 60 * 24 // 24 hours in seconds
  private readonly CACHE_PREFIX = 'exercise:'

  async getExerciseWithSolution(exerciseId: string, userId: string): Promise<ExerciseWithSolution> {
    const cacheKey = `exercise:${exerciseId}:user:${userId}`

    try {
      // Try to get data from cache (fail-safe)
      try {
        const cachedData = await redis.get(cacheKey)
        if (cachedData) {
          return JSON.parse(cachedData)
        }
      } catch {
        // Cache inaccessible, on continue
      }

      // If not in cache, fetch from database
      const exercise = await Exercise.findOrFail(exerciseId)
      if (exercise.status !== 'published') {
        throw new Error('Exercise is not available in the public catalog')
      }
      const userSolution = await UserSolution.query()
        .where('user_id', userId)
        .where('exercise_id', exercise.id)
        .first()

      const code = userSolution?.code ? encryption.decrypt(userSolution.code) : null

      const result: ExerciseWithSolution = {
        ...(exercise.toJSON() as Exercise),
        code: code !== null ? String(code) : null,
      }

      // Cache the result (fail-safe)
      try {
        await redis.set(cacheKey, JSON.stringify(result), 'EX', this.CACHE_TTL)
      } catch {
        // Ignorer l'erreur d'écriture cache
      }

      return result
    } catch (error) {
      console.error('Error in getExerciseWithSolution:', error)
      throw new Error('Failed to retrieve exercise with solution')
    }
  }

  async saveSolution(
    userId: string,
    exerciseId: string,
    code: string | { code: string }
  ): Promise<void> {
    try {
      const exercise = await Exercise.findOrFail(exerciseId)
      if (exercise.status !== 'published') {
        throw new Error('Exercise is not available in the public catalog')
      }

      const userSolution = await UserSolution.firstOrCreate({
        userId,
        exerciseId: Number(exerciseId),
      })

      const normalizedCode = typeof code === 'string' ? code : code.code
      const encryptedCode = encryption.encrypt(normalizedCode)
      await userSolution.merge({ code: encryptedCode }).save()

      // Invalidate cache (fail-safe)
      try {
        const cacheKey = `exercise:${exerciseId}:user:${userId}`
        await redis.del(cacheKey)
      } catch {
        // Ignorer l'erreur d'invalidation cache
      }
    } catch (error) {
      console.error('Error in saveSolution:', error)
      throw new Error('Failed to save solution')
    }
  }

  async cleanupCache(): Promise<void> {
    try {
      // Récupérer toutes les clés avec le préfixe 'exercise:'
      const keys = await redis.keys(`${this.CACHE_PREFIX}*`)

      for (const key of keys) {
        // Vérifier si la clé a expiré
        const ttl = await redis.ttl(key)
        if (ttl <= 0) {
          await redis.del(key)
        }
      }
    } catch (error) {
      console.error('Error during cache cleanup:', error)
    }
  }

  // Méthode pour programmer le nettoyage périodique
  schedulePeriodicCleanup(intervalInHours: number = 24): void {
    setInterval(() => {
      this.cleanupCache()
    }, intervalInHours * this.CACHE_TTL)
  }
}
