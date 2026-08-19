import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import env from '#start/env'
import User from '#models/user'

export default class AdminSeeder extends BaseSeeder {
  async run() {
    const adminAccounts = [
      {
        username: 'ekodev_admin',
        email: 'ekodev@admin.com',
        password: 'Password123*',
        role: 'admin' as const,
        status: 'active' as const,
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ekodev_admin',
      },
    ]

    for (const account of adminAccounts) {
      let user = await User.findBy('email', account.email)
      if (!user) {
        await User.create({
          username: account.username,
          email: account.email,
          password: account.password,
          role: account.role,
          status: account.status,
          avatar: account.avatar,
          emailVerifiedAt: DateTime.now(),
        })
      } else {
        user.role = account.role
        user.status = account.status
        user.password = account.password
        user.emailVerifiedAt = DateTime.now()
        user.suspendedAt = null
        user.suspendedBy = null
        user.suspensionReason = null
        await user.save()
      }
    }

    const adminEmail = env.get('ADMIN_EMAIL')
    if (adminEmail) {
      const user = await User.query().where('email', adminEmail).first()
      if (user) {
        user.role = 'super_admin'
        user.status = 'active'
        user.suspendedAt = null
        user.suspendedBy = null
        user.suspensionReason = null
        await user.save()
      }
    }
  }
}
