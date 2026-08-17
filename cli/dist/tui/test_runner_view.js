import { ANSI, BOX, padRight, SPINNER_FRAMES, THEME } from './ansi.js';
export class TestRunnerView {
    submission = null;
    statusMessage = null;
    isLoading = false;
    isDryRun = false;
    scrollOffset = 0;
    spinnerIndex = 0;
    executionTimeMs = null;
    tickSpinner() {
        this.spinnerIndex = (this.spinnerIndex + 1) % SPINNER_FRAMES.length;
    }
    setLoading(loading, isDryRun = false, message = 'Exécution des tests...') {
        this.isLoading = loading;
        this.isDryRun = isDryRun;
        this.statusMessage = message;
        if (loading) {
            this.submission = null;
            this.executionTimeMs = null;
        }
    }
    setSubmission(submission, isDryRun = false, executionTimeMs) {
        this.isLoading = false;
        this.submission = submission;
        this.isDryRun = isDryRun;
        this.statusMessage = null;
        this.scrollOffset = 0;
        this.executionTimeMs = executionTimeMs ?? null;
    }
    setError(error) {
        this.isLoading = false;
        this.statusMessage = `Erreur: ${error}`;
        this.submission = null;
    }
    scrollUp(step = 1) {
        this.scrollOffset = Math.max(0, this.scrollOffset - step);
    }
    scrollDown(step = 1) {
        this.scrollOffset += step;
    }
    wrapText(text, maxWidth) {
        const lines = [];
        const words = text.split(/\s+/);
        let current = '';
        for (const w of words) {
            if (!current) {
                current = w;
            }
            else if (current.length + 1 + w.length <= maxWidth) {
                current += ` ${w}`;
            }
            else {
                lines.push(current);
                current = w;
            }
        }
        if (current)
            lines.push(current);
        return lines;
    }
    render(height, width, isFocused) {
        const lines = [];
        const contentWidth = Math.max(10, width - 4);
        if (this.isLoading) {
            const spinner = `${THEME.primary}${ANSI.bold}${SPINNER_FRAMES[this.spinnerIndex]}${ANSI.reset}`;
            const modeText = this.isDryRun
                ? `${THEME.badgePrimary} TEST CONSOLE EN COURS ${ANSI.reset}`
                : `${THEME.badgeSecondary} SOUMISSION EN COURS ${ANSI.reset}`;
            lines.push(` ${spinner} ${modeText} ${THEME.textBold}${this.statusMessage || 'Exécution...'}${ANSI.reset}`);
            lines.push(`   ${THEME.textMuted}Bac à sable V8 isolé en cours d'exécution...${ANSI.reset}`);
            while (lines.length < height)
                lines.push(' '.repeat(width));
            return lines.map((l) => ` ${padRight(l, width - 2)}`);
        }
        if (this.statusMessage && !this.submission) {
            lines.push(` ${THEME.badgeError} ERREUR ${ANSI.reset} ${THEME.error}${this.statusMessage}${ANSI.reset}`);
            while (lines.length < height)
                lines.push(' '.repeat(width));
            return lines.map((l) => ` ${padRight(l, width - 2)}`);
        }
        if (!this.submission) {
            lines.push(` ${THEME.badgePrimary} [Ctrl+T / F5] ▶ Tester ${ANSI.reset} ${THEME.textMuted}Vérification instantanée console (sans valider)${ANSI.reset}`);
            lines.push(` ${THEME.badgeSuccess} [Ctrl+S / F6] ✓ Soumettre ${ANSI.reset} ${THEME.textMuted}Validation officielle, points & progression${ANSI.reset}`);
            while (lines.length < height)
                lines.push(' '.repeat(width));
            return lines.map((l) => ` ${padRight(l, width - 2)}`);
        }
        const sub = this.submission;
        const isPassed = sub.status === 'passed' && sub.accepted;
        const timeStr = this.executionTimeMs ? `${THEME.textDim}(${this.executionTimeMs}ms)${ANSI.reset}` : '';
        const totalTests = sub.results?.length || 0;
        const passedTests = sub.results?.filter((r) => r.passed).length || 0;
        const modeTag = this.isDryRun
            ? `${THEME.badgePrimary} TEST CONSOLE ${ANSI.reset}`
            : `${THEME.badgeSecondary} SOUMISSION OFFICIELLE ${ANSI.reset}`;
        // Status Line 1: Mode + Score + Time
        if (isPassed) {
            const summaryTag = `${THEME.badgeSuccess} ✓ ${passedTests}/${totalTests} RÉUSSIS ${ANSI.reset}`;
            lines.push(` ${modeTag} ${summaryTag} ${timeStr}`);
            if (this.isDryRun) {
                lines.push(`   ${THEME.success}${ANSI.bold}✓ Tous les tests passent ! Appuyez sur [Ctrl+S] pour valider.${ANSI.reset}`);
            }
            else {
                lines.push(`   ${THEME.success}${ANSI.bold}🎉 Félicitations ! Challenge validé avec succès.${ANSI.reset}`);
            }
        }
        else if (sub.status === 'failed') {
            const summaryTag = `${THEME.badgeError} ✗ ${totalTests - passedTests}/${totalTests} ÉCHOUÉS ${ANSI.reset}`;
            lines.push(` ${modeTag} ${summaryTag} ${timeStr}`);
            lines.push(`   ${THEME.error}Certaines assertions n'ont pas été vérifiées.${ANSI.reset}`);
        }
        else {
            lines.push(` ${modeTag} ${THEME.badgeWarning} ⚠️ ERREUR ${ANSI.reset} ${timeStr}`);
            lines.push(`   ${THEME.warning}${sub.errorMessage || 'Erreur d’exécution'}${ANSI.reset}`);
        }
        lines.push('');
        // Results list
        if (sub.results && sub.results.length > 0) {
            for (const res of sub.results) {
                if (res.passed) {
                    lines.push(`   ${THEME.success}${ANSI.bold}PASS${ANSI.reset} ${THEME.text}${res.description}${ANSI.reset}`);
                }
                else {
                    lines.push(`   ${THEME.error}${ANSI.bold}FAIL${ANSI.reset} ${THEME.textBold}${res.description}${ANSI.reset}`);
                    if (res.error) {
                        const errLines = this.wrapText(res.error, contentWidth - 8);
                        lines.push(`     ${THEME.borderDim}${BOX.roundedTopLeft}${BOX.horizontal.repeat(Math.min(50, contentWidth - 6))}${BOX.roundedTopRight}${ANSI.reset}`);
                        for (const el of errLines) {
                            lines.push(`     ${THEME.borderDim}${BOX.vertical}${ANSI.reset} ${THEME.error}${padRight(el, Math.min(50, contentWidth - 8))}${THEME.borderDim}${BOX.vertical}${ANSI.reset}`);
                        }
                        lines.push(`     ${THEME.borderDim}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(Math.min(50, contentWidth - 6))}${BOX.roundedBottomRight}${ANSI.reset}`);
                    }
                }
            }
        }
        else if (sub.errorMessage) {
            const errLines = this.wrapText(sub.errorMessage, contentWidth - 8);
            lines.push(`     ${THEME.borderDim}${BOX.roundedTopLeft}${BOX.horizontal.repeat(Math.min(50, contentWidth - 6))}${BOX.roundedTopRight}${ANSI.reset}`);
            for (const el of errLines) {
                lines.push(`     ${THEME.borderDim}${BOX.vertical}${ANSI.reset} ${THEME.error}${padRight(el, Math.min(50, contentWidth - 8))}${THEME.borderDim}${BOX.vertical}${ANSI.reset}`);
            }
            lines.push(`     ${THEME.borderDim}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(Math.min(50, contentWidth - 6))}${BOX.roundedBottomRight}${ANSI.reset}`);
        }
        // Viewport slicing
        const visibleLines = lines.slice(this.scrollOffset, this.scrollOffset + height);
        while (visibleLines.length < height) {
            visibleLines.push(' '.repeat(width));
        }
        return visibleLines.map((l) => ` ${padRight(l, width - 2)}`);
    }
}
//# sourceMappingURL=test_runner_view.js.map