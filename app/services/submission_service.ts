import encryption from '@adonisjs/core/services/encryption'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'

import Exercise from '#models/exercise'
import Submission, { type SubmissionResult } from '#models/submission'
import ExerciseServices from '#services/exercise_services'
import IsolatedTestRunner from '#services/test_runner_service'
import User from '#models/user'
import UserProgressService from '#services/user_progress'
import executionCapacity, { ExecutionCapacityError } from '#services/execution_capacity'

interface TestRunResult {
  success: boolean
  results: SubmissionResult[]
  consoleLogs: string[]
}

export interface CreateSubmissionInput {
  challengeId: string
  code: string
  language: 'javascript'
  client: 'web' | 'terminal'
  clientVersion?: string
  idempotencyKey?: string
  dryRun?: boolean
}

@inject()
export default class SubmissionService {
  constructor(
    private exerciseServices: ExerciseServices,
    private userProgressService: UserProgressService
  ) {}

  async createAndExecute(user: User, input: CreateSubmissionInput): Promise<Submission> {
    return executionCapacity.run(() => this.executeSubmission(user, input))
  }

  private async executeSubmission(user: User, input: CreateSubmissionInput): Promise<Submission> {
    const exercise = await this.findPublishedExercise(input.challengeId)
    if (!exercise) throw new Error('Challenge introuvable.')

    await this.userProgressService.reconcileProgress(user)
    if (!(await this.userProgressService.isUnlocked(user.id, Number(exercise.id)))) {
      throw new Error('CHALLENGE_LOCKED')
    }

    if (input.dryRun) {
      const drySubmission = new Submission()
      drySubmission.id = 0
      drySubmission.userId = user.id
      drySubmission.exerciseId = Number(exercise.id)
      drySubmission.client = input.client
      drySubmission.clientVersion = input.clientVersion || null
      drySubmission.language = input.language
      drySubmission.startedAt = DateTime.now()
      drySubmission.createdAt = DateTime.now()

      try {
        const result = await this.runTests(String(exercise.number), input.code, true)
        drySubmission.status = result.success ? 'passed' : 'failed'
        drySubmission.accepted = result.success
        drySubmission.results = result.results
        drySubmission.consoleLogs = result.consoleLogs
        drySubmission.completedAt = DateTime.now()
      } catch (error) {
        if (error instanceof ExecutionCapacityError) throw error
        const normalized = this.normalizeExecutionError(error)
        drySubmission.status = normalized.timeout ? 'timeout' : 'error'
        drySubmission.accepted = false
        drySubmission.results = normalized.results
        drySubmission.consoleLogs = normalized.consoleLogs
        drySubmission.errorMessage = normalized.message
        drySubmission.completedAt = DateTime.now()
      }

      return drySubmission
    }

    if (input.idempotencyKey) {
      const existing = await Submission.query()
        .where('user_id', user.id)
        .where('idempotency_key', input.idempotencyKey)
        .first()
      if (existing) return existing
    }

    let submission: Submission
    try {
      submission = await Submission.create({
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
    } catch (error) {
      if (input.idempotencyKey && this.isUniqueViolation(error)) {
        const existing = await Submission.query()
          .where('user_id', user.id)
          .where('idempotency_key', input.idempotencyKey)
          .firstOrFail()
        return existing
      }
      throw error
    }

    submission.status = 'running'
    submission.startedAt = DateTime.now()
    await submission.save()

    try {
      const result = await this.runTests(String(exercise.number), input.code)
      submission.status = result.success ? 'passed' : 'failed'
      submission.accepted = result.success
      submission.results = result.results
      submission.consoleLogs = result.consoleLogs
      submission.completedAt = DateTime.now()
      await submission.save()

      if (result.success) {
        await this.exerciseServices.saveSolution(user.id, String(exercise.id), { code: input.code })
        await this.userProgressService.completeExercise(user, String(exercise.id))
      }
    } catch (error) {
      if (error instanceof ExecutionCapacityError) throw error
      const normalized = this.normalizeExecutionError(error)
      submission.status = normalized.timeout ? 'timeout' : 'error'
      submission.accepted = false
      submission.results = normalized.results
      submission.consoleLogs = normalized.consoleLogs
      submission.errorMessage = normalized.message
      submission.completedAt = DateTime.now()
      await submission.save()
    }

    return submission
  }

  async findForUser(userId: string, submissionId: string): Promise<Submission | null> {
    return Submission.query().where('id', submissionId).where('user_id', userId).first()
  }

  private async findPublishedExercise(challengeId: string): Promise<Exercise | null> {
    const trimmed = challengeId.trim()
    const match = /^exercise-(\d+)$/i.exec(trimmed)
    return Exercise.query()
      .where('status', 'published')
      .where((query) => {
        if (match) {
          const numeric = Number(match[1])
          query.where('id', numeric).orWhere('number', numeric).orWhere('slug', trimmed)
        } else if (Number.isInteger(Number(trimmed))) {
          const numeric = Number(trimmed)
          query.where('id', numeric).orWhere('number', numeric).orWhere('slug', trimmed)
        } else {
          query.where('slug', trimmed)
        }
      })
      .first()
  }

  private runTests(
    exerciseId: string,
    code: string,
    isDryRun: boolean = false
  ): Promise<TestRunResult> {
    return new Promise((resolve, reject) => {
      const runner = new IsolatedTestRunner(exerciseId, { code, dryRun: isDryRun })
        .onTestPassed((result: { results?: SubmissionResult[]; consoleLogs?: string[] }) => {
          resolve({
            success: true,
            results: result.results || [],
            consoleLogs: result.consoleLogs || [],
          })
        })
        .onTestFailed((error: unknown) => {
          const normalized = this.normalizeExecutionError(error)
          resolve({
            success: false,
            results: normalized.results,
            consoleLogs: normalized.consoleLogs,
          })
        })

      runner.exec().catch(reject)
    })
  }

  private normalizeExecutionError(error: unknown): {
    results: SubmissionResult[]
    consoleLogs: string[]
    message: string
    timeout: boolean
  } {
    if (typeof error === 'object' && error !== null) {
      const execution = error as { results?: unknown; consoleLogs?: unknown; message?: unknown }
      if (Array.isArray(execution.results) || Array.isArray(execution.consoleLogs)) {
        return {
          results: Array.isArray(execution.results)
            ? (execution.results as SubmissionResult[])
            : this.normalizeResults(error),
          consoleLogs: Array.isArray(execution.consoleLogs)
            ? execution.consoleLogs.filter((value): value is string => typeof value === 'string')
            : [],
          message:
            typeof execution.message === 'string'
              ? execution.message
              : 'Erreur lors de l’exécution.',
          timeout: typeof execution.message === 'string' && /timed out/i.test(execution.message),
        }
      }
    }

    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message) as {
          message?: string
          results?: unknown[]
          consoleLogs?: unknown[]
        }
        return {
          results: Array.isArray(parsed.results)
            ? (parsed.results as SubmissionResult[])
            : this.normalizeResults(error),
          consoleLogs: Array.isArray(parsed.consoleLogs)
            ? parsed.consoleLogs.filter((value): value is string => typeof value === 'string')
            : [],
          message: parsed.message || error.message,
          timeout: /timed out/i.test(parsed.message || error.message),
        }
      } catch {
        return {
          results: this.normalizeResults(error),
          consoleLogs: [],
          message: error.message,
          timeout: /timed out/i.test(error.message),
        }
      }
    }

    return {
      results: this.normalizeResults(error),
      consoleLogs: [],
      message: String(error),
      timeout: /timed out/i.test(String(error)),
    }
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

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === '23505'
    )
  }
}
