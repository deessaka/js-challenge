import User from '#models/user'
import MailService from '#services/mail_service'
import TokenService from '#services/token_service'
import env from '#start/env'
import router from '#start/routes'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { PasswordResetRequestValidator, PasswordResetValidator } from '#validators/auth'

@inject()
export default class UserController {
  #domain = env.get('DOMAIN')
  constructor(
    private mailService: MailService,
    private tokenService: TokenService
  ) {}

  async profile({ inertia, auth }: HttpContext) {
    const user = auth.use('web').user!
    return inertia.render('profile/show', { user })
  }

  async render({ inertia }: HttpContext) {
    return inertia.render('password/edit')
  }

  async renderRequestReset({ inertia }: HttpContext) {
    return inertia.render('password/request')
  }

  async setPassword({ request, auth, response, session }: HttpContext) {
    const user = auth.use('web').user!
    const { password } = await request.validateUsing(PasswordResetValidator)
    await this.tokenService.revokePasswordResetToken(user)

    await user.merge({ password: password }).save()

    session.flash('success', 'Password updated successfully')
    return response.redirect().back()
  }

  async requestReset({ request, response, session, logger }: HttpContext) {
    try {
      const { email } = await request.validateUsing(PasswordResetRequestValidator)

      const user = await User.query().where('email', email).first()

      // Always show success message to avoid email enumeration
      if (!user) {
        session.flash(
          'success',
          'If this email exists, you will receive a password reset link'
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
        logger.error('Failed to send password reset email:', emailError)
      }

      session.flash(
        'success',
        'If this email exists, you will receive a password reset link'
      )
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'An error occurred. Please try again.')
      return response.redirect().back()
    }
  }

  async renderResetForm({ params, response, session, inertia }: HttpContext) {
    const { token } = params

    try {
      const user = await this.tokenService.getUserPassword(token)

      if (!user) {
        session.flash('error', 'Invalid or expired password reset token')
        return response.redirect().toRoute('auth-login.render')
      }

      return inertia.render('password/reset', { token })
    } catch (error) {
      session.flash('error', 'An error occurred. Please try again.')
      return response.redirect().toRoute('auth-login.render')
    }
  }

  async resetPassword({ params, request, response, session, logger }: HttpContext) {
    const { token } = params

    try {
      const { password } = await request.validateUsing(PasswordResetValidator)

      const user = await this.tokenService.getUserPassword(token)

      if (!user) {
        session.flash('error', 'Invalid or expired password reset token')
        return response.redirect().toRoute('auth-login.render')
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
        logger.error('Failed to send password confirmation email:', emailError)
      }

      session.flash('success', 'Password reset successfully. You can now log in with your new password.')
      return response.redirect().toRoute('auth-login.render')
    } catch (error) {
      session.flash('error', 'An error occurred. Please try again.')
      return response.redirect().back()
    }
  }
}
