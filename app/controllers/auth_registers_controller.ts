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

      const user = await User.verifyCredentials(email, password)

      if (user.status === 'suspended') {
        session.flash('error', 'Votre compte est temporairement suspendu.')
        return response.redirect().back()
      }

      // Check if email is verified (only for non-OAuth users)
      if (!user.oauthProviderId && !user.emailVerifiedAt) {
        session.flash('error', 'Please verify your email address before logging in')
        return response.redirect().back()
      }

      await auth.use('web').login(user, !!rememberMe)
      await this.progressService.reconcileProgress(user)
      const intended = session.get(PORTAL_INTENDED_KEY)
      session.forget(PORTAL_INTENDED_KEY)
      return response.redirect().toPath(intendedPortalDestination(intended, user))
    } catch (error) {
      if (error instanceof errors.E_INVALID_CREDENTIALS) {
        session.flash('error', 'Invalid credentials')
      } else {
        session.flash('error', 'An error occurred during login')
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
      const existingUser = await User.query().where('email', email).first()
      if (existingUser) {
        session.flash('error', 'An account with this email already exists')
        return response.redirect().back()
      }

      // Check if username already exists
      const existingUsername = await User.query().where('username', username).first()
      if (existingUsername) {
        session.flash('error', 'This username is already taken')
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
        logger.error('Failed to send verification email:', emailError)
      }

      // Show success message and render verify-email-pending page
      session.flash(
        'success',
        emailSent
          ? 'Account created successfully! Please check your email to verify your account.'
          : 'Account created successfully! Please check your email to verify your account.'
      )

      // Render the verify-email-pending page instead of redirecting to login
      return inertia.render('auth/verify-email-pending', { email: user.email })
    } catch (error) {
      session.flash('error', 'An error occurred during registration. Please try again.')
      return response.redirect().back()
    }
  }
}
