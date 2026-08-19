import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.defer(async () => {
      await this.db.from('exercises').where('number', 156).where('difficulty', 0).update({ difficulty: 3 })
      await this.db.from('exercises').where('points', 10).whereBetween('difficulty', [5, 6]).update({ points: 20 })
      await this.db.from('exercises').where('points', 10).whereBetween('difficulty', [1, 4]).update({ points: 30 })
      const exercisesWithoutSlug = await this.db.from('exercises').whereNull('slug').select(['id', 'number'])
      for (const exercise of exercisesWithoutSlug) {
        await this.db.from('exercises').where('id', exercise.id).update({ slug: `exercise-${exercise.number}` })
      }
    })

    this.schema.alterTable('exercises', (table) => {
      table.unique(['number'])
      table.index(['status', 'number'])
    })
    this.schema.alterTable('user_progresses', (table) => {
      table.unique(['user_id', 'exercise_id'])
    })
  }

  async down() {
    this.schema.alterTable('user_progresses', (table) => table.dropUnique(['user_id', 'exercise_id']))
    this.schema.alterTable('exercises', (table) => {
      table.dropIndex(['status', 'number'])
      table.dropUnique(['number'])
    })
  }
}
