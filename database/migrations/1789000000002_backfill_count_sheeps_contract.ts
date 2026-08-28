import { createHash } from 'node:crypto'
import { BaseSchema } from '@adonisjs/lucid/schema'

const definition = {
  metadata: {
    title: 'Nombre de moutons',
    description: 'Compter les valeurs strictement égales à true dans un tableau.',
    difficulty: 8,
    category: 'JavaScript',
    points: 30,
  },
  instruction:
    "Nous avons besoin d'une fonction qui compte les moutons présents dans un tableau donné. La valeur true signifie qu'un mouton est présent ; les autres valeurs sont ignorées.",
  entry: {
    kind: 'function',
    name: 'countSheeps',
    parameters: [{ name: 'arrayOfSheep', type: 'array', items: 'unknown' }],
    returns: 'number',
  },
  behavior: { kind: 'count', where: { operator: 'strictEquals', value: true } },
  examples: [
    {
      description: 'compte uniquement true',
      input: [[true, true, false, null, 'true', true]],
      output: 3,
    },
    { description: 'un tableau sans mouton', input: [[false, null, 'true']], output: 0 },
  ],
  edgeCases: [{ description: 'tableau vide', input: [[]], output: 0 }],
  caseGenerator: {
    kind: 'arrayValues',
    seed: 20240828,
    count: 12,
    minLength: 0,
    maxLength: 16,
    values: [true, false, null, 'true', 0, 1],
  },
}

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable)
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stable((value as Record<string, unknown>)[key])])
    )
  }
  return value === undefined ? null : value
}

function hash(value: unknown) {
  return createHash('sha256')
    .update(JSON.stringify(stable(value)))
    .digest('hex')
}

export default class extends BaseSchema {
  async up() {
    this.defer(async () => {
      const exercise = await this.db.from('exercises').where('number', 2).first()
      if (!exercise) return
      const existing = await this.db
        .from('exercise_contract_versions')
        .where('exercise_id', exercise.id)
        .first()
      if (existing) return

      const starterCode =
        '// Nombre de moutons\nfunction countSheeps(arrayOfSheep) {\n  // Votre solution ici\n}\n'
      await this.db.table('exercise_contract_versions').insert({
        exercise_id: exercise.id,
        version: 1,
        status: 'published',
        definition: JSON.stringify(definition),
        contract_hash: hash(definition),
        created_by: null,
        published_at: new Date(),
      })
      await this.db.from('exercises').where('id', exercise.id).update({
        title: definition.metadata.title,
        description: definition.instruction,
        starter_code: starterCode,
        status: 'published',
      })
    })
  }

  async down() {
    this.defer(async () => {
      const exercise = await this.db.from('exercises').where('number', 2).first()
      if (exercise) {
        await this.db.from('exercise_contract_versions').where('exercise_id', exercise.id).delete()
      }
    })
  }
}
