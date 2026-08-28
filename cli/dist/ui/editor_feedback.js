import { shortcutKeys } from './shortcut_catalog.js';
export function createEditorFeedbackState() {
    return { phase: 'idle', isStale: false, result: null, error: null };
}
export function reduceEditorFeedback(state, event) {
    if (event.type === 'buffer-changed') {
        const hasFeedback = state.phase !== 'idle' || state.result !== null || state.error !== null;
        return {
            ...state,
            phase: state.phase === 'running' ? 'idle' : state.phase,
            isStale: state.isStale || hasFeedback,
        };
    }
    if (event.type === 'dry-run-started') {
        return { phase: 'running', isStale: false, result: null, error: null };
    }
    if (event.type === 'dry-run-succeeded') {
        return {
            phase: 'complete',
            isStale: false,
            result: { submission: event.submission, durationMs: event.durationMs },
            error: null,
        };
    }
    return { phase: 'error', isStale: false, result: null, error: event.error };
}
export function editorFeedbackLines(state) {
    const submission = state.result?.submission;
    const firstError = state.error ||
        submission?.errorMessage ||
        submission?.results.find((result) => !result.passed && result.error)?.error;
    const firstLog = submission?.consoleLogs[0];
    return [
        `${feedbackStatus(state)} │ Durée : ${state.result ? `${state.result.durationMs} ms` : '—'}`,
        `Logs : ${submission?.consoleLogs.length ?? 0}${firstLog ? ` │ ${firstLog}` : ''}`,
        `Erreur : ${firstError || 'aucune'}`,
    ];
}
export class LatestDryRun {
    now;
    generation = 0;
    constructor(now = Date.now) {
        this.now = now;
    }
    invalidate() {
        this.generation += 1;
    }
    async run(execute) {
        const generation = ++this.generation;
        const startedAt = this.now();
        try {
            const submission = await execute();
            if (generation !== this.generation)
                return null;
            return { submission, durationMs: this.now() - startedAt };
        }
        catch (error) {
            if (generation !== this.generation)
                return null;
            throw error;
        }
    }
}
function feedbackStatus(state) {
    if (state.isStale) {
        return `◌ Résultat obsolète — ${shortcutKeys('editor-test')} pour relancer la console de debug`;
    }
    if (state.phase === 'running')
        return '● Exécution en cours…';
    if (state.phase === 'error')
        return '✗ Erreur d\'exécution';
    if (!state.result)
        return '○ Aucune exécution';
    const submission = state.result.submission;
    return submission.status === 'passed' ? '✓ Exécution terminée' : '✗ Erreur d\'exécution';
}
//# sourceMappingURL=editor_feedback.js.map