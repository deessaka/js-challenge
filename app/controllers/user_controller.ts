import User from '#models/user'
import MailService from '#services/mail_service'
import TokenService from '#services/token_service'
import env from '#start/env'
import router from '#start/routes'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { PasswordResetRequestValidator, PasswordResetValidator } from '#validators/auth'
import TokenAuthAccessToken from '#models/token'

function escapeLikeSpecialChars(value: string) {
  return value.replace(/[\\%_]/g, '\\$&')
}

@inject()
export default class UserController {
  #domain = env.get('DOMAIN')
  constructor(
    private mailService: MailService,
    private tokenService: TokenService
  ) { }

  async profile({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    const tokens = await TokenAuthAccessToken.query()
      .where('tokenable_id', user.id)
      .where('type', 'auth_token')
      .orderBy('created_at', 'desc')
    return inertia.render('profile/show', {
      user: user.serialize(),
      tokens: tokens.map((token) => ({
        id: String(token.id),
        name: token.name || 'Client terminal',
        lastUsedAt: token.lastUsedAt?.toISO() || null,
        expiresAt: token.expiresAt?.toISO() || null,
        createdAt: token.createdAt?.toISO() || null,
      })),
    })
  }

  async render({ inertia }: HttpContext) {
    return inertia.render('password/edit', {})
  }

  async renderRequestReset({ inertia }: HttpContext) {
    return inertia.render('password/request', {})
  }

  async setPassword({ request, auth, response, session }: HttpContext) {
    const user = auth.use('web').user!
    const { password } = await request.validateUsing(PasswordResetValidator)
    await this.tokenService.revokePasswordResetToken(user)

    await user.merge({ password: password }).save()

    session.flash('success', 'Mot de passe mis à jour avec succès.')
    return response.redirect().back()
  }

  async requestReset({ request, response, session, logger }: HttpContext) {
    try {
      const { email } = await request.validateUsing(PasswordResetRequestValidator)

      const user = await User.query().whereILike('email', escapeLikeSpecialChars(email)).first()

      // Always show success message to avoid email enumeration
      if (!user) {
        session.flash(
          'success',
          'Si cette adresse e-mail existe, vous recevrez un lien de réinitialisation.'
        )
        return response.redirect().back()
      }

      const token = await this.tokenService.generatePasswordToken(user, 'PASSWORD_RESET')

      const resetUrl = router.makeUrl('password.reset', [token])

      // Try to send email (non-blocking)
      try {
        await this.mailService.send({
          to: user.email,
          subject: 'Reset your password',
          template: 'email/reset-password',
          data: {
            user,
            resetUrl: `${this.#domain}${resetUrl}`,
          },
        })
      } catch (emailError) {
        logger.error({ err: emailError }, 'Failed to send password reset email')
      }

      session.flash(
        'success',
        'Si cette adresse e-mail existe, vous recevrez un lien de réinitialisation.'
      )
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Une erreur est survenue. Veuillez réessayer.')
      return response.redirect().back()
    }
  }

  async renderResetForm({ params, response, session, inertia }: HttpContext) {
    const { token } = params

    try {
      const user = await this.tokenService.getUserPassword(token)

      if (!user) {
        session.flash('error', 'Jeton de réinitialisation invalide ou expiré.')
        return response.redirect().toPath('/auth/login')
      }

      return inertia.render('password/reset', { token })
    } catch (error) {
      session.flash('error', 'Une erreur est survenue. Veuillez réessayer.')
      return response.redirect().toPath('/auth/login')
    }
  }

  async resetPassword({ params, request, response, session, logger }: HttpContext) {
    const { token } = params

    try {
      const { password } = await request.validateUsing(PasswordResetValidator)

      const user = await this.tokenService.getUserPassword(token)

      if (!user) {
        session.flash('error', 'Jeton de réinitialisation invalide ou expiré.')
        return response.redirect().toPath('/auth/login')
      }

      // Update password
      user.password = password
      await user.save()

      // Revoke the reset token
      await this.tokenService.revokePasswordResetToken(user)

      // Try to send confirmation email (non-blocking)
      try {
        await this.mailService.send({
          to: user.email,
          subject: 'Password changed successfully',
          template: 'email/password-changed',
          data: { user },
        })
      } catch (emailError) {
        logger.error({ err: emailError }, 'Failed to send password confirmation email')
      }

      session.flash(
        'success',
        'Mot de passe réinitialisé avec succès. Vous pouvez désormais vous connecter avec votre nouveau mot de passe.'
      )
      return response.redirect().toPath('/auth/login')
    } catch (error) {
      session.flash('error', 'Une erreur est survenue. Veuillez réessayer.')
      return response.redirect().back()
    }
  }
}
