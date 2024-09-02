import User from '#models/user'
import OAuthService from '#services/oauth_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class OauthController {
  async redirect({ ally, params }: HttpContext) {
    return ally.use(params.provider).redirect()
  }

  async callback({ ally, params, auth, response, session }: HttpContext) {
    const socialUser = await ally.use(params.provider).user()

    await new OAuthService(socialUser, params.provider)
      .onFindOrCreate(async (user: User) => {
        await auth.use('web').login(user)
        return response.redirect().toRoute('home')
      })
      .onEmailExists((error: string) => {
        session.flash('error', error)
        return response.redirect().toRoute('auth-register.render')
      })
      .exec()
  }
}
