import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'

export default class AdminActivityLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare actorId: string

  @column()
  declare action: string

  @column()
  declare entityType: string

  @column()
  declare entityId: string

  @column()
  declare reason?: string | null

  @column()
  declare metadata?: Record<string, unknown> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, { foreignKey: 'actorId' })
  declare actor: BelongsTo<typeof User>
}
