import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exercises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.integer('number').notNullable()
      table.string('title', 254).notNullable()
      table.text('description').notNullable()
      table.integer('difficulty').notNullable().unsigned()
      table.boolean('is_locked').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable().defaultTo(this.db.rawQuery('now()').knexQuery)
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
