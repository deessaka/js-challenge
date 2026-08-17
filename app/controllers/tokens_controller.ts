import type { HttpContext } from '@adonisjs/core/http'
import TokenAuthAccessToken from '#models/token'

export default class TokensController {
  async index({ auth, response }: HttpContext) {
    const user = auth.use('web').user!
    const tokens = await TokenAuthAccessToken.query()
      .where('tokenable_id', user.id)
      .where('type', 'auth_token')
      .select(['id', 'name', 'abilities', 'last_used_at', 'expires_at', 'created_at'])
      .orderBy('created_at', 'desc')

    return response.ok({
      data: tokens.map((token) => ({
        id: String(token.id),
        name: token.name || 'Client terminal',
        lastUsedAt: token.lastUsedAt?.toISO() || null,
        expiresAt: token.expiresAt?.toISO() || null,
        createdAt: token.createdAt?.toISO() || null,
      })),
    })
  }

  async create({ auth, request, response, session }: HttpContext) {
    const user = auth.use('web').user!
    const name = String(request.input('name') || 'JS Challenge CLI')
      .trim()
      .slice(0, 80)
    const token = await auth.use('api').createToken(user, ['*'], {
      name: name || 'JS Challenge CLI',
      expiresIn: '365d',
    })

    const tokenValue = token.value?.release()
    if (!tokenValue) {
      return response.internalServerError({ error: 'Impossible de générer le token CLI.' })
    }

    session.flash('apiToken', tokenValue)
    session.flash(
      'success',
      'Votre token CLI a été généré. Copiez-le maintenant : il ne sera plus affiché ensuite.'
    )

    return response.redirect().back()
  }
}
