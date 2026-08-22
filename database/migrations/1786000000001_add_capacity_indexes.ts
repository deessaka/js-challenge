import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('submissions', (table) => {
      table.index(['user_id', 'exercise_id', 'created_at'])
      table.index(['user_id', 'accepted', 'completed_at'])
    })
  }

  async down() {
    this.schema.alterTable('submissions', (table) => {
      table.dropIndex(['user_id', 'exercise_id', 'created_at'])
      table.dropIndex(['user_id', 'accepted', 'completed_at'])
    })
  }
}
