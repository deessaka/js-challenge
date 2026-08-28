import { createHash } from 'node:crypto'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

import Exercise from '#models/exercise'
import ExerciseContractVersion from '#models/exercise_contract_version'

export const CONTRACT_FAMILIES = [
  'count',
  'transform',
  'aggregate',
  'predicate',
  'lookup',
  'compare',
] as const

export type ContractFamily = (typeof CONTRACT_FAMILIES)[number]

export interface ExerciseContractDefinition {
  metadata: {
    title: string
    description: string
    difficulty: number
    category: string
    points: number
    hint?: string
  }
  instruction: string
  entry: {
    kind: 'function'
    name: string
    parameters: Array<{ name?: string; type: string; items?: string }>
    returns: string
  }
  behavior?: {
    kind: ContractFamily
    [key: string]: unknown
  }
  examples: ContractCase[]
  edgeCases?: ContractCase[]
  caseGenerator?: CaseGenerator
  evaluation?: { kind: 'dsl' } | { kind: 'custom'; id: string; version: number }
}

export interface ContractCase {
  description?: string
  input?: unknown[]
  args?: unknown[]
  output: unknown
}

export type CaseGenerator =
  | {
      kind: 'arrayValues'
      seed: number
      count: number
      minLength: number
      maxLength: number
      values: unknown[]
    }
  | {
      kind: 'numbers'
      seed: number
      count: number
      min: number
      max: number
    }

export interface CompiledExerciseContract {
  definition: ExerciseContractDefinition
  contractHash: string
  starterCode: string
  testSource: string
  generatedCases: ContractCase[]
  cases: ContractCase[]
  evaluateReference(input: unknown[]): unknown
}

export interface ContractValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  checks: Array<{ name: string; passed: boolean; details?: string }>
  generatedCases: ContractCase[]
  compiled?: CompiledExerciseContract
}

