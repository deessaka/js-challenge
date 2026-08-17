import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { challenges } from '#constants/exercises'

export default class ExerciseSeeder extends BaseSeeder {
  async run() {
    const count = await db.from('exercises').count('* as total')
    if (Number(count[0].total) === 0) {
      await db.table('exercises').multiInsert(challenges)
    }
  }
}

