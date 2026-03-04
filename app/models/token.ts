import { BaseModel, belongsTo, column, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from './user.js'

export default class TokenAuthAccessToken extends BaseModel {
  public static table = 'auth_access_tokens'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'tokenable_id' })
  declare userId: string

  @column()
  declare type: string

  @column({ columnName: 'hash' })
  declare token: string

  @column()
  declare name: string | null

  @column()
  declare abilities: string

  @column.dateTime()
  declare lastUsedAt: DateTime | null

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  static assignDefaults(tokenRow: TokenAuthAccessToken) {
    if (!tokenRow.abilities) {
      tokenRow.abilities = '[]'
    }
  }
}
