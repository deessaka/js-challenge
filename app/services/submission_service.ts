import encryption from '@adonisjs/core/services/encryption'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'

import Exercise from '#models/exercise'
import Submission, { type SubmissionResult } from '#models/submission'
import ExerciseServices from '#services/exercise_services'
import IsolatedTestRunner from '#services/test_runner_service'
import User from '#models/user'
import UserProgressService from '#services/user_progress'

export interface CreateSubmissionInput {
  challengeId: string
  code: string
  language: 'javascript'
  client: 'web' | 'vscode'
  clientVersion?: string
  idempotencyKey?: string
}

@inject()
export default class SubmissionService {
  constructor(
    private exerciseServices: ExerciseServices,
    private userProgressService: UserProgressService
  ) {}

  async createAndExecute(user: User, input: CreateSubmissionInput): Promise<Submission> {
    const exercise = await this.findPublishedExercise(input.challengeId)
    if (!exercise) throw new Error('Challenge introuvable.')

    if (input.idempotencyKey) {
      const existing = await Submission.query()
        .where('user_id', user.id)
        .where('idempotency_key', input.idempotencyKey)
        .first()
      if (existing) return existing
    }

    const submission = await Submission.create({
      userId: user.id,
      exerciseId: Number(exercise.id),
      status: 'queued',
      client: input.client,
      clientVersion: input.clientVersion || null,
      language: input.language,
      idempotencyKey: input.idempotencyKey || null,
      code: encryption.encrypt(input.code),
      accepted: null,
      results: [],
    })

    submission.status = 'running'
    submission.startedAt = DateTime.now()
    await submission.save()

    try {
      const result = await this.runTests(String(exercise.id), input.code)
      submission.status = result.success ? 'passed' : 'failed'
      submission.accepted = result.success
      submission.results = result.results
      submission.completedAt = DateTime.now()
      await submission.save()

      if (result.success) {
        await this.exerciseServices.saveSolution(user.id, String(exercise.id), { code: input.code })
        await this.userProgressService.completeExercise(user, String(exercise.id))
      }
    } catch (error) {
      submission.status = 'error'
      submission.accepted = false
      submission.results = this.normalizeResults(error)
      submission.errorMessage = error instanceof Error ? error.message : String(error)
      submission.completedAt = DateTime.now()
      await submission.save()
    }

    return submission
  }

  async findForUser(userId: string, submissionId: string): Promise<Submission | null> {
    return Submission.query().where('id', submissionId).where('user_id', userId).first()
  }

  private async findPublishedExercise(challengeId: string): Promise<Exercise | null> {
    return Exercise.query()
      .where('status', 'published')
      .where((query) => query.where('id', challengeId).orWhere('slug', challengeId))
      .first()
  }

  private runTests(
    exerciseId: string,
    code: string
  ): Promise<{ success: boolean; results: SubmissionResult[] }> {
    return new Promise((resolve, reject) => {
      const runner = new IsolatedTestRunner(exerciseId, { code })
        .onTestPassed((result: { results?: SubmissionResult[] }) => {
          resolve({ success: true, results: result.results || [] })
        })
        .onTestFailed((error: unknown) => {
          resolve({ success: false, results: this.normalizeResults(error) })
        })

      runner.exec().catch(reject)
    })
  }

  private normalizeResults(error: unknown): SubmissionResult[] {
    if (typeof error === 'object' && error !== null && 'results' in error) {
      const results = (error as { results?: unknown }).results
      if (Array.isArray(results)) return results as SubmissionResult[]
    }

    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message) as { message?: string; results?: unknown[] }
        if (Array.isArray(parsed.results)) return parsed.results as SubmissionResult[]
        return [
          {
            description: 'Runtime error',
            passed: false,
            error: parsed.message || error.message,
          },
        ]
      } catch {
        return [{ description: 'Runtime error', passed: false, error: error.message }]
      }
    }

    return [{ description: 'Erreur inconnue', passed: false, error: String(error) }]
  }
}
