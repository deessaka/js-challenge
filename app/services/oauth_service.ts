import User from '#models/user'
import { AllyUserContract, GithubToken, SocialProviders } from '@adonisjs/ally/types'

export default class OAuthService {
  #findOrCreateHandler: any
  #emailExistsHandler: any

  constructor(
    private socialUser: AllyUserContract<GithubToken>,
    private provider: SocialProviders
  ) {}

  async exec() {
    let user = await this.#findUser()
    if (!user && (await this.#verifyEmail())) {
      await this.#emailExistsHandler()
      return
    }

    if (!user) {
      user = await this.#createUser()
    }

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
    return await User.create({
      username: this.socialUser.nickName!,
      email: this.socialUser.email!,
      avatar: this.socialUser.avatarUrl!,
      oauthProviderName: String(this.provider),
      oauthProviderId: Number(this.socialUser.id)!,
    })
  }

  onFindOrCreate(handler: any) {
    this.#findOrCreateHandler = handler
    return this
  }

  onEmailExists(handler: any) {
    this.#emailExistsHandler = handler
    return this
  }

  then(resolve: any, reject?: any): any {
    return this.exec().then(resolve, reject)
  }
  catch(reject: any): any {
    return this.exec().catch(reject)
  }
  finally(fullfilled: any): any {
    return this.exec().finally(fullfilled)
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }
}
