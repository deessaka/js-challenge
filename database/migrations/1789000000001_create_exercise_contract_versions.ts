import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exercise_contract_versions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('exercise_id')
        .notNullable()
        .references('id')
        .inTable('exercises')
        .onDelete('CASCADE')
      table.integer('version').notNullable()
      table.string('status', 16).notNullable().defaultTo('draft')
      table.jsonb('definition').notNullable()
      table.string('contract_hash', 64).notNullable()
      table.uuid('created_by').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at').notNullable().defaultTo(this.db.rawQuery('now()').knexQuery)
      table.timestamp('published_at').nullable()

      table.unique(['exercise_id', 'version'])
      table.index(['exercise_id', 'status'])
    })
    this.defer(async () => {
      await this.db.rawQuery(
        "CREATE UNIQUE INDEX exercise_contract_versions_one_published ON exercise_contract_versions (exercise_id) WHERE status = 'published'"
      )
    })
  }

  async down() {
    await this.db.rawQuery('DROP INDEX IF EXISTS exercise_contract_versions_one_published')
    this.schema.dropTable(this.tableName)
  }
}
