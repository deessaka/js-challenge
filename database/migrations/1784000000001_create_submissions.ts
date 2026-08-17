import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'submissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')

      table
        .integer('exercise_id')
        .notNullable()
        .references('id')
        .inTable('exercises')
        .onDelete('CASCADE')

      table.string('status', 32).notNullable().defaultTo('queued')
      table.string('client', 32).notNullable().defaultTo('web')
      table.string('client_version', 64).nullable()
      table.string('language', 32).notNullable().defaultTo('javascript')
      table.string('idempotency_key', 128).nullable()
      table.text('code').notNullable()
      table.boolean('accepted').nullable()
      table.jsonb('results').nullable()
      table.text('error_message').nullable()
      table.timestamp('started_at').nullable()
      table.timestamp('completed_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['user_id', 'created_at'])
      table.index(['exercise_id', 'created_at'])
      table.unique(['user_id', 'idempotency_key'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
