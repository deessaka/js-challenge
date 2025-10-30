import TokenAuthAccessToken from '#models/token'
import { default as User } from '#models/user'
import string from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon'

export default class TokenService {
  async generatePasswordToken(user: User | null, type: string) {
    const token = string.generateRandom(64)

    if (!user) return token

    await this.expirePasswordResetToken(user)

    const record = await user.related('tokens').create({
      type,
      token,
      expiresAt: DateTime.now().plus({ hours: 1 }),
    })

    return record.token
  }

  async expirePasswordResetToken(user: User) {
    await user
      .related('passwordResetTokens')
      .query()
      .update({ expiresAt: DateTime.now().minus({ hours: 1 }) })
  }

  async getUserPassword(token: string) {
    const record = await TokenAuthAccessToken.query()
      .preload('user')
      .where('token', token)
      .where('expiresAt', '>', DateTime.now().toSQL())
      .orderBy('createdAt', 'desc')
      .first()
    if (!record) return

    return record?.user
  }

  async revokePasswordResetToken(user: User) {
    await user
      .related('passwordResetTokens')
      .query()
      .update({ expiresAt: DateTime.now().minus({ hours: 1 }) })
  }

  async generateEmailVerificationToken(user: User, type: string = 'EMAIL_VERIFICATION') {
    const token = string.generateRandom(64)

    await this.expireEmailVerificationToken(user)

    const record = await user.related('tokens').create({
      type,
      token,
      expiresAt: DateTime.now().plus({ hours: 24 }),
    })

    return record.token
  }

  async expireEmailVerificationToken(user: User) {
    await user
      .related('emailVerificationTokens')
      .query()
      .update({ expiresAt: DateTime.now().minus({ hours: 1 }) })
  }

  async getUserByEmailVerificationToken(token: string) {
    const record = await TokenAuthAccessToken.query()
      .preload('user')
      .where('token', token)
      .where('type', 'EMAIL_VERIFICATION')
      .where('expiresAt', '>', DateTime.now().toSQL())
      .orderBy('createdAt', 'desc')
      .first()

    if (!record) return null

    return record.user
  }

  async revokeEmailVerificationToken(user: User) {
    await user
      .related('emailVerificationTokens')
      .query()
      .update({ expiresAt: DateTime.now().minus({ hours: 1 }) })
  }

  async cleanupExpiredTokens() {
    await TokenAuthAccessToken.query()
      .where('expiresAt', '<', DateTime.now().toSQL())
      .delete()
  }
}
