import type { HttpContext } from '@adonisjs/core/http'
import { AuthLoginValidator, AuthRegisterValidator } from '#validators/auth'
import User from '#models/user'
import MailService from '#services/mail_service'
import TokenService from '#services/token_service'
import { inject } from '@adonisjs/core'
import env from '#start/env'
import router from '#start/routes'
import { errors } from '@adonisjs/auth'
import UserProgressService from '#services/user_progress'
import {
  intendedPortalDestination,
  PORTAL_INTENDED_KEY,
} from '#services/portal_destination_service'

function escapeLikeSpecialChars(value: string) {
  return value.replace(/[\\%_]/g, '\\$&')
}

@inject()
export default class AuthRegistersController {
  #domain = env.get('DOMAIN')

  constructor(
    private mailService: MailService,
    private tokenService: TokenService,
    private progressService: UserProgressService
  ) { }

  async render({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async execute({ request, auth, response, session }: HttpContext) {
    try {
      const { email, password, rememberMe } = await request.validateUsing(AuthLoginValidator)

      const normalizedEmail = email.trim().toLowerCase()
      const user = await User.verifyCredentials(normalizedEmail, password)

      if (user.status === 'suspended') {
        session.flash('error', 'Votre compte est temporairement suspendu.')
        return response.redirect().back()
      }

      // Check if email is verified (only for non-OAuth users)
      if (!user.oauthProviderId && !user.emailVerifiedAt) {
        session.flash('error', 'Veuillez vérifier votre adresse e-mail avant de vous connecter.')
        return response.redirect().back()
      }

      await auth.use('web').login(user, !!rememberMe)
      await this.progressService.reconcileProgress(user)
      const intended = session.get(PORTAL_INTENDED_KEY)
      session.forget(PORTAL_INTENDED_KEY)
      return response.redirect().toPath(intendedPortalDestination(intended, user))
    } catch (error) {
      if (error instanceof errors.E_INVALID_CREDENTIALS) {
        session.flash('error', 'Identifiants invalides.')
      } else {
        session.flash('error', 'Une erreur est survenue lors de la connexion.')
      }
      return response.redirect().back()
    }
  }

  async renderRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register', {})
  }

  async register({ request, response, session, logger, inertia }: HttpContext) {
    try {
      const { email, password, username } = await request.validateUsing(AuthRegisterValidator)

      // Check if email already exists
      const existingUser = await User.query()
        .whereILike('email', escapeLikeSpecialChars(email))
        .first()
      if (existingUser) {
        session.flash('error', 'Un compte existe déjà avec cette adresse e-mail.')
        return response.redirect().back()
      }

      // Check if username already exists
      const existingUsername = await User.query()
        .whereILike('username', escapeLikeSpecialChars(username))
        .first()
      if (existingUsername) {
        session.flash('error', 'Ce nom d’utilisateur est déjà pris.')
        return response.redirect().back()
      }

      // Create user
      const user = await User.create({
        username,
        email,
        password,
      })

      // Try to send verification email (non-blocking)
      let emailSent = false
      try {
        // Generate email verification token
        const token = await this.tokenService.generateEmailVerificationToken(user)

        // Generate verification URL
        const verificationUrl = router.makeUrl('auth.verify-email', [token])

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
        logger.error({ err: emailError }, 'Failed to send verification email')
      }

      // Show success message and render verify-email-pending page
      session.flash(
        'success',
        emailSent
          ? 'Compte créé avec succès ! Consultez vos emails pour vérifier votre compte.'
          : 'Compte créé avec succès, mais l’envoi de l’email de vérification a échoué. Utilisez le bouton ci-dessous pour en demander un nouveau.'
      )

      // Render the verify-email-pending page instead of redirecting to login
      return inertia.render('auth/verify-email-pending', { email: user.email })
    } catch (error) {
      logger.error({ err: error }, 'Registration failed')
      session.flash('error', 'Une erreur est survenue lors de l’inscription. Veuillez réessayer.')
      return response.redirect().back()
    }
  }
}
