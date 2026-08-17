import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('role', 32).notNullable().defaultTo('user')
      table.string('status', 32).notNullable().defaultTo('active')
      table.timestamp('suspended_at').nullable()
      table.uuid('suspended_by').nullable()
      table.text('suspension_reason').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
      table.dropColumn('status')
      table.dropColumn('suspended_at')
      table.dropColumn('suspended_by')
      table.dropColumn('suspension_reason')
    })
  }
}
