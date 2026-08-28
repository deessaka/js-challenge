import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import Exercise from '#models/exercise'
import User from '#models/user'
import type { ExerciseContractDefinition } from '#services/exercise_contract_service'

export type ExerciseContractVersionStatus = 'draft' | 'published' | 'archived'

export default class ExerciseContractVersion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare exerciseId: number

  @column()
  declare version: number

  @column()
  declare status: ExerciseContractVersionStatus

  @column({
    prepare: (value) => (value === null || value === undefined ? null : JSON.stringify(value)),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare definition: ExerciseContractDefinition

  @column()
  declare contractHash: string

  @column()
  declare createdBy?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime()
  declare publishedAt?: DateTime | null

  @belongsTo(() => Exercise)
  declare exercise: BelongsTo<typeof Exercise>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare creator: BelongsTo<typeof User>
}
