import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { challenges } from '#constants/exercises'
import { COUNT_SHEEPS_CONTRACT } from '../../app/contracts/count_sheeps.js'
import { compileExerciseContract, hashExerciseContract } from '#services/exercise_contract_service'

export default class ExerciseSeeder extends BaseSeeder {
  async run() {
    const count = await db.from('exercises').count('* as total')
    if (Number(count[0].total) === 0) {
      await db.table('exercises').multiInsert(
        challenges.map((challenge) => ({
          ...challenge,
          slug: `exercise-${challenge.number}`,
          category: 'JavaScript',
          status: 'published',
          points: challenge.difficulty >= 7 ? 10 : challenge.difficulty >= 5 ? 20 : 30,
        }))
      )
    }

    const exercise = await db.from('exercises').where('number', 2).first()
    const existingContract = exercise
      ? await db.from('exercise_contract_versions').where('exercise_id', exercise.id).first()
      : null
    if (exercise && !existingContract) {
      const compiled = compileExerciseContract(COUNT_SHEEPS_CONTRACT)
      await db.table('exercise_contract_versions').insert({
        exercise_id: exercise.id,
        version: 1,
        status: 'published',
        definition: JSON.stringify(COUNT_SHEEPS_CONTRACT),
        contract_hash: hashExerciseContract(COUNT_SHEEPS_CONTRACT),
        created_by: null,
        published_at: new Date(),
      })
      await db
        .from('exercises')
        .where('id', exercise.id)
        .update({
          title: COUNT_SHEEPS_CONTRACT.metadata.title,
          description: COUNT_SHEEPS_CONTRACT.instruction,
          difficulty: COUNT_SHEEPS_CONTRACT.metadata.difficulty,
          category: COUNT_SHEEPS_CONTRACT.metadata.category,
          points: COUNT_SHEEPS_CONTRACT.metadata.points,
          starter_code: compiled.starterCode,
          hint: COUNT_SHEEPS_CONTRACT.metadata.hint || null,
          status: 'published',
        })
    }
  }
}
