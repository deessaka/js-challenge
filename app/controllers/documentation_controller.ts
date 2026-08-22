import type { HttpContext } from '@adonisjs/core/http'
import { getDocumentationPage, listDocumentation } from '#services/documentation_service'

export default class DocumentationController {
  async index({ inertia }: HttpContext) {
    const documents = await listDocumentation()
    return inertia.render('docs/index', { documents })
  }

  async show({ params, inertia, response }: HttpContext) {
    const document = await getDocumentationPage(params.slug)
    if (!document) {
      return response.notFound('Documentation introuvable')
    }

    const documents = await listDocumentation()
    return inertia.render('docs/show', { document, documents })
  }
}
