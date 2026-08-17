import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import { randomUUID } from 'node:crypto';
import { ApiClient } from '../api_client.js';
import { ConfigStore } from '../config_store.js';
import { ANSI, BOX, moveTo, stringWidth, THEME } from './ansi.js';
import { CodeEditor } from './code_editor.js';
import { ExerciseTree } from './exercise_tree.js';
import { HelpModal } from './help_modal.js';
import { InstructionsView } from './instructions_view.js';
import { LoginModal } from './login_modal.js';
import { StatusBar } from './status_bar.js';
import { TestRunnerView } from './test_runner_view.js';
export function inferStarterCode(challenge) {
    if (challenge.starterCode &&
        challenge.starterCode.trim() &&
        !challenge.starterCode.includes("console.log('Hello')")) {
        return challenge.starterCode;
    }
    const desc = challenge.description || '';
    // 1. Search for function call in examples: e.g. "number([[10,0],[3,5]]) ➔ 5" or "removeChar('...') ➔"
    const exampleMatch = desc.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)\s*(?:[➔→\uF0E0]|===|->)/);
    if (exampleMatch) {
        const fnName = exampleMatch[1];
        const rawArgs = exampleMatch[2].trim();
        let params = 'input';
        if (rawArgs.includes(',')) {
            const count = rawArgs.split(',').length;
            params = ['a', 'b', 'c', 'd', 'e'].slice(0, Math.min(5, count)).join(', ');
        }
        else if (rawArgs.startsWith('"') || rawArgs.startsWith("'")) {
            params = 'str';
        }
        else if (rawArgs.startsWith('[')) {
            params = 'arr';
        }
        else if (/^\d+$/.test(rawArgs)) {
            params = 'num';
        }
        else if (rawArgs) {
            params = 'input';
        }
        return `// #${challenge.number} — ${challenge.title}\n\nfunction ${fnName}(${params}) {\n  // Votre solution ici\n  \n}\n`;
    }
    // 2. Fallback to general function call in description
    const generalMatch = desc.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)/);
    const stopWords = ['et', 'ou', 'le', 'la', 'un', 'une', 'des', 'les', 'pour', 'dans', 'avec', 'par', 'sur', 'bus'];
    if (generalMatch && !stopWords.includes(generalMatch[1].toLowerCase())) {
        const fnName = generalMatch[1];
        return `// #${challenge.number} — ${challenge.title}\n\nfunction ${fnName}(input) {\n  // Votre solution ici\n  \n}\n`;
    }
    return `// #${challenge.number} — ${challenge.title}\n\nfunction solution(input) {\n  // Votre solution ici\n  \n}\n`;
}
export class TuiApp {
    api;
    store;
    user = null;
    activePanel = 'tree';
    tree = new ExerciseTree();
    editor = new CodeEditor();
    instructions = new InstructionsView();
    runner = new TestRunnerView();
    statusBar = new StatusBar();
    loginModal = new LoginModal();
    helpModal = new HelpModal();
    isRunning = false;
    isAuthenticating = false;
    loadedExerciseSlug = null;
    layout = null;
    spinnerTimer = null;
    constructor(env = process.env) {
        this.store = new ConfigStore(env);
        const apiBaseUrl = String(env.JS_CHALLENGE_API_URL || 'http://localhost:3333');
        this.api = new ApiClient(apiBaseUrl, () => this.store.read().then((c) => c.token));
    }
    async start() {
        const config = await this.store.read();
        this.isRunning = true;
        this.setupTerminal();
        this.drawLoading('Initialisation de JS Challenge...');
        if (!config.token) {
            this.isAuthenticating = true;
            this.render();
        }
        else {
            try {
                await this.loadInitialData();
            }
            catch (err) {
                this.isAuthenticating = true;
                this.loginModal.errorMessage = err instanceof Error ? err.message : 'Erreur d’authentification';
            }
        }
        this.render();
        await this.runEventLoop();
        this.cleanupTerminal();
        return 0;
    }
    setupTerminal() {
        if (input.isTTY && input.setRawMode) {
            input.setRawMode(true);
        }
        input.resume();
        output.write(ANSI.enterAltScreen);
        output.write(ANSI.hideCursor);
        output.write(ANSI.clearScreen);
        output.write('\x1b[?1000h\x1b[?1002h\x1b[?1006h');
        output.on('resize', () => {
            this.render();
        });
    }
    cleanupTerminal() {
        if (this.spinnerTimer)
            clearInterval(this.spinnerTimer);
        output.write('\x1b[?1006l\x1b[?1002l\x1b[?1000l');
        if (input.isTTY && input.setRawMode) {
            input.setRawMode(false);
        }
        input.pause();
        output.write(ANSI.showCursor);
        output.write(ANSI.leaveAltScreen);
    }
    drawLoading(message) {
        const rows = output.rows || 24;
        const cols = output.columns || 80;
        const msg = `${THEME.primary}${ANSI.bold}⏳ ${message}${ANSI.reset}`;
        output.write(ANSI.clearScreen);
        output.write(moveTo(Math.floor(rows / 2), Math.floor((cols - stringWidth(message)) / 2)));
        output.write(msg);
    }
    async loadInitialData() {
        this.user = await this.api.getMe();
        this.statusBar.setUser(this.user);
        const challengesRes = await this.api.listChallenges(1, 200);
        this.tree.setChallenges(challengesRes.data);
        const selected = this.tree.getSelectedChallenge();
        if (selected) {
            await this.selectChallenge(selected);
        }
    }
    async selectChallenge(challenge) {
        this.loadedExerciseSlug = challenge.slug;
        try {
            const fullChallenge = await this.api.getChallenge(challenge.slug);
            this.instructions.setChallenge(fullChallenge);
            const isLocked = !fullChallenge.isUnlocked;
            const lockMsg = isLocked
                ? `Cet exercice (#${fullChallenge.number}) est verrouillé. Terminez l’exercice #${Math.max(1, fullChallenge.number - 1)} pour le débloquer.`
                : '';
            const localFilePath = resolve(`${challenge.slug}.js`);
            let codeToLoad = inferStarterCode(fullChallenge);
            if (!isLocked) {
                try {
                    await access(localFilePath);
                    const existing = await readFile(localFilePath, 'utf8');
                    if (existing.trim() &&
                        !existing.includes("console.log('Hello');") &&
                        !existing.includes('function bus(input)')) {
                        codeToLoad = existing;
                    }
                    else {
                        await writeFile(localFilePath, codeToLoad, { encoding: 'utf8', mode: 0o600 });
                    }
                }
                catch {
                    await writeFile(localFilePath, codeToLoad, { encoding: 'utf8', mode: 0o600 });
                }
            }
            this.editor.setText(codeToLoad, isLocked, lockMsg);
        }
        catch (err) {
            this.statusBar.showNotification(`Erreur: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    startSpinnerAnimation() {
        if (this.spinnerTimer)
            clearInterval(this.spinnerTimer);
        this.spinnerTimer = setInterval(() => {
            this.runner.tickSpinner();
            this.render();
        }, 80);
    }
    stopSpinnerAnimation() {
        if (this.spinnerTimer) {
            clearInterval(this.spinnerTimer);
            this.spinnerTimer = null;
        }
    }
    async testCodeLocally() {
        const currentChallenge = this.instructions.challenge;
        if (!currentChallenge)
            return;
        if (!currentChallenge.isUnlocked) {
            this.statusBar.showNotification('🔒 Cet exercice est verrouillé. Débloquez-le d’abord !');
            return;
        }
        const code = this.editor.getText();
        const localFilePath = resolve(`${currentChallenge.slug}.js`);
        await writeFile(localFilePath, code, { encoding: 'utf8' });
        this.runner.setLoading(true, true, `Vérification de ${currentChallenge.title}...`);
        this.activePanel = 'results';
        this.statusBar.setActivePanel('results');
        this.startSpinnerAnimation();
        this.render();
        const startTime = Date.now();
        try {
            const submission = await this.api.createSubmission({
                challengeId: currentChallenge.id,
                code,
                dryRun: true,
            });
            const elapsed = Date.now() - startTime;
            this.stopSpinnerAnimation();
            this.runner.setSubmission(submission, true, elapsed);
            if (submission.accepted) {
                this.statusBar.showNotification('✓ Tests réussis en console ! [Ctrl+S] pour valider.');
            }
            else {
                this.statusBar.showNotification('✗ Échec de certains tests en console.');
            }
        }
        catch (err) {
            this.stopSpinnerAnimation();
            this.runner.setError(err instanceof Error ? err.message : String(err));
        }
        this.render();
    }
    async submitCurrentCode() {
        const currentChallenge = this.instructions.challenge;
        if (!currentChallenge)
            return;
        if (!currentChallenge.isUnlocked) {
            this.statusBar.showNotification('🔒 Cet exercice est verrouillé.');
            return;
        }
        const code = this.editor.getText();
        const localFilePath = resolve(`${currentChallenge.slug}.js`);
        await writeFile(localFilePath, code, { encoding: 'utf8' });
        this.runner.setLoading(false, false, `Validation officielle de ${currentChallenge.title}...`);
        this.activePanel = 'results';
        this.statusBar.setActivePanel('results');
        this.startSpinnerAnimation();
        this.render();
        const startTime = Date.now();
        try {
            const submission = await this.api.createSubmission({
                challengeId: currentChallenge.id,
                code,
                idempotencyKey: randomUUID(),
                dryRun: false,
            });
            const elapsed = Date.now() - startTime;
            this.stopSpinnerAnimation();
            this.runner.setSubmission(submission, false, elapsed);
            if (submission.accepted) {
                currentChallenge.isCompleted = true;
                this.statusBar.showNotification(`🎉 Validé avec succès ! (+${currentChallenge.points} pts)`);
                const challengesRes = await this.api.listChallenges(1, 200);
                this.tree.setChallenges(challengesRes.data);
            }
        }
        catch (err) {
            this.stopSpinnerAnimation();
            this.runner.setError(err instanceof Error ? err.message : String(err));
        }
        this.render();
    }
    async handleLoginSubmit() {
        const token = this.loginModal.token.trim();
        if (!token) {
            this.loginModal.errorMessage = 'Le token ne peut pas être vide.';
            this.render();
            return;
        }
        this.loginModal.isLoading = true;
        this.render();
        try {
            const savedConfig = await this.store.read();
            const apiBaseUrl = String(process.env.JS_CHALLENGE_API_URL || savedConfig.apiBaseUrl || 'http://localhost:3333');
            await this.store.save({ apiBaseUrl, token });
            this.api = new ApiClient(apiBaseUrl, () => Promise.resolve(token));
            await this.loadInitialData();
            this.isAuthenticating = false;
            this.loginModal.clear();
            this.statusBar.showNotification(`Connecté en tant que ${this.user?.username}`);
        }
        catch (err) {
            this.loginModal.isLoading = false;
            this.loginModal.errorMessage = err instanceof Error ? err.message : 'Token invalide';
        }
        this.render();
    }
    runEventLoop() {
        return new Promise((resolve) => {
            const onData = async (chunk) => {
                const text = chunk.toString('utf8');
                // Handle Mouse SGR events: \x1b[<btn;col;row[Mm]
                const mouseMatch = /^\x1b\[<(\d+);(\d+);(\d+)([Mm])$/.exec(text);
                if (mouseMatch) {
                    const btn = Number(mouseMatch[1]);
                    const col = Number(mouseMatch[2]);
                    const row = Number(mouseMatch[3]);
                    const isPress = mouseMatch[4] === 'M';
                    await this.handleMouseEvent(btn, col, row, isPress);
                    this.render();
                    return;
                }
                // Global Quit: Ctrl+C (\x03) or Ctrl+Q (\x11)
                if (text === '\u0003' || text === '\u0011') {
                    input.off('data', onData);
                    this.isRunning = false;
                    resolve();
                    return;
                }
                // Help Modal Toggle: ? or F1 (\x1bOP)
                if ((text === '?' && !this.isAuthenticating && !this.tree.isSearching && this.activePanel !== 'editor') || text === '\x1bOP') {
                    this.helpModal.toggle();
                    this.render();
                    return;
                }
                // If Help modal is open, any Esc or ? closes it
                if (this.helpModal.isOpen) {
                    if (text === '\x1b' || text === '?' || text === '\r' || text === '\n') {
                        this.helpModal.isOpen = false;
                        this.render();
                    }
                    return;
                }
                // Login modal input handling
                if (this.isAuthenticating) {
                    if (text === '\r' || text === '\n') {
                        await this.handleLoginSubmit();
                        return;
                    }
                    if (text === '\u007f' || text === '\b') {
                        this.loginModal.handleBackspace();
                        this.render();
                        return;
                    }
                    for (const char of text) {
                        if (char.charCodeAt(0) >= 32) {
                            this.loginModal.insertChar(char);
                        }
                    }
                    this.render();
                    return;
                }
                // Tree Search Mode Input Handling
                if (this.tree.isSearching) {
                    if (text === '\r' || text === '\n') {
                        this.tree.isSearching = false;
                        const sel = this.tree.getSelectedChallenge();
                        if (sel)
                            await this.selectChallenge(sel);
                        this.render();
                        return;
                    }
                    if (text === '\x1b') {
                        this.tree.cancelSearch();
                        this.render();
                        return;
                    }
                    if (text === '\u007f' || text === '\b') {
                        this.tree.backspaceSearch();
                        const sel = this.tree.getSelectedChallenge();
                        if (sel)
                            await this.selectChallenge(sel);
                        this.render();
                        return;
                    }
                    for (const char of text) {
                        if (char.charCodeAt(0) >= 32) {
                            this.tree.insertSearchChar(char);
                        }
                    }
                    const sel = this.tree.getSelectedChallenge();
                    if (sel)
                        await this.selectChallenge(sel);
                    this.render();
                    return;
                }
                // Navigation between panels via Tab
                if (text === '\t') {
                    this.cycleActivePanel(1);
                    this.render();
                    return;
                }
                if (text === '\x1b[Z') {
                    // Shift+Tab
                    this.cycleActivePanel(-1);
                    this.render();
                    return;
                }
                // Direct panel jumps with numbers outside editor
                if (this.activePanel !== 'editor') {
                    if (text === '1') {
                        this.activePanel = 'tree';
                        this.statusBar.setActivePanel('tree');
                        this.render();
                        return;
                    }
                    if (text === '2') {
                        this.activePanel = 'instructions';
                        this.statusBar.setActivePanel('instructions');
                        this.render();
                        return;
                    }
                    if (text === '3') {
                        this.activePanel = 'editor';
                        this.statusBar.setActivePanel('editor');
                        this.render();
                        return;
                    }
                    if (text === '4') {
                        this.activePanel = 'results';
                        this.statusBar.setActivePanel('results');
                        this.render();
                        return;
                    }
                }
                // Action: Test locally without submission -> Ctrl+T (\x14) or F5 (\x1b[15~)
                if (text === '\u0014' || text === '\x1b[15~') {
                    await this.testCodeLocally();
                    return;
                }
                // Action: Submit & Validate -> Ctrl+S (\x13) or F6 (\x1b[17~)
                if (text === '\u0013' || text === '\x1b[17~') {
                    await this.submitCurrentCode();
                    return;
                }
                // Action: Refresh -> Ctrl+R (\x12)
                if (text === '\u0012') {
                    this.drawLoading('Actualisation...');
                    await this.loadInitialData();
                    this.statusBar.showNotification('Exercices actualisés.');
                    this.render();
                    return;
                }
                // Direct panel key routing
                if (this.activePanel === 'tree') {
                    this.handleTreeKey(text);
                }
                else if (this.activePanel === 'instructions') {
                    this.handleInstructionsKey(text);
                }
                else if (this.activePanel === 'editor') {
                    this.handleEditorKey(text);
                }
                else if (this.activePanel === 'results') {
                    this.handleResultsKey(text);
                }
                this.render();
            };
            input.on('data', onData);
        });
    }
    cycleActivePanel(dir) {
        const panels = this.layout?.is3Columns
            ? ['tree', 'instructions', 'editor', 'results']
            : ['tree', 'editor', 'results'];
        const curIdx = panels.indexOf(this.activePanel);
        const nextIdx = (curIdx + dir + panels.length) % panels.length;
        this.activePanel = panels[nextIdx];
        this.statusBar.setActivePanel(this.activePanel);
    }
    async handleMouseEvent(btn, col, row, isPress) {
        if (!this.layout || !isPress)
            return;
        if (this.helpModal.isOpen) {
            this.helpModal.isOpen = false;
            return;
        }
        const { is3Columns, leftWidth, midWidth, editorTop, editorHeight, editorLeft, runnerTop, runnerHeight } = this.layout;
        // 1. Mouse Wheel Scroll Up (btn === 64)
        if (btn === 64) {
            if (col <= leftWidth + 1) {
                this.tree.moveUp();
                const sel = this.tree.getSelectedChallenge();
                if (sel && sel.slug !== this.loadedExerciseSlug)
                    await this.selectChallenge(sel);
            }
            else if (is3Columns && col <= leftWidth + 1 + midWidth + 1) {
                this.instructions.scrollUp(2);
            }
            else if (row >= runnerTop && row < runnerTop + runnerHeight) {
                this.runner.scrollUp(2);
            }
            else {
                this.editor.moveUp();
            }
            return;
        }
        // 2. Mouse Wheel Scroll Down (btn === 65)
        if (btn === 65) {
            if (col <= leftWidth + 1) {
                this.tree.moveDown();
                const sel = this.tree.getSelectedChallenge();
                if (sel && sel.slug !== this.loadedExerciseSlug)
                    await this.selectChallenge(sel);
            }
            else if (is3Columns && col <= leftWidth + 1 + midWidth + 1) {
                this.instructions.scrollDown(2);
            }
            else if (row >= runnerTop && row < runnerTop + runnerHeight) {
                this.runner.scrollDown(2);
            }
            else {
                this.editor.moveDown();
            }
            return;
        }
        // 3. Left Mouse Click (btn === 0)
        if (btn === 0) {
            // Clicked on Tree (Left Column)
            if (col <= leftWidth + 1) {
                this.activePanel = 'tree';
                this.statusBar.setActivePanel('tree');
                const treeStartRow = 5;
                if (row >= treeStartRow) {
                    const clickedIndex = this.tree.scrollOffset + (row - treeStartRow);
                    const challenges = this.tree.getFilteredChallenges();
                    if (clickedIndex >= 0 && clickedIndex < challenges.length) {
                        this.tree.selectedIndex = clickedIndex;
                        await this.selectChallenge(challenges[clickedIndex]);
                    }
                }
                return;
            }
            // Clicked on Middle Column (Instructions in 3-column mode)
            if (is3Columns && col <= leftWidth + 1 + midWidth + 1) {
                this.activePanel = 'instructions';
                this.statusBar.setActivePanel('instructions');
                return;
            }
            // Clicked on Right Column (Editor or Results)
            if (row >= editorTop && row < editorTop + editorHeight) {
                this.activePanel = 'editor';
                this.statusBar.setActivePanel('editor');
                const gutterWidth = Math.max(3, String(this.editor.lines.length).length + 1);
                this.editor.handleClick(row - editorTop - 1, col - editorLeft, gutterWidth);
                return;
            }
            if (row >= runnerTop && row < runnerTop + runnerHeight) {
                this.activePanel = 'results';
                this.statusBar.setActivePanel('results');
                return;
            }
        }
    }
    handleTreeKey(key) {
        if (key === '/' || key === '\x06') {
            this.tree.startSearch();
            return;
        }
        if (key === 'f') {
            this.tree.cycleFilter();
            const sel = this.tree.getSelectedChallenge();
            if (sel)
                this.selectChallenge(sel);
            return;
        }
        if (key === '\x1b[A' || key === 'k') {
            this.tree.moveUp();
            const sel = this.tree.getSelectedChallenge();
            if (sel && sel.slug !== this.loadedExerciseSlug)
                this.selectChallenge(sel);
        }
        else if (key === '\x1b[B' || key === 'j') {
            this.tree.moveDown();
            const sel = this.tree.getSelectedChallenge();
            if (sel && sel.slug !== this.loadedExerciseSlug)
                this.selectChallenge(sel);
        }
        else if (key === '\x1b[5~') {
            this.tree.pageUp(10);
        }
        else if (key === '\x1b[6~') {
            this.tree.pageDown(10);
        }
        else if (key === '\r' || key === '\n') {
            const sel = this.tree.getSelectedChallenge();
            if (sel && !sel.isUnlocked) {
                this.statusBar.showNotification(`🔒 L’exercice #${sel.number} est verrouillé.`);
            }
            else {
                this.activePanel = 'editor';
                this.statusBar.setActivePanel('editor');
            }
        }
    }
    handleInstructionsKey(key) {
        if (key === '\x1b[A' || key === 'k') {
            this.instructions.scrollUp(1);
        }
        else if (key === '\x1b[B' || key === 'j') {
            this.instructions.scrollDown(1);
        }
        else if (key === '\x1b') {
            this.activePanel = 'tree';
            this.statusBar.setActivePanel('tree');
        }
    }
    handleEditorKey(key) {
        if (key === '\x1b') {
            this.activePanel = 'tree';
            this.statusBar.setActivePanel('tree');
            return;
        }
        if (this.editor.isLocked) {
            this.statusBar.showNotification('🔒 Exercice verrouillé : écriture désactivée.');
            return;
        }
        if (key === '\x1b[A') {
            this.editor.moveUp();
        }
        else if (key === '\x1b[B') {
            this.editor.moveDown();
        }
        else if (key === '\x1b[C') {
            this.editor.moveRight();
        }
        else if (key === '\x1b[D') {
            this.editor.moveLeft();
        }
        else if (key === '\x1b[H' || key === '\x1b[1~') {
            this.editor.moveHome();
        }
        else if (key === '\x1b[F' || key === '\x1b[4~') {
            this.editor.moveEnd();
        }
        else if (key === '\x1b[5~') {
            this.editor.pageUp(10);
        }
        else if (key === '\x1b[6~') {
            this.editor.pageDown(10);
        }
        else if (key === '\r' || key === '\n') {
            this.editor.handleEnter();
        }
        else if (key === '\u007f' || key === '\b') {
            this.editor.handleBackspace();
        }
        else if (key === '\x1b[3~') {
            this.editor.handleDelete();
        }
        else {
            for (const char of key) {
                if (char.charCodeAt(0) >= 32) {
                    this.editor.insertChar(char);
                }
            }
        }
    }
    handleResultsKey(key) {
        if (key === '\x1b[A' || key === 'k') {
            this.runner.scrollUp(1);
        }
        else if (key === '\x1b[B' || key === 'j') {
            this.runner.scrollDown(1);
        }
        else if (key === '\x1b') {
            this.activePanel = 'tree';
            this.statusBar.setActivePanel('tree');
        }
    }
    computeLayout(rows, cols) {
        const is3Columns = cols >= 105;
        const statusBarHeight = 1;
        const mainHeight = rows - statusBarHeight;
        if (is3Columns) {
            const leftWidth = Math.min(32, Math.max(28, Math.floor(cols * 0.24)));
            const midWidth = Math.min(50, Math.max(36, Math.floor(cols * 0.36)));
            const rightWidth = Math.max(20, cols - leftWidth - midWidth - 4); // 4 vertical boundary characters
            const runnerHeight = Math.max(9, Math.floor((mainHeight - 3) * 0.44));
            const editorHeight = Math.max(5, mainHeight - 3 - runnerHeight);
            const editorLeft = leftWidth + midWidth + 3;
            return {
                is3Columns: true,
                leftWidth,
                midWidth,
                rightWidth,
                mainHeight,
                instructionsTop: 2,
                instructionsHeight: mainHeight - 2,
                editorTop: 2,
                editorHeight,
                editorLeft,
                runnerTop: editorHeight + 3,
                runnerHeight,
                runnerLeft: editorLeft,
            };
        }
        else {
            const leftWidth = Math.min(30, Math.max(24, Math.floor(cols * 0.28)));
            const rightWidth = Math.max(20, cols - leftWidth - 3);
            const instructionsHeight = Math.max(6, Math.floor((mainHeight - 3) * 0.32));
            const runnerHeight = Math.max(8, Math.floor((mainHeight - 3) * 0.36));
            const editorHeight = Math.max(5, mainHeight - 4 - instructionsHeight - runnerHeight);
            return {
                is3Columns: false,
                leftWidth,
                midWidth: 0,
                rightWidth,
                mainHeight,
                instructionsTop: 2,
                instructionsHeight,
                editorTop: instructionsHeight + 3,
                editorHeight,
                editorLeft: leftWidth + 2,
                runnerTop: instructionsHeight + editorHeight + 4,
                runnerHeight,
                runnerLeft: leftWidth + 2,
            };
        }
    }
    render() {
        if (!this.isRunning)
            return;
        const rows = Math.max(20, output.rows || 24);
        const cols = Math.max(60, output.columns || 80);
        let buffer = ANSI.syncStart + moveTo(1, 1);
        if (this.isAuthenticating) {
            buffer += ANSI.clearScreen;
            const modalLines = this.loginModal.render(rows, cols);
            const startRow = Math.max(1, Math.floor((rows - modalLines.length) / 2));
            for (let i = 0; i < modalLines.length; i += 1) {
                buffer += moveTo(startRow + i, Math.max(1, Math.floor((cols - 74) / 2))) + modalLines[i];
            }
            buffer += ANSI.syncEnd;
            output.write(buffer);
            return;
        }
        const layout = this.computeLayout(rows, cols);
        this.layout = layout;
        // Content rows
        const contentRows = layout.mainHeight - 2;
        const treeLines = this.tree.render(contentRows, layout.leftWidth, this.activePanel === 'tree');
        if (layout.is3Columns) {
            // Top Border
            const p1Title = ` 📂 Exercices `;
            const p1Color = this.activePanel === 'tree' ? THEME.primary + ANSI.bold : THEME.textMuted;
            const p1BarLen = Math.max(0, layout.leftWidth - stringWidth(p1Title) + 1);
            const topCol1 = `${THEME.border}${BOX.roundedTopLeft}${BOX.horizontal}${p1Color}${p1Title}${THEME.border}${BOX.horizontal.repeat(p1BarLen)}`;
            const p2Title = ` 📖 Consignes `;
            const p2Color = this.activePanel === 'instructions' ? THEME.primary + ANSI.bold : THEME.textMuted;
            const p2BarLen = Math.max(0, layout.midWidth - stringWidth(p2Title) + 1);
            const topCol2 = `${THEME.border}${BOX.teeTop}${BOX.horizontal}${p2Color}${p2Title}${THEME.border}${BOX.horizontal.repeat(p2BarLen)}`;
            const editorAction = this.editor.isLocked ? '[🔒 Bloqué]' : '[Ctrl+T: Tester │ Ctrl+S: Valider]';
            const p3Title = ` 💻 Solution JavaScript `;
            const p3Color = this.activePanel === 'editor' ? THEME.primary + ANSI.bold : THEME.textMuted;
            const p3Tag = ` ${THEME.textDim}${editorAction}${THEME.border} `;
            const p3Prefix = `${p3Color}${p3Title}${p3Tag}`;
            const p3BarLen = Math.max(0, layout.rightWidth - stringWidth(p3Title) - stringWidth(editorAction) - 2);
            const topCol3 = `${THEME.border}${BOX.teeTop}${BOX.horizontal}${p3Prefix}${THEME.border}${BOX.horizontal.repeat(p3BarLen)}${BOX.roundedTopRight}${ANSI.reset}`;
            buffer += moveTo(1, 1) + `${topCol1}${topCol2}${topCol3}`;
            const instructionLines = this.instructions.render(contentRows, layout.midWidth, this.activePanel === 'instructions');
            const editorLines = this.editor.render(layout.editorHeight, layout.rightWidth, this.activePanel === 'editor');
            const runnerLines = this.runner.render(layout.runnerHeight, layout.rightWidth, this.activePanel === 'results');
            for (let r = 0; r < contentRows; r += 1) {
                const col1 = treeLines[r] || ' '.repeat(layout.leftWidth);
                const col2 = instructionLines[r] || ' '.repeat(layout.midWidth);
                let col3 = '';
                let rightTee = `${THEME.border}${BOX.vertical}${ANSI.reset}`;
                let leftTee = `${THEME.border}${BOX.vertical}${ANSI.reset}`;
                if (r === layout.editorHeight) {
                    const rTitle = ` 🧪 Console & Tests `;
                    const rColor = this.activePanel === 'results' ? THEME.primary + ANSI.bold : THEME.textMuted;
                    const rBarLen = Math.max(0, layout.rightWidth - stringWidth(rTitle) + 1);
                    col3 = `${THEME.border}${BOX.horizontal}${rColor}${rTitle}${THEME.border}${BOX.horizontal.repeat(rBarLen)}`;
                    leftTee = `${THEME.border}${BOX.teeLeft}${ANSI.reset}`;
                    rightTee = `${THEME.border}${BOX.teeRight}${ANSI.reset}`;
                }
                else if (r < layout.editorHeight) {
                    col3 = editorLines[r] || ' '.repeat(layout.rightWidth);
                }
                else {
                    const testRowIdx = r - layout.editorHeight - 1;
                    col3 = runnerLines[testRowIdx] || ' '.repeat(layout.rightWidth);
                }
                const div1 = `${THEME.border}${BOX.vertical}${ANSI.reset}`;
                const div2 = leftTee;
                buffer += moveTo(r + 2, 1) + `${div1}${col1}${div1}${col2}${div2}${col3}${rightTee}`;
            }
            // Bottom Border
            const bot1 = `${THEME.border}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(layout.leftWidth + 1)}`;
            const bot2 = `${BOX.teeBottom}${BOX.horizontal.repeat(layout.midWidth + 1)}`;
            const bot3 = `${BOX.teeBottom}${BOX.horizontal.repeat(layout.rightWidth + 1)}${BOX.roundedBottomRight}${ANSI.reset}`;
            buffer += moveTo(layout.mainHeight, 1) + `${bot1}${bot2}${bot3}`;
        }
        else {
            // 2-Column Layout
            const p1Title = ` 📂 Exercices `;
            const p1Color = this.activePanel === 'tree' ? THEME.primary + ANSI.bold : THEME.textMuted;
            const p1BarLen = Math.max(0, layout.leftWidth - stringWidth(p1Title) + 1);
            const topCol1 = `${THEME.border}${BOX.roundedTopLeft}${BOX.horizontal}${p1Color}${p1Title}${THEME.border}${BOX.horizontal.repeat(p1BarLen)}`;
            const p2Title = ` 📖 Consignes `;
            const p2Color = this.activePanel === 'instructions' ? THEME.primary + ANSI.bold : THEME.textMuted;
            const p2BarLen = Math.max(0, layout.rightWidth - stringWidth(p2Title) + 1);
            const topCol2 = `${THEME.border}${BOX.teeTop}${BOX.horizontal}${p2Color}${p2Title}${THEME.border}${BOX.horizontal.repeat(p2BarLen)}${BOX.roundedTopRight}${ANSI.reset}`;
            buffer += moveTo(1, 1) + `${topCol1}${topCol2}`;
            const instructionLines = this.instructions.render(layout.instructionsHeight, layout.rightWidth, this.activePanel === 'instructions');
            const editorLines = this.editor.render(layout.editorHeight, layout.rightWidth, this.activePanel === 'editor');
            const runnerLines = this.runner.render(layout.runnerHeight, layout.rightWidth, this.activePanel === 'results');
            for (let r = 0; r < contentRows; r += 1) {
                const col1 = treeLines[r] || ' '.repeat(layout.leftWidth);
                let col2 = '';
                let rightTee = `${THEME.border}${BOX.vertical}${ANSI.reset}`;
                if (r < layout.instructionsHeight) {
                    col2 = instructionLines[r] || ' '.repeat(layout.rightWidth);
                }
                else if (r === layout.instructionsHeight) {
                    const editorAction = this.editor.isLocked ? '[🔒 Bloqué]' : '[Ctrl+T: Tester │ Ctrl+S: Valider]';
                    const pTitle = ` 💻 Solution JavaScript `;
                    const pColor = this.activePanel === 'editor' ? THEME.primary + ANSI.bold : THEME.textMuted;
                    const pTag = ` ${THEME.textDim}${editorAction}${THEME.border} `;
                    const pBarLen = Math.max(0, layout.rightWidth - stringWidth(pTitle) - stringWidth(editorAction) - 2);
                    col2 = `${THEME.border}${BOX.horizontal}${pColor}${pTitle}${pTag}${BOX.horizontal.repeat(pBarLen)}`;
                    rightTee = `${THEME.border}${BOX.teeRight}${ANSI.reset}`;
                }
                else if (r < layout.instructionsHeight + 1 + layout.editorHeight) {
                    const edIdx = r - layout.instructionsHeight - 1;
                    col2 = editorLines[edIdx] || ' '.repeat(layout.rightWidth);
                }
                else if (r === layout.instructionsHeight + 1 + layout.editorHeight) {
                    const rTitle = ` 🧪 Console & Tests `;
                    const rColor = this.activePanel === 'results' ? THEME.primary + ANSI.bold : THEME.textMuted;
                    const rBarLen = Math.max(0, layout.rightWidth - stringWidth(rTitle) + 1);
                    col2 = `${THEME.border}${BOX.horizontal}${rColor}${rTitle}${THEME.border}${BOX.horizontal.repeat(rBarLen)}`;
                    rightTee = `${THEME.border}${BOX.teeRight}${ANSI.reset}`;
                }
                else {
                    const runIdx = r - layout.instructionsHeight - layout.editorHeight - 2;
                    col2 = runnerLines[runIdx] || ' '.repeat(layout.rightWidth);
                }
                const div1 = `${THEME.border}${BOX.vertical}${ANSI.reset}`;
                buffer += moveTo(r + 2, 1) + `${div1}${col1}${div1}${col2}${rightTee}`;
            }
            const bot1 = `${THEME.border}${BOX.roundedBottomLeft}${BOX.horizontal.repeat(layout.leftWidth + 1)}`;
            const bot2 = `${BOX.teeBottom}${BOX.horizontal.repeat(layout.rightWidth + 1)}${BOX.roundedBottomRight}${ANSI.reset}`;
            buffer += moveTo(layout.mainHeight, 1) + `${bot1}${bot2}`;
        }
        // Status bar at bottom
        const statusLines = this.statusBar.render(cols);
        buffer += moveTo(rows, 1) + statusLines[0];
        // Floating Help Modal Overlay
        if (this.helpModal.isOpen) {
            const helpLines = this.helpModal.render(rows, cols);
            const modalWidth = stringWidth(helpLines[0]);
            const startRow = Math.max(1, Math.floor((rows - helpLines.length) / 2));
            const startCol = Math.max(1, Math.floor((cols - modalWidth) / 2));
            for (let i = 0; i < helpLines.length; i += 1) {
                buffer += moveTo(startRow + i, startCol) + helpLines[i];
            }
        }
        buffer += ANSI.syncEnd;
        output.write(buffer);
    }
}
//# sourceMappingURL=app.js.map