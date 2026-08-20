import type { Submission } from '../types.js'
import { shortcutKeys } from './shortcut_catalog.js'

type FeedbackSubmission = Pick<
  Submission,
  'status' | 'accepted' | 'results' | 'consoleLogs' | 'errorMessage'
>

export interface EditorFeedbackResult {
  submission: FeedbackSubmission
  durationMs: number
}

export interface DryRunOutcome<Value extends FeedbackSubmission> {
  submission: Value
  durationMs: number
}

export interface EditorFeedbackState {
  phase: 'idle' | 'running' | 'complete' | 'error'
  isStale: boolean
  result: EditorFeedbackResult | null
  error: string | null
}

export type EditorFeedbackEvent =
  | { type: 'buffer-changed' }
  | { type: 'dry-run-started' }
  | { type: 'dry-run-succeeded'; submission: FeedbackSubmission; durationMs: number }
  | { type: 'dry-run-failed'; error: string }

export function createEditorFeedbackState(): EditorFeedbackState {
  return { phase: 'idle', isStale: false, result: null, error: null }
}

export function reduceEditorFeedback(
  state: EditorFeedbackState,
  event: EditorFeedbackEvent
): EditorFeedbackState {
  if (event.type === 'buffer-changed') {
    const hasFeedback = state.phase !== 'idle' || state.result !== null || state.error !== null
    return {
      ...state,
      phase: state.phase === 'running' ? 'idle' : state.phase,
      isStale: state.isStale || hasFeedback,
    }
  }

  if (event.type === 'dry-run-started') {
    return { phase: 'running', isStale: false, result: null, error: null }
  }

  if (event.type === 'dry-run-succeeded') {
    return {
      phase: 'complete',
      isStale: false,
      result: { submission: event.submission, durationMs: event.durationMs },
      error: null,
    }
  }

  return { phase: 'error', isStale: false, result: null, error: event.error }
}

export function editorFeedbackLines(state: EditorFeedbackState): [string, string, string, string] {
  const submission = state.result?.submission
  const totalTests = submission?.results.length ?? 0
  const passedTests = submission?.results.filter((result) => result.passed).length ?? 0
  const firstFailure = submission?.results.find((result) => !result.passed)
  const firstError =
    state.error || submission?.errorMessage || firstFailure?.error || firstFailure?.description
  const firstLog = submission?.consoleLogs[0]

  return [
    feedbackStatus(state),
    `Tests : ${submission ? `${passedTests}/${totalTests} réussis` : '—'} │ Durée : ${state.result ? `${state.result.durationMs} ms` : '—'}`,
    `Logs : ${submission?.consoleLogs.length ?? 0}${firstLog ? ` │ ${firstLog}` : ''}`,
    `Erreur : ${firstError || 'aucune'}`,
  ]
}

export class LatestDryRun {
  private generation = 0

  constructor(private readonly now: () => number = Date.now) {}

  invalidate(): void {
    this.generation += 1
  }

  async run<Value extends FeedbackSubmission>(
    execute: () => Promise<Value>
  ): Promise<DryRunOutcome<Value> | null> {
    const generation = ++this.generation
    const startedAt = this.now()
    try {
      const submission = await execute()
      if (generation !== this.generation) return null
      return { submission, durationMs: this.now() - startedAt }
    } catch (error) {
      if (generation !== this.generation) return null
      throw error
    }
  }
}

function feedbackStatus(state: EditorFeedbackState): string {
  if (state.isStale) {
    return `◌ Résultat obsolète — ${shortcutKeys('editor-test')} pour retester`
  }
  if (state.phase === 'running') return '● Dry-run en cours…'
  if (state.phase === 'error') return '✗ Erreur du dry-run'
  if (!state.result) return '○ Aucun dry-run'

  const submission = state.result.submission
  const passed =
    submission.status === 'passed' && submission.results.every((result) => result.passed)
  return passed ? '✓ Dry-run réussi' : '✗ Dry-run échoué'
}
