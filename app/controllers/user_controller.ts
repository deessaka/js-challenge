import User from '#models/user'
import MailService from '#services/mail_service'
import TokenService from '#services/token _service'
import env from '#start/env'
import router from '#start/routes'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const EmailValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
  })
)

const PasswordValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .minLength(8)
      .confirmed()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), // password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
  })
)

@inject()
export default class UserController {
  #domain = env.get('DOMAIN')
  constructor(
    private mailService: MailService,
    private tokenService: TokenService
  ) {}

  async render({ inertia }: HttpContext) {
    return inertia.render('password/edit')
  }

  async setPassword({ request, auth, response, session }: HttpContext) {
    const user = auth.use('web').user!
    const { password } = await request.validateUsing(PasswordValidator)
    await this.tokenService.revokePasswordResetToken(user)

    await user.merge({ password: password }).save()

    session.flash('success', 'Mot de passe mis à jour avec succès')
    return response.redirect().back()
  }

  async reset({ request, response, session }: HttpContext) {
    const { email } = await request.validateUsing(EmailValidator)
    const user = await User.findOrFail(email)
    const token = await this.tokenService.generatePasswordToken(user, 'PASSWORD_RESET')

    const resetUrl = router.makeUrl(`password.reset`, [token])

    this.mailService.send({
      to: user.email,
      subject: 'Reset your password',
      template: 'email/reset-password',
      data: {
        user,
        resetUrl: `${this.#domain}${resetUrl}`,
      },
    })

    session.flash(
      'success',
      'Si ce mail existe, vous recevrez un lien de réinitialisation de mot de passe par email'
    )
    return response.redirect().back()
  }
}
