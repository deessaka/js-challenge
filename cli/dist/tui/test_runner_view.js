import { ANSI, padRight, truncate } from './ansi.js';
export class TestRunnerView {
    submission = null;
    statusMessage = null;
    isLoading = false;
    isDryRun = false;
    scrollOffset = 0;
    setLoading(loading, isDryRun = false, message = 'Exécution des tests...') {
        this.isLoading = loading;
        this.isDryRun = isDryRun;
        this.statusMessage = message;
        if (loading)
            this.submission = null;
    }
    setSubmission(submission, isDryRun = false) {
        this.isLoading = false;
        this.submission = submission;
        this.isDryRun = isDryRun;
        this.statusMessage = null;
        this.scrollOffset = 0;
    }
    setError(message) {
        this.isLoading = false;
        this.statusMessage = message;
        this.submission = null;
    }
    scrollUp(step = 1) {
        this.scrollOffset = Math.max(0, this.scrollOffset - step);
    }
    scrollDown(step = 1) {
        this.scrollOffset += step;
    }
    render(height, width, _isFocused) {
        const lines = [];
        const contentWidth = Math.max(10, width - 4);
        const mode = this.isDryRun ? 'VÉRIFICATION' : 'SOUMISSION';
        if (this.isLoading) {
            lines.push(`${ANSI.brightYellow}${ANSI.bold}... ${mode} EN COURS${ANSI.reset}`);
            lines.push(`${ANSI.dim}${this.statusMessage || 'Exécution des tests serveur...'}${ANSI.reset}`);
            lines.push(`${ANSI.dim}Aucune progression n’est modifiée pendant une vérification.${ANSI.reset}`);
            return this.fill(lines, height, width);
        }
        if (this.statusMessage && !this.submission) {
            lines.push(`${ANSI.brightRed}${ANSI.bold}[ERR] ${this.statusMessage}${ANSI.reset}`);
            return this.fill(lines, height, width);
        }
        if (!this.submission) {
            lines.push(`${ANSI.dim}Ctrl+T/F5 vérifier · Ctrl+S/F6 soumettre · ? aide${ANSI.reset}`);
            return this.fill(lines, height, width);
        }
        const submission = this.submission;
        const passed = submission.status === 'passed' && submission.accepted;
        const modeTag = this.isDryRun
            ? `${ANSI.bgBlue}${ANSI.white}${ANSI.bold} VÉRIFICATION ${ANSI.reset}`
            : `${ANSI.bgMagenta}${ANSI.white}${ANSI.bold} OFFICIELLE ${ANSI.reset}`;
        if (passed) {
            lines.push(`${modeTag} ${ANSI.brightGreen}${ANSI.bold}[OK] ${this.isDryRun ? 'Tests réussis — soumettez avec Ctrl+S/F6.' : 'Challenge validé — progression synchronisée.'}${ANSI.reset}`);
        }
        else if (submission.status === 'failed') {
            lines.push(`${modeTag} ${ANSI.brightRed}${ANSI.bold}[FAIL] Certains tests ont échoué.${ANSI.reset}`);
        }
        else {
            lines.push(`${modeTag} ${ANSI.brightYellow}${ANSI.bold}[WARN] ${submission.errorMessage || 'Erreur lors de l’exécution.'}${ANSI.reset}`);
        }
        if (submission.results?.length) {
            for (const result of submission.results) {
                if (result.passed) {
                    lines.push(`  ${ANSI.brightGreen}PASS${ANSI.reset} ${truncate(result.description, contentWidth - 10)}`);
                }
                else {
                    lines.push(`  ${ANSI.brightRed}FAIL${ANSI.reset} ${ANSI.bold}${truncate(result.description, contentWidth - 10)}${ANSI.reset}`);
                    if (result.error)
                        lines.push(`    ${ANSI.gray}> ${truncate(result.error, contentWidth - 8)}${ANSI.reset}`);
                }
            }
        }
        else if (submission.errorMessage) {
            lines.push(`  ${ANSI.brightRed}${truncate(submission.errorMessage, contentWidth - 4)}${ANSI.reset}`);
        }
        const visibleLines = lines.slice(this.scrollOffset, this.scrollOffset + height);
        return this.fill(visibleLines, height, width);
    }
    fill(lines, height, width) {
        const visible = lines.slice(0, height);
        while (visible.length < height)
            visible.push(' '.repeat(width));
        return visible.map((line) => ` ${padRight(line, width - 2)}`);
    }
}
//# sourceMappingURL=test_runner_view.js.map