import Exercise from '#models/exercise'
import UserSolution from '#models/user_solution'
import redis from '@adonisjs/redis/services/main'
import encryption from '@adonisjs/core/services/encryption'

export default class ExerciseServices {
  async getExercises() {}

  async getExerciseWithSolution(exerciseId: string, userId: string) {
    const cacheKey = `exercise:${exerciseId}:user:${userId}`

    let data = await redis.get(cacheKey)
    if (data) {
      return JSON.parse(data)
    }

    const exercise = await Exercise.findOrFail(exerciseId)
    const userSolution = await UserSolution.query()
      .where('user_id', userId)
      .where('exercise_id', exercise.id)
      .first()

    const code = userSolution ? encryption.decrypt(userSolution.code) : null
    console.log('code', code)
    const result = {
      ...exercise.toJSON(),
      code: code,
    }

    await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600)

    return result
  }

  async saveSolution(userId: string, exerciseId: string, code: Record<string, string>) {
    const userSolution = await UserSolution.firstOrCreate({
      userId,
      exerciseId: Number(exerciseId),
    })
    const encryptedCode = encryption.encrypt(code)
    userSolution.merge({ code: encryptedCode })
    await userSolution.save()
  }
}