export class ExerciseContractValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Contrat d’exercice invalide : ${errors.join(' ')}`)
    this.name = 'ExerciseContractValidationError'
  }
}

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/
const TYPES = new Set(['unknown', 'array', 'string', 'number', 'boolean', 'object'])
const RETURN_TYPES = new Set(['unknown', 'array', 'string', 'number', 'boolean', 'object'])
const OPERATORS = new Set([
  'strictEquals',
  'equals',
  'truthy',
  'falsy',
  'greaterThan',
  'greaterThanOrEqual',
  'lessThan',
  'lessThanOrEqual',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => stableValue(item))
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])])
    )
  }
  return value === undefined ? null : value
}

function stableJson(value: unknown): string {
  return JSON.stringify(stableValue(value))
}

function sourceValue(value: unknown): string {
  if (value === undefined) return 'void 0'
  if (Array.isArray(value)) return `[${value.map(sourceValue).join(', ')}]`
  if (isRecord(value)) {
    return `{${Object.entries(value)
      .map(([key, entry]) => `${JSON.stringify(key)}: ${sourceValue(entry)}`)
      .join(', ')}}`
  }
  const serialized = JSON.stringify(value)
  return serialized === undefined ? 'void 0' : serialized
}

function matchesOperator(actual: unknown, operator: string, expected: unknown): boolean {
  switch (operator) {
    case 'strictEquals':
      return actual === expected
    case 'equals':
      return actual == expected
    case 'truthy':
      return Boolean(actual)
    case 'falsy':
      return !actual
    case 'greaterThan':
      return typeof actual === 'number' && actual > Number(expected)
    case 'greaterThanOrEqual':
      return typeof actual === 'number' && actual >= Number(expected)
    case 'lessThan':
      return typeof actual === 'number' && actual < Number(expected)
    case 'lessThanOrEqual':
      return typeof actual === 'number' && actual <= Number(expected)
    default:
      throw new ExerciseContractValidationError([`Opérateur inconnu : ${operator}.`])
  }
}

function deepEqual(left: unknown, right: unknown): boolean {
  return stableJson(left) === stableJson(right)
}

function conformsToReturnType(value: unknown, type: string): boolean {
  if (type === 'unknown') return true
  if (type === 'array') return Array.isArray(value)
  if (type === 'object') return isRecord(value)
  return typeof value === type
}

function conformsToInputType(value: unknown, type: string): boolean {
  if (type === 'unknown') return true
  if (type === 'array') return Array.isArray(value)
  if (type === 'object') return isRecord(value)
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value)
  return typeof value === type
}

function propertyAt(value: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!isRecord(current)) return undefined
    return current[key]
  }, value)
}

function evaluateBehavior(definition: ExerciseContractDefinition, input: unknown[]): unknown {
  const behavior = definition.behavior
  if (!behavior) throw new ExerciseContractValidationError(['Le comportement DSL est absent.'])
  const collection = input[0]

  switch (behavior.kind) {
    case 'count': {
      if (!Array.isArray(collection)) throw new Error('count attend un tableau en première entrée.')
      const where = behavior.where
      if (
        !isRecord(where) ||
        typeof where.operator !== 'string' ||
        !OPERATORS.has(where.operator)
      ) {
        throw new ExerciseContractValidationError(['La règle where de count est invalide.'])
      }
      return collection.filter((item) =>
        matchesOperator(item, where.operator as string, where.value)
      ).length
    }
    case 'transform': {
      if (!Array.isArray(collection)) {
        throw new Error('transform attend un tableau en première entrée.')
      }
      const operation = behavior.operation
      if (typeof operation !== 'string') throw new Error('transform nécessite une opération.')
      return collection.map((item) => {
        switch (operation) {
          case 'identity':
            return item
          case 'increment':
            return Number(item) + 1
          case 'square':
            return Number(item) ** 2
          case 'toUpperCase':
            return String(item).toUpperCase()
          case 'toLowerCase':
            return String(item).toLowerCase()
          case 'property':
            return propertyAt(item, String(behavior.path || ''))
          default:
            throw new ExerciseContractValidationError([
              `Opération transform inconnue : ${operation}.`,
            ])
        }
      })
    }
    case 'aggregate': {
      if (!Array.isArray(collection)) {
        throw new Error('aggregate attend un tableau en première entrée.')
      }
      const operation = behavior.operation
      const values =
        typeof behavior.path === 'string'
          ? collection.map((item) => propertyAt(item, behavior.path as string))
          : collection
      if (operation === 'sum') return values.reduce((sum, value) => sum + Number(value), 0)
      if (operation === 'min') return values.length ? Math.min(...values.map(Number)) : null
      if (operation === 'max') return values.length ? Math.max(...values.map(Number)) : null
      throw new ExerciseContractValidationError([
        `Opération aggregate inconnue : ${String(operation)}.`,
      ])
    }
    case 'predicate': {
      if (!Array.isArray(collection))
        throw new Error('predicate attend un tableau en première entrée.')
      const where = behavior.where
      if (
        !isRecord(where) ||
        typeof where.operator !== 'string' ||
        !OPERATORS.has(where.operator)
      ) {
        throw new ExerciseContractValidationError(['La règle where de predicate est invalide.'])
      }
      const values = collection.map((item) =>
        typeof where.path === 'string' ? propertyAt(item, where.path) : item
      )
      const matches = values.filter((item) =>
        matchesOperator(item, where.operator as string, where.value)
      )
      if (behavior.quantifier === 'some') return matches.length > 0
      if (behavior.quantifier === 'none') return matches.length === 0
      return matches.length === values.length
    }
    case 'lookup': {
      const table = behavior.table
      if (!isRecord(table)) throw new Error('lookup nécessite une table objet.')
      const keyIndex = Number(behavior.keyParameter || 0)
      const key = String(input[keyIndex])
      return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : behavior.defaultValue
    }
    case 'compare': {
      const comparator = behavior.comparator
      if (comparator === 'strictEquals') return input[0] === input[1]
      if (comparator === 'deepEquals') return deepEqual(input[0], input[1])
      throw new ExerciseContractValidationError([
        `Comparateur compare inconnu : ${String(comparator)}.`,
      ])
    }
  }
}

function random(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function generateCases(generator?: CaseGenerator): ContractCase[] {
  if (!generator) return []
  const next = random(generator.seed)
  if (generator.kind === 'arrayValues') {
    return Array.from({ length: generator.count }, (_, index) => {
      const length =
        generator.minLength + Math.floor(next() * (generator.maxLength - generator.minLength + 1))
      const values = Array.from(
        { length },
        () => generator.values[Math.floor(next() * generator.values.length)]
      )
      return { description: `cas généré ${index + 1}`, input: [values], output: undefined }
    })
  }
  return Array.from({ length: generator.count }, (_, index) => ({
    description: `cas généré ${index + 1}`,
    input: [Math.floor(generator.min + next() * (generator.max - generator.min + 1))],
    output: undefined,
  }))
}

function validateShape(input: unknown): string[] {
  const errors: string[] = []
  if (!isRecord(input)) return ['Le contrat doit être un objet JSON.']
  const metadata = input.metadata
  if (!isRecord(metadata) || typeof metadata.title !== 'string' || !metadata.title.trim()) {
    errors.push('metadata.title est obligatoire.')
  }
  if (
    !isRecord(metadata) ||
    typeof metadata.description !== 'string' ||
    !metadata.description.trim()
  ) {
    errors.push('metadata.description est obligatoire.')
  }
  if (
    !isRecord(metadata) ||
    !Number.isFinite(metadata.difficulty) ||
    Number(metadata.difficulty) < 1
  ) {
    errors.push('metadata.difficulty est invalide.')
  }
  if (!isRecord(metadata) || typeof metadata.category !== 'string' || !metadata.category.trim()) {
    errors.push('metadata.category est obligatoire.')
  }
  if (!isRecord(metadata) || !Number.isFinite(metadata.points) || Number(metadata.points) < 1) {
    errors.push('metadata.points est invalide.')
  }
  if (typeof input.instruction !== 'string' || !input.instruction.trim()) {
    errors.push('instruction est obligatoire.')
  }
  if (!isRecord(input.entry) || input.entry.kind !== 'function') {
    errors.push('entry.kind doit être function.')
  } else {
    if (typeof input.entry.name !== 'string' || !IDENTIFIER.test(input.entry.name)) {
      errors.push('Le nom de fonction entry.name est invalide.')
    }
    if (!Array.isArray(input.entry.parameters))
      errors.push('entry.parameters doit être un tableau.')
    else {
      input.entry.parameters.forEach((parameter, index) => {
        if (
          !isRecord(parameter) ||
          typeof parameter.type !== 'string' ||
          !TYPES.has(parameter.type)
        ) {
          errors.push(`entry.parameters[${index}] a un type inconnu.`)
        }
        if (
          isRecord(parameter) &&
          parameter.name !== undefined &&
          (typeof parameter.name !== 'string' || !IDENTIFIER.test(parameter.name))
        ) {
          errors.push(`entry.parameters[${index}].name est invalide.`)
        }
      })
    }
    if (typeof input.entry.returns !== 'string' || !RETURN_TYPES.has(input.entry.returns)) {
      errors.push('entry.returns est invalide.')
    }
  }
  const isCustomEvaluation = isRecord(input.evaluation) && input.evaluation.kind === 'custom'
  if (
    !isCustomEvaluation &&
    (!isRecord(input.behavior) ||
      !CONTRACT_FAMILIES.includes(input.behavior.kind as ContractFamily))
  ) {
    errors.push('behavior.kind est obligatoire et doit appartenir aux familles supportées.')
  }
  if (!Array.isArray(input.examples) || input.examples.length === 0) {
    errors.push('Au moins un exemple est obligatoire.')
  } else {
    input.examples.forEach((contractCase, index) => {
      if (
        !isRecord(contractCase) ||
        (!Array.isArray(contractCase.input) && !Array.isArray(contractCase.args))
      ) {
        errors.push(`examples[${index}] doit définir un tableau input.`)
      }
      if (
        !isRecord(contractCase) ||
        !Object.prototype.hasOwnProperty.call(contractCase, 'output')
      ) {
        errors.push(`examples[${index}].output est obligatoire.`)
      }
    })
  }
  if (input.edgeCases !== undefined && !Array.isArray(input.edgeCases)) {
    errors.push('edgeCases doit être un tableau.')
  }
  if (Array.isArray(input.edgeCases)) {
    input.edgeCases.forEach((contractCase, index) => {
      if (
        !isRecord(contractCase) ||
        (!Array.isArray(contractCase.input) && !Array.isArray(contractCase.args))
      ) {
        errors.push(`edgeCases[${index}] doit définir un tableau input.`)
      }
      if (
        !isRecord(contractCase) ||
        !Object.prototype.hasOwnProperty.call(contractCase, 'output')
      ) {
        errors.push(`edgeCases[${index}].output est obligatoire.`)
      }
    })
  }
  if (input.caseGenerator !== undefined) {
    const generator = input.caseGenerator
    if (!isRecord(generator) || !['arrayValues', 'numbers'].includes(String(generator.kind))) {
      errors.push('caseGenerator.kind est invalide.')
    } else {
      if (!Number.isInteger(generator.seed)) errors.push('caseGenerator.seed doit être entier.')
      if (
        !Number.isInteger(generator.count) ||
        Number(generator.count) < 1 ||
        Number(generator.count) > 100
      ) {
        errors.push('caseGenerator.count doit être compris entre 1 et 100.')
      }
      if (generator.kind === 'arrayValues') {
        if (!Array.isArray(generator.values) || generator.values.length === 0) {
          errors.push('caseGenerator.values ne peut pas être vide.')
        }
        if (
          !Number.isInteger(generator.minLength) ||
          !Number.isInteger(generator.maxLength) ||
          Number(generator.minLength) < 0 ||
          Number(generator.maxLength) < Number(generator.minLength)
        ) {
          errors.push('Les longueurs de caseGenerator sont invalides.')
        }
      } else if (
        !Number.isFinite(generator.min) ||
        !Number.isFinite(generator.max) ||
        Number(generator.max) < Number(generator.min)
      ) {
        errors.push('Les bornes de caseGenerator sont invalides.')
      }
    }
  }
  if (input.evaluation !== undefined) {
    if (!isRecord(input.evaluation) || !['dsl', 'custom'].includes(String(input.evaluation.kind))) {
      errors.push('evaluation.kind est invalide.')
    } else if (
      input.evaluation.kind === 'custom' &&
      (typeof input.evaluation.id !== 'string' ||
        !IDENTIFIER.test(input.evaluation.id) ||
        !Number.isInteger(input.evaluation.version) ||
        Number(input.evaluation.version) < 1)
    ) {
      errors.push('evaluation custom est invalide.')
    }
  }
  return errors
}

function validateBehavior(definition: ExerciseContractDefinition): string[] {
  const errors: string[] = []
  const behavior = definition.behavior
  if (!behavior) return errors
  if (behavior.kind === 'count' || behavior.kind === 'predicate') {
    const where = behavior.where
    if (!isRecord(where) || typeof where.operator !== 'string' || !OPERATORS.has(where.operator)) {
      errors.push(`L’opérateur where de ${behavior.kind} est inconnu.`)
    }
  }
  if (
    behavior.kind === 'transform' &&
    !['identity', 'increment', 'square', 'toUpperCase', 'toLowerCase', 'property'].includes(
      String(behavior.operation)
    )
  ) {
    errors.push(`L’opération transform est inconnue : ${String(behavior.operation)}.`)
  }
  if (
    behavior.kind === 'aggregate' &&
    !['sum', 'min', 'max'].includes(String(behavior.operation))
  ) {
    errors.push(`L’opération aggregate est inconnue : ${String(behavior.operation)}.`)
  }
  if (
    behavior.kind === 'predicate' &&
    !['every', 'some', 'none', undefined].includes(behavior.quantifier as string | undefined)
  ) {
    errors.push('Le quantificateur predicate est invalide.')
  }
  if (behavior.kind === 'lookup' && !isRecord(behavior.table))
    errors.push('lookup.table est obligatoire.')
  if (
    behavior.kind === 'compare' &&
    !['strictEquals', 'deepEquals'].includes(String(behavior.comparator))
  ) {
    errors.push('Le comparateur compare est inconnu.')
  }
  return errors
}

export function hashExerciseContract(definition: unknown): string {
  return createHash('sha256').update(stableJson(definition)).digest('hex')
}

export function compileExerciseContract(input: unknown): CompiledExerciseContract {
  const shapeErrors = validateShape(input)
  if (shapeErrors.length) throw new ExerciseContractValidationError(shapeErrors)
  const definition = input as ExerciseContractDefinition
  if (definition.evaluation?.kind === 'custom') {
    throw new ExerciseContractValidationError([
      `Aucun évaluateur custom enregistré pour ${definition.evaluation.id}.`,
    ])
  }
  const behaviorErrors = validateBehavior(definition)
  if (behaviorErrors.length) throw new ExerciseContractValidationError(behaviorErrors)

  const generatedCases = generateCases(definition.caseGenerator)
  const fixedCases = [...definition.examples, ...(definition.edgeCases || [])]
  const allCases = [...fixedCases, ...generatedCases].map((contractCase) => {
    const input = contractCase.input || contractCase.args || []
    return {
      ...contractCase,
      input,
      output:
        contractCase.output === undefined
          ? evaluateBehavior(definition, input)
          : contractCase.output,
    }
  })
  const parameterNames = definition.entry.parameters.map((parameter, index) =>
    parameter.name && IDENTIFIER.test(parameter.name) ? parameter.name : `arg${index + 1}`
  )
  const starterCode = `// ${definition.metadata.title}\nfunction ${definition.entry.name}(${parameterNames.join(', ')}) {\n  // Votre solution ici\n}\n`
  const testSource = `describe(${sourceValue(definition.metadata.title)}, () => {\n${allCases
    .map(
      (contractCase, index) =>
        `  it(${sourceValue(contractCase.description || `cas ${index + 1}`)}, () => {\n    expect(${definition.entry.name}(...${sourceValue(contractCase.input)})).toEqual(${sourceValue(contractCase.output)})\n  })`
    )
    .join('\n')}\n})`

  return {
    definition,
    contractHash: hashExerciseContract(definition),
    starterCode,
    testSource,
    generatedCases: allCases.slice(fixedCases.length),
    cases: allCases,
    evaluateReference: (input) => evaluateBehavior(definition, input),
  }
}

