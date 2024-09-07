import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exercises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('number').notNullable()
      table.string('title', 254).notNullable()
      table.text('description').notNullable()
      table.integer('difficulty').notNullable().unsigned()

      table.timestamp('created_at').notNullable().defaultTo(this.db.rawQuery('now()').knexQuery)
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
