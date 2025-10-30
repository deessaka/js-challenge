import User from '#models/user'
import { AllyUserContract, GithubToken, SocialProviders } from '@adonisjs/ally/types'
import MailService from './mail_service.js'
import TokenService from './token_service.js'
import env from '#start/env'
import router from '#start/routes'
import logger from '@adonisjs/core/services/logger'

type FindOrCreateHandler = (user: User) => void | Promise<void>
type ErrorMessageHandler = (message: string) => void | Promise<void>

export default class OAuthService {
  #findOrCreateHandler?: FindOrCreateHandler
  #emailExistsHandler?: ErrorMessageHandler
  #emailNotVerifiedHandler?: ErrorMessageHandler
  #domain = env.get('DOMAIN')

  constructor(
    private socialUser: AllyUserContract<GithubToken>,
    private provider: SocialProviders,
    private mailService: MailService,
    private tokenService: TokenService
  ) {}

  async exec(): Promise<void> {
    logger.info('Starting OAuth execution', {
      provider: this.provider,
      email: this.socialUser.email,
      id: this.socialUser.id
    })

    // Check if email is verified by OAuth provider
    if (!this.socialUser.emailVerificationState || this.socialUser.emailVerificationState !== 'verified') {
      logger.warn('Email not verified by provider', {
        email: this.socialUser.email,
        state: this.socialUser.emailVerificationState
      })
      if (this.#emailNotVerifiedHandler) {
        await this.#emailNotVerifiedHandler('Your email must be verified on GitHub before signing in')
        return
      }
      throw new Error('Email not verified by OAuth provider')
    }

    let user = await this.#findUser()
    logger.info('Existing user check', { found: !!user })

    if (!user && (await this.#verifyEmail())) {
      logger.warn('Email already exists with different account', {
        email: this.socialUser.email
      })
      if (this.#emailExistsHandler) {
        await this.#emailExistsHandler('An account with this email already exists. Please login with your password.')
        return
      }
      throw new Error('Email already exists')
    }

    if (!user) {
      logger.info('Creating new user', {
        email: this.socialUser.email,
        username: this.socialUser.nickName
      })
      user = await this.#createUser()
      await this.#sendVerificationEmail()
    }

    if (!this.#findOrCreateHandler) {
      throw new Error('FindOrCreateHandler must be set before executing OAuthService')
    }

    logger.info('OAuth authentication successful', {
      userId: user.id,
      email: user.email
    })

    await this.#findOrCreateHandler(user)
  }

  async #findUser() {
    return await User.query()
      .where('oauth_provider_id', this.socialUser.id)
      .where('oauth_provider_name', String(this.provider))
      .first()
  }

  async #verifyEmail() {
    return (await User.query().where('email', this.socialUser.email!).first()) !== null
  }

  async #createUser() {
    logger.info('Creating user with data:', {
      username: this.socialUser.nickName,
      email: this.socialUser.email,
      providerId: this.socialUser.id
    })

    return await User.create({
      username: this.socialUser.nickName!,
      email: this.socialUser.email!,
      avatar: this.socialUser.avatarUrl!,
      oauthProviderName: String(this.provider),
      oauthProviderId: this.socialUser.id,
    })
  }

  async #sendVerificationEmail() {
    try {
      // Get the user from database to generate token
      const user = await User.query()
        .where('oauth_provider_id', this.socialUser.id)
        .where('oauth_provider_name', String(this.provider))
        .firstOrFail()

      // Generate email verification token
      const token = await this.tokenService.generateEmailVerificationToken(user)

      // Generate verification URL
      const verificationUrl = router.makeUrl('auth.verify-email', [token])

      return await this.mailService.send({
        to: this.socialUser.email!,
        subject: 'Verify your email address',
        template: 'email/verify-email',
        data: {
          user: this.socialUser,
          verificationUrl: `${this.#domain}${verificationUrl}`,
        },
      })
    } catch (error) {
      // Log the error but don't throw - email sending is optional
      console.error('Failed to send verification email:', error)
    }
  }

  onFindOrCreate(handler: FindOrCreateHandler) {
    this.#findOrCreateHandler = handler
    return this
  }

  onEmailExists(handler: ErrorMessageHandler) {
    this.#emailExistsHandler = handler
    return this
  }

  onEmailNotVerified(handler: ErrorMessageHandler) {
    this.#emailNotVerifiedHandler = handler
    return this
  }

  then<T = void>(
    resolve: (value: void) => T | PromiseLike<T>,
    reject?: (reason: unknown) => T | PromiseLike<T>
  ): Promise<T> {
    return this.exec().then(resolve, reject)
  }

  catch<T = never>(reject: (reason: unknown) => T | PromiseLike<T>): Promise<void | T> {
    return this.exec().catch(reject)
  }

  finally(fulfilled: () => void | PromiseLike<void>): Promise<void> {
    return this.exec().finally(fulfilled) as Promise<void>
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }
}
