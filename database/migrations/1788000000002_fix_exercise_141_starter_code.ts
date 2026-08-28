import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Exercise #141's starter_code scaffolded a generic `function round6(...args)` stub,
 * copy-pasted from the same batch as every other exercise in migration
 * 1787000000003_publish_and_backfill_draft_exercises. The actual exercise ("Vecteurs")
 * asks for a full `Vector` class (constructor + 10 instance/static methods) — a
 * submission written against the old stub can never satisfy the grading test
 * (tests/exercises/Exercice141.test.js), regardless of correctness.
 */
const NEW_STARTER_CODE = `// #141 — Vecteurs
class Vector {
  constructor(i, j, k) {
    this.i = i;
    this.j = j;
    this.k = k;
  }

  getMagnitude() {
    // Votre solution ici
  }

  static getI() {
    // Votre solution ici
  }

  static getJ() {
    // Votre solution ici
  }

  static getK() {
    // Votre solution ici
  }

  add(that) {
    // Votre solution ici
  }

  multiplyByScalar(n) {
    // Votre solution ici
  }

  dot(that) {
    // Votre solution ici
  }

  cross(that) {
    // Votre solution ici
  }

  isParallelTo(that) {
    // Votre solution ici
  }

  isPerpendicularTo(that) {
    // Votre solution ici
  }

  normalize() {
    // Votre solution ici
  }

  isNormalized() {
    // Votre solution ici
  }
}
`

const OLD_STARTER_CODE =
  '// #141 — Vecteurs\n\nfunction round6(...args) {\n  // Votre solution ici\n  \n}\n'

export default class extends BaseSchema {
  async up() {
    this.defer(async () => {
      await this.db
        .from('exercises')
        .where('number', 141)
        .update({ starter_code: NEW_STARTER_CODE })
    })
  }

  async down() {
    this.defer(async () => {
      await this.db
        .from('exercises')
        .where('number', 141)
        .update({ starter_code: OLD_STARTER_CODE })
    })
  }
}
