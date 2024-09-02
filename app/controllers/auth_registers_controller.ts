import type { HttpContext } from '@adonisjs/core/http'
import { AuthLoginValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthRegistersController {
  async render({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async execute({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(AuthLoginValidator)
    const user = await User.verifyCredentials(email, password)
    auth.use('web').login(user)
    return response.redirect().toRoute('auth-login.renders')
  }
}
