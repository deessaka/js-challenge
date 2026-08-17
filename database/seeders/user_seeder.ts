import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import UserProgress from '#models/user_progress'
import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
  async run() {
    const usersData = [
      {
        username: 'alex',
        email: 'alex@example.com',
        password: 'Password123!',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex',
        completedExercises: [] as number[],
        unlockedExercise: 1,
      },
      {
        username: 'sarah',
        email: 'sarah@example.com',
        password: 'Password123!',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah',
        completedExercises: [1, 2, 3],
        unlockedExercise: 4,
      },
      {
        username: 'julien',
        email: 'julien@example.com',
        password: 'Password123!',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=julien',
        completedExercises: [1, 2, 3, 4, 5, 6],
        unlockedExercise: 7,
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
          emailVerifiedAt: DateTime.now(),
        })
      } else {
        user.emailVerifiedAt = DateTime.now()
        user.password = data.password
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
