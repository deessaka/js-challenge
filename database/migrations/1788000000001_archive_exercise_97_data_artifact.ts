import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Exercise #97 is not a real exercise: its title/description are leftover text from
 * the PDF extraction that produced #156 and #157 ("Pour une version plus abstraite,
 * voir #155 - Nombre binaire" is #156's own footer note; the description bleeds into
 * #157's "Longueur d'une boucle" intro). Its difficulty is 0, unlike every real
 * exercise (7-8), which is the extraction artifact's tell.
 *
 * It ships with an empty grading test file (tests/exercises/Exercice97.test.js), which
 * meant any submission — including an empty one — was silently accepted.
 */
export default class extends BaseSchema {
  async up() {
    this.defer(async () => {
      const exercise = await this.db.from('exercises').where('number', 97).first()
      if (!exercise) return

      // Defensive: if anything ever got chained onto this artifact as a prerequisite,
      // detach it first so archiving doesn't strand a published exercise.
      await this.db
        .from('exercises')
        .where('prerequisite_id', exercise.id)
        .update({ prerequisite_id: null })

      await this.db.from('exercises').where('id', exercise.id).update({ status: 'archived' })
    })
  }

  async down() {
    this.defer(async () => {
      await this.db.from('exercises').where('number', 97).update({ status: 'published' })
    })
  }
}
