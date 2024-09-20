import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { default as TokenAuthAccessToken } from './token.js'
import UserPorgress from './user_progress.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password?: string

  @column()
  declare avatar?: string

  @column()
  declare oauthProviderName?: string

  @column()
  declare oauthProviderId?: number

  @column()
  declare unlockedExercises?: number

  @column()
  declare totalPoints?: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasMany(() => TokenAuthAccessToken)
  declare tokens: HasMany<typeof TokenAuthAccessToken>

  @hasMany(() => TokenAuthAccessToken, {
    onQuery: (query) => query.where('type', 'PASSWORD_RESET'),
  })
  declare passwordResetTokens: HasMany<typeof TokenAuthAccessToken>

  @hasMany(() => UserPorgress)
  declare progresses: HasMany<typeof UserPorgress>
}
