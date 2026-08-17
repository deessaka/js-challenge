import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import Exercise from '#models/exercise'
import User from '#models/user'

export type SubmissionStatus = 'queued' | 'running' | 'passed' | 'failed' | 'timeout' | 'error'

export interface SubmissionResult {
  description: string
  passed: boolean
  error?: string
}

export default class Submission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: string

  @column()
  declare exerciseId: number

  @column()
  declare status: SubmissionStatus

  @column()
  declare client: 'web' | 'terminal'

  @column()
  declare clientVersion?: string | null

  @column()
  declare language: 'javascript'

  @column({ serializeAs: null })
  declare code: string

  @column()
  declare idempotencyKey?: string | null

  @column()
  declare accepted?: boolean | null

  @column({
    prepare: (value) => (value !== null && value !== undefined ? JSON.stringify(value) : null),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare results?: SubmissionResult[] | null

  @column()
  declare errorMessage?: string | null

  /** Runtime output is returned for the current execution and is not persisted. */
  declare consoleLogs?: string[]

  @column.dateTime()
  declare startedAt?: DateTime | null

  @column.dateTime()
  declare completedAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Exercise)
  declare exercise: BelongsTo<typeof Exercise>
}
