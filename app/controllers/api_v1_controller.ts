import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { serializeApiUser } from '#dto/api/user_dto'
import { serializeSubmission } from '#dto/api/submission_dto'
import { SubmissionValidator } from '#validators/submission'
import ApiV1Service from '#services/api_v1_service'
import SubmissionService from '#services/submission_service'
import { ExecutionCapacityError } from '#services/execution_capacity'

@inject()
export default class ApiV1Controller {
  constructor(
    private apiV1Service: ApiV1Service,
    private submissionService: SubmissionService
  ) {}

  async me({ auth, response }: HttpContext) {
    const user = auth.use('api').user!
    return response.ok({ data: serializeApiUser(user) })
  }

  async challenges({ auth, request, response }: HttpContext) {
    const user = auth.use('api').user!
    const page = this.positiveInteger(request.input('page'), 1)
    const perPage = Math.min(this.positiveInteger(request.input('perPage'), 16), 50)
    const difficulty = request.input('difficulty')
    const category = request.input('category')

    const result = await this.apiV1Service.listChallenges(user.id, page, perPage, {
      difficulty: difficulty ? this.positiveInteger(difficulty, 0) : undefined,
      category: typeof category === 'string' && category.trim() ? category.trim() : undefined,
    })

    return response.ok(result)
  }

  async challenge({ auth, params, response }: HttpContext) {
    const user = auth.use('api').user!
    const challenge = await this.apiV1Service.findChallenge(user.id, String(params.slug))

    if (!challenge) {
      return response.notFound({ error: 'Challenge introuvable.' })
    }

    return response.ok({ data: challenge })
  }

  async progress({ auth, response }: HttpContext) {
    const user = auth.use('api').user!
    const summary = await this.apiV1Service.getProgressSummary(user.id)
    return response.ok({ data: summary })
  }

  async challengeProgress({ auth, params, response }: HttpContext) {
    const user = auth.use('api').user!
    const challengeId = params.challengeId ?? params.slug
    const progress = await this.apiV1Service.getChallengeProgress(user.id, String(challengeId))

    if (!progress) {
      return response.notFound({ error: 'Challenge introuvable.' })
    }

    return response.ok({ data: progress })
  }

  async nextChallenge({ auth, response }: HttpContext) {
    const user = auth.use('api').user!
    const challenge = await this.apiV1Service.getNextChallenge(user.id)
    return response.ok({ data: challenge })
  }

  async createSubmission({ auth, request, response }: HttpContext) {
    const user = auth.use('api').user!
    const payload = await request.validateUsing(SubmissionValidator)

    try {
      const submission = await this.submissionService.createAndExecute(user, payload)
      return response.created({ data: serializeSubmission(submission) })
    } catch (error) {
      if (error instanceof ExecutionCapacityError) {
        return response.status(429).header('Retry-After', String(error.retryAfterSeconds)).send({
          code: error.code,
          error: error.message,
          retryAfter: error.retryAfterSeconds,
        })
      }
      if (error instanceof Error && error.message === 'Challenge introuvable.') {
        return response.notFound({ error: error.message })
      }
      if (error instanceof Error && error.message === 'CHALLENGE_LOCKED') {
        return response.forbidden({
          code: 'CHALLENGE_LOCKED',
          error: 'Ce challenge est encore verrouillé.',
        })
      }
      throw error
    }
  }

  async submission({ auth, params, response }: HttpContext) {
    const user = auth.use('api').user!
    const submission = await this.submissionService.findForUser(user.id, String(params.id))

    if (!submission) {
      return response.notFound({ error: 'Soumission introuvable.' })
    }

    return response.ok({ data: serializeSubmission(submission) })
  }

  private positiveInteger(value: unknown, fallback: number): number {
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
  }
}
