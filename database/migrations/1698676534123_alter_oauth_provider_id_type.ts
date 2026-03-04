import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    if (await this.schema.hasTable(this.tableName)) {
      this.schema.alterTable(this.tableName, (table) => {
        table.string('oauth_provider_id').alter()
      })
    }
  }

  async down() {
    if (await this.schema.hasTable(this.tableName)) {
      this.schema.alterTable(this.tableName, (table) => {
        table.integer('oauth_provider_id').alter()
      })
    }
  }
}
