import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import UserProgress from '#models/user_progress'
import env from '#start/env'
import { DateTime } from 'luxon'

export function shouldSeedTestUser(environment: string = env.get('NODE_ENV')) {
  return environment !== 'production'
}

export default class UserSeeder extends BaseSeeder {
  async run() {
    if (!shouldSeedTestUser()) {
      return
    }

    const usersData = [
      {
        username: 'ekodev_user',
        email: 'ekodev@user.com',
        password: 'Password123*',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ekodev_user',
        completedExercises: [] as number[],
        unlockedExercise: 1,
      },
    ]

    for (const data of usersData) {
      let user = await User.findBy('email', data.email)

      if (!user) {
        user = await User.create({
          username: data.username,
          email: data.email,
          password: data.password,
          avatar: data.avatar,
          role: 'user',
          status: 'active',
          emailVerifiedAt: DateTime.now(),
        })
      } else {
        user.username = data.username
        user.avatar = data.avatar
        user.role = 'user'
        user.status = 'active'
        user.emailVerifiedAt = DateTime.now()
        user.password = data.password
        user.suspendedAt = null
        user.suspendedBy = null
        user.suspensionReason = null
        await user.save()
      }

      // Seed progress for completed exercises
      for (const exId of data.completedExercises) {
        await UserProgress.updateOrCreate(
          { userId: user.id, exerciseId: exId },
          {
            isUnlocked: true,
            completed: true,
            unlockedAt: DateTime.now().minus({ days: 2 }),
            completedAt: DateTime.now().minus({ days: 1 }),
          }
        )
      }

      // Unlock current exercise
      if (data.unlockedExercise) {
        await UserProgress.updateOrCreate(
          { userId: user.id, exerciseId: data.unlockedExercise },
          {
            isUnlocked: true,
            completed: false,
            unlockedAt: DateTime.now(),
          }
        )
      }
    }
  }
}
