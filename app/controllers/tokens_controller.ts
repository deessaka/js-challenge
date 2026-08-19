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
    const name = String(request.input('name') || 'Codojo CLI')
      .trim()
      .slice(0, 80)
    const token = await auth.use('api').createToken(user, ['*'], {
      name: name || 'Codojo CLI',
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

  async revoke({ auth, params, response, session }: HttpContext) {
    const token = await TokenAuthAccessToken.query()
      .where('id', params.id)
      .where('tokenable_id', auth.use('web').user!.id)
      .where('type', 'auth_token')
      .first()

    if (!token) {
      session.flash('error', 'Token CLI introuvable.')
      return response.redirect().back()
    }
    await token.delete()
    session.flash('success', 'Token CLI révoqué.')
    return response.redirect().back()
  }
}
