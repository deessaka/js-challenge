import type { ExerciseContractDefinition } from '#services/exercise_contract_service'

export const COUNT_SHEEPS_CONTRACT: ExerciseContractDefinition = {
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
  behavior: {
    kind: 'count',
    where: { operator: 'strictEquals', value: true },
  },
  examples: [
    {
      description: 'compte uniquement true',
      input: [[true, true, false, null, undefined, 'true', true]],
      output: 3,
    },
    { description: 'un tableau sans mouton', input: [[false, null, 'true']], output: 0 },
  ],
  edgeCases: [
    { description: 'tableau vide', input: [[]], output: 0 },
    { description: 'valeurs invalides', input: [[null, undefined, false]], output: 0 },
  ],
  caseGenerator: {
    kind: 'arrayValues',
    seed: 20240828,
    count: 12,
    minLength: 0,
    maxLength: 16,
    values: [true, false, null, 'true', 0, 1],
  },
}
