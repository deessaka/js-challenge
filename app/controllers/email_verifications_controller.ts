import User from '#models/user'
import MailService from '#services/mail_service'
import TokenService from '#services/token_service'
import env from '#start/env'
import router from '#start/routes'
import { ResendVerificationValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

@inject()
export default class EmailVerificationsController {
  #domain = env.get('DOMAIN')

  constructor(
    private tokenService: TokenService,
    private mailService: MailService
  ) {}

  async verify({ params, response, session, auth }: HttpContext) {
    const { token } = params

    try {
      const user = await this.tokenService.getUserByEmailVerificationToken(token)

      if (!user) {
        session.flash('error', 'Invalid or expired verification token')
        return response.redirect().toRoute('auth-login.render')
      }

      // Mark email as verified
      user.emailVerifiedAt = DateTime.now()
      await user.save()

      // Revoke the verification token
      await this.tokenService.revokeEmailVerificationToken(user)

      session.flash('success', 'Email verified successfully! You can now log in.')

      // Auto-login the user
      await auth.use('web').login(user)

      return response.redirect().toRoute('home')
    } catch (error) {
      session.flash('error', 'An error occurred during email verification')
      return response.redirect().toRoute('auth-login.render')
    }
  }

  async resendVerification({ request, response, inertia, session, logger }: HttpContext) {
    try {
      // Validate email
      const { email } = await request.validateUsing(ResendVerificationValidator)

      // Find user by email
      const user = await User.query().where('email', email).first()

      if (!user) {
        // Don't reveal if user exists or not for security reasons
        session.flash(
          'success',
          'If an account exists with this email, a verification link has been sent.'
        )
        return inertia.render('auth/verify-email-pending', { email })
      }

      // Check if user is already verified
      if (user.emailVerifiedAt) {
        session.flash('error', 'This email address is already verified. Please log in.')
        return response.redirect().toRoute('auth-login.render')
      }

      // Check if user registered via OAuth (they don't need email verification)
      if (user.oauthProviderId) {
        session.flash(
          'error',
          'This account was created with OAuth and does not require email verification.'
        )
        return response.redirect().toRoute('auth-login.render')
      }

      // Generate new verification token (invalidates old ones)
      let emailSent = false
      try {
        const token = await this.tokenService.generateEmailVerificationToken(user)

        // Generate verification URL
        const verificationUrl = router.makeUrl('auth.verify-email', [token])

        // Send verification email
        await this.mailService.send({
          to: user.email,
          subject: 'Verify your email address',
          template: 'email/verify-email',
          data: {
            user,
            verificationUrl: `${this.#domain}${verificationUrl}`,
          },
        })
        emailSent = true
      } catch (emailError) {
        // Log error but don't expose to user
        logger.error('Failed to resend verification email:', emailError)
      }

      // Always show success message to prevent email enumeration
      session.flash(
        'success',
        emailSent
          ? 'Verification email sent successfully. Please check your inbox.'
          : 'Your request has been processed. If you do not receive an email, please contact support.'
      )

      return inertia.render('auth/verify-email-pending', { email })
    } catch (error) {
      logger.error('Error in resendVerification:', error)
      session.flash('error', 'An error occurred. Please try again.')

      // Return to the same page with the email from the request if available
      const email = request.input('email', '')
      return inertia.render('auth/verify-email-pending', { email })
    }
  }
}
