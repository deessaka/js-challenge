import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Exercise extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare number: number

  @column()
  declare description: string

  @column()
  declare difficulty: number

  @column()
  declare slug?: string | null

  @column()
  declare category: string

  @column()
  declare points: number

  @column()
  declare status: 'draft' | 'published' | 'archived'

  @column()
  declare starterCode?: string | null

  @column()
  declare hint?: string | null

  @column()
  declare prerequisiteId?: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
