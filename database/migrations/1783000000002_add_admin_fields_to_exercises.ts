import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exercises'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('slug', 254).nullable().unique()
      table.string('category', 120).notNullable().defaultTo('JavaScript')
      table.integer('points').notNullable().defaultTo(10)
      table.string('status', 32).notNullable().defaultTo('published')
      table.text('starter_code').nullable()
      table.text('hint').nullable()
      table.integer('prerequisite_id').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('slug')
      table.dropColumn('category')
      table.dropColumn('points')
      table.dropColumn('status')
      table.dropColumn('starter_code')
      table.dropColumn('hint')
      table.dropColumn('prerequisite_id')
    })
  }
}
