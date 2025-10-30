import type { HttpContext } from '@adonisjs/core/http'
import TokenAuthAccessToken from '#models/token'

export default class LogoutsController {
  async execute({ auth, response }: HttpContext) {
    const user = auth.user

    // Logout from current session
    await auth.use('web').logout()

    // Cleanup remember me tokens for this user if they exist
    if (user) {
      await TokenAuthAccessToken.query()
        .where('tokenable_id', user.id)
        .where('type', 'remember_me_token')
        .delete()
    }

    return response.redirect().toRoute('auth-login.render')
  }
}