export function validateExerciseContract(input: unknown): ContractValidationResult {
  const errors = validateShape(input)
  const checks: ContractValidationResult['checks'] = []
  if (errors.length) return { valid: false, errors, warnings: [], checks, generatedCases: [] }

  let compiled: CompiledExerciseContract
  try {
    compiled = compileExerciseContract(input)
    checks.push({ name: 'compilation', passed: true })
  } catch (error) {
    const messages =
      error instanceof ExerciseContractValidationError ? error.errors : [String(error)]
    return { valid: false, errors: messages, warnings: [], checks, generatedCases: [] }
  }

  const definition = compiled.definition
  for (const [index, contractCase] of [
    ...definition.examples,
    ...(definition.edgeCases || []),
  ].entries()) {
    try {
      const expected = compiled.evaluateReference(contractCase.input || contractCase.args || [])
      if (!deepEqual(expected, contractCase.output)) {
        errors.push(`example ${index + 1} ne correspond pas au comportement déclaré.`)
      }
    } catch (error) {
      errors.push(
        `example ${index + 1} est invalide : ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }
  for (const [index, contractCase] of compiled.cases.entries()) {
    const input = contractCase.input || []
    if (input.length !== definition.entry.parameters.length) {
      errors.push(`case ${index + 1} ne respecte pas le nombre de paramètres déclaré.`)
    }
    definition.entry.parameters.forEach((parameter, parameterIndex) => {
      if (
        parameterIndex < input.length &&
        !conformsToInputType(input[parameterIndex], parameter.type)
      ) {
        errors.push(`case ${index + 1} ne respecte pas le type du paramètre ${parameterIndex + 1}.`)
      }
    })
    if (!conformsToReturnType(contractCase.output, definition.entry.returns)) {
      errors.push(`case ${index + 1} ne respecte pas le type de sortie déclaré.`)
    }
  }
  checks.push({ name: 'examples', passed: errors.length === 0 })
  const generated = compiled.generatedCases
  checks.push({
    name: 'generated-cases',
    passed: generated.every((contractCase) => Array.isArray(contractCase.input)),
  })
  const outputs = compiled.cases.map((contractCase) => stableJson(contractCase.output))
  const discriminates = new Set(outputs).size > 1
  checks.push({ name: 'discrimination', passed: discriminates })
  if (!discriminates) errors.push('Les cas du contrat ne discriminent pas une solution constante.')

  return {
    valid: errors.length === 0,
    errors,
    warnings: [],
    checks,
    generatedCases: compiled.generatedCases,
    compiled,
  }
}

export default class ExerciseContractService {
  async findPublished(exerciseId: number): Promise<ExerciseContractVersion | null> {
    return ExerciseContractVersion.query()
      .where('exercise_id', exerciseId)
      .where('status', 'published')
      .orderBy('version', 'desc')
      .first()
  }

  async findDraft(exerciseId: number): Promise<ExerciseContractVersion | null> {
    return ExerciseContractVersion.query()
      .where('exercise_id', exerciseId)
      .where('status', 'draft')
      .orderBy('version', 'desc')
      .first()
  }

  async createDraft(exerciseId: number, definition: unknown, createdBy: string | null) {
    const latest = await ExerciseContractVersion.query()
      .where('exercise_id', exerciseId)
      .orderBy('version', 'desc')
      .first()
    return ExerciseContractVersion.create({
      exerciseId,
      version: (latest?.version || 0) + 1,
      status: 'draft',
      definition: definition as ExerciseContractDefinition,
      contractHash: hashExerciseContract(definition),
      createdBy,
    })
  }

  validate(definition: unknown): ContractValidationResult {
    return validateExerciseContract(definition)
  }

  async publish(exerciseId: number, versionId: number): Promise<ExerciseContractVersion> {
    const report = await this.getValidationReport(exerciseId, versionId)
    if (!report.valid || !report.compiled) {
      throw new ExerciseContractValidationError(report.errors)
    }
    const compiled = report.compiled

    return db.transaction(async (trx) => {
      const version = await ExerciseContractVersion.query({ client: trx })
        .where('id', versionId)
        .where('exercise_id', exerciseId)
        .where('status', 'draft')
        .firstOrFail()
      if (hashExerciseContract(version.definition) !== version.contractHash) {
        throw new ExerciseContractValidationError([
          'Le hash de la version de contrat ne correspond pas à sa définition.',
        ])
      }
      const exercise = await Exercise.query({ client: trx }).where('id', exerciseId).firstOrFail()

      await ExerciseContractVersion.query({ client: trx })
        .where('exercise_id', exerciseId)
        .where('status', 'published')
        .update({ status: 'archived' })

      version.useTransaction(trx)
      version.status = 'published'
      version.publishedAt = DateTime.now()
      await version.save()

      exercise.useTransaction(trx)
      exercise.title = compiled.definition.metadata.title
      exercise.description = compiled.definition.instruction
      exercise.difficulty = compiled.definition.metadata.difficulty
      exercise.category = compiled.definition.metadata.category
      exercise.points = compiled.definition.metadata.points
      exercise.hint = compiled.definition.metadata.hint || null
      exercise.starterCode = compiled.starterCode
      exercise.status = 'published'
      await exercise.save()

      return version
    })
  }

  async getValidationReport(
    exerciseId: number,
    versionId: number
  ): Promise<ContractValidationResult> {
    const version = await ExerciseContractVersion.query()
      .where('id', versionId)
      .where('exercise_id', exerciseId)
      .first()
    if (!version) {
      return {
        valid: false,
        errors: ['La version de contrat est introuvable.'],
        warnings: [],
        checks: [],
        generatedCases: [],
      }
    }
    return validateExerciseContract(version.definition)
  }
}
