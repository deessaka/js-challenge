import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Exercise from './exercise.js'

export default class UserProgress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: string

  @column()
  declare exerciseId: number

  @column()
  declare completed: boolean

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare completedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Exercise)
  declare exercise: BelongsTo<typeof Exercise>
}
