import { BaseSeeder } from '@adonisjs/lucid/seeders'
import env from '#start/env'
import User from '#models/user'

export default class AdminSeeder extends BaseSeeder {
  async run() {
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
