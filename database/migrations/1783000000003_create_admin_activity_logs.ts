import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_activity_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('actor_id').notNullable()
      table.string('action', 80).notNullable()
      table.string('entity_type', 80).notNullable()
      table.string('entity_id', 120).notNullable()
      table.text('reason').nullable()
      table.jsonb('metadata').nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.db.rawQuery('now()').knexQuery)

      table.index(['actor_id'])
      table.index(['entity_type', 'entity_id'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
