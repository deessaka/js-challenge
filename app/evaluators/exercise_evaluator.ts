import type { ExerciseContractDefinition, ContractCase } from '#services/exercise_contract_service'

export interface EvaluationResult {
  success: boolean
  results: Array<{ description: string; passed: boolean; error?: string }>
}

export interface ExerciseEvaluator {
  validateContract(contract: unknown): { valid: boolean; errors: string[] }
  generateCases(seed: number): ContractCase[]
  evaluateSubmission(code: string, contract: ExerciseContractDefinition): Promise<EvaluationResult>
}

const evaluators = new Map<string, ExerciseEvaluator>()

export function registerExerciseEvaluator(
  id: string,
  version: number,
  evaluator: ExerciseEvaluator
) {
  if (!/^[A-Za-z0-9_-]+$/.test(id) || !Number.isInteger(version) || version < 1) {
    throw new Error('Identifiant ou version d’évaluateur invalide.')
  }
  evaluators.set(`${id}@${version}`, evaluator)
}

export function findExerciseEvaluator(id: string, version: number): ExerciseEvaluator | undefined {
  return evaluators.get(`${id}@${version}`)
}
