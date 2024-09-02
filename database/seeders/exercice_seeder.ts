import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { challenges } from '#constants/exercises'

export default class ExerciseSeeder extends BaseSeeder {
  async run() {
    await db.table('exercises').multiInsert(challenges)
  }
}
