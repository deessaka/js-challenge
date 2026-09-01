import User from '#models/user'
import MailService from '#services/mail_service'
import TokenService from '#services/token_service'
import env from '#start/env'
import router from '#start/routes'
import { ResendVerificationValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import UserProgressService from '#services/user_progress'
import { portalDestination } from '#services/portal_destination_service'

function escapeLikeSpecialChars(value: string) {
  return value.replace(/[\\%_]/g, '\\$&')
}

@inject()
export default class EmailVerificationsController {
  #domain = env.get('DOMAIN')

  constructor(
    private tokenService: TokenService,
    private mailService: MailService,
    private progressService: UserProgressService
  ) {}

  async verify({ params, response, session, auth }: HttpContext) {
    const { token } = params

    try {
      const user = await this.tokenService.getUserByEmailVerificationToken(token)

      if (!user) {
        session.flash('error', 'Jeton de vérification invalide ou expiré.')
        return response.redirect().toPath('/auth/login')
      }

      // Mark email as verified
      user.emailVerifiedAt = DateTime.now()
      await user.save()

      // Revoke the verification token
      await this.tokenService.revokeEmailVerificationToken(user)

      session.flash('success', 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.')

      // Auto-login the user
      await auth.use('web').login(user)
      await this.progressService.reconcileProgress(user)
      return response.redirect().toPath(portalDestination(user))
    } catch (error) {
      session.flash('error', 'Une erreur est survenue lors de la vérification de l’email.')
      return response.redirect().toPath('/auth/login')
    }
  }

  async renderResend({ request, inertia }: HttpContext) {
    const email = request.qs().email
    return inertia.render('auth/verify-email-pending', {
      email: typeof email === 'string' ? email : '',
    })
  }

  async resendVerification({ request, response, inertia, session, logger }: HttpContext) {
    try {
      // Validate email
      const { email } = await request.validateUsing(ResendVerificationValidator)

      // Find user by email
      const user = await User.query().whereILike('email', escapeLikeSpecialChars(email)).first()

      if (!user) {
        // Don't reveal if user exists or not for security reasons
        session.flash(
          'success',
          'Si un compte existe avec cette adresse e-mail, un lien de vérification a été envoyé.'
        )
        return inertia.render('auth/verify-email-pending', { email })
      }

      // Check if user is already verified
      if (user.emailVerifiedAt) {
        session.flash('error', 'Cette adresse e-mail est déjà vérifiée. Veuillez vous connecter.')
        return response.redirect().toPath('/auth/login')
      }

      // Check if user registered via OAuth (they don't need email verification)
      if (user.oauthProviderId) {
        session.flash(
          'error',
          'Ce compte a été créé via OAuth et ne nécessite pas de vérification d’email.'
        )
        return response.redirect().toPath('/auth/login')
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
        logger.error({ err: emailError }, 'Failed to resend verification email')
      }

      // Always show success message to prevent email enumeration
      session.flash(
        'success',
        emailSent
          ? 'Email de vérification envoyé avec succès. Consultez votre boîte de réception.'
          : 'Votre demande a été traitée. Si vous ne recevez pas d’email, contactez le support.'
      )

      return inertia.render('auth/verify-email-pending', { email })
    } catch (error) {
      logger.error({ err: error }, 'Error in resendVerification')
      session.flash('error', 'Une erreur est survenue. Veuillez réessayer.')

      // Return to the same page with the email from the request if available
      const email = request.input('email', '')
      return inertia.render('auth/verify-email-pending', { email })
    }
  }
}
