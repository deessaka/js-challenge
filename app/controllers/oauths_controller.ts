import User from '#models/user'
import MailService from '#services/mail_service'
import OAuthService from '#services/oauth_service'
import UserProgressService from '#services/user_progress'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class OauthController {
  constructor(
    private progressService: UserProgressService,
    private mailService: MailService
  ) {}
  async redirect({ ally, params }: HttpContext) {
    return ally.use(params.provider).redirect()
  }

  async callback({ ally, params, auth, response, session }: HttpContext) {
    const socialUser = await ally.use(params.provider).user()

    await new OAuthService(socialUser, params.provider, this.mailService)
      .onFindOrCreate(async (user: User) => {
        await auth.use('web').login(user)
        await this.progressService.unlockNextExercise(user)
        return response.redirect().toRoute('home')
      })
      .onEmailExists((error: string) => {
        session.flash('error', error)
        return response.redirect().toRoute('auth-register.render')
      })
      .exec()
  }
}
