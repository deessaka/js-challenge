import User from '#models/user'
import OAuthService from '#services/oauth_service'
import UserProgressService from '#services/user_progress'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { RedirectRequest } from '@adonisjs/ally'
import logger from '@adonisjs/core/services/logger'
import { portalDestination } from '#services/portal_destination_service'

@inject()
export default class OauthController {
  constructor(private progressService: UserProgressService) {}

  async redirect({ ally, params }: HttpContext) {
    logger.info(`Starting OAuth redirect for provider: ${params.provider}`)
    return ally.use(params.provider).redirect((request: RedirectRequest<'user'>) => {
      request.scopes(['user:email'])
      request.param('allow_signup', true)
      request.param('prompt', 'select_account')
    })
  }

  async callback({ ally, params, auth, response, session }: HttpContext) {
    try {
      logger.info(`Processing OAuth callback for provider: ${params.provider}`)
      const gh = ally.use(params.provider)

      logger.info('Fetching user information from GitHub')
      const socialUser = await gh.user()
      logger.info(`GitHub user info received: ${socialUser.email}, verified: ${socialUser.emailVerificationState}`)

      await new OAuthService(socialUser, params.provider)
        .onFindOrCreate(async (user: User) => {
          logger.info(`User successfully authenticated: ${user.email}`)
          if (user.status === 'suspended') {
            session.flash('error', 'Votre compte est temporairement suspendu.')
            return response.redirect().toPath('/auth/login')
          }
          await auth.use('web').login(user)
          await this.progressService.reconcileProgress(user)
          return response.redirect().toPath(portalDestination(user))
        })
        .onEmailExists((error: string) => {
          logger.warn(`OAuth email exists error: ${error}`)
          session.flash('error', error)
          return response.redirect().toPath('/auth/login')
        })
        .onEmailNotVerified((error: string) => {
          logger.warn(`OAuth email not verified error: ${error}`)
          session.flash('error', error)
          return response.redirect().toPath('/auth/login')
        })
        .exec()
    } catch (error) {
      logger.error({ err: error, provider: params.provider }, 'OAuth authentication error')
      session.flash('error', 'An error occurred during OAuth authentication. Please try again.')
      return response.redirect().toPath('/auth/login')
    }
  }
}
