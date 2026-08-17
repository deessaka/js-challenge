import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import { randomUUID } from 'node:crypto';
import { ApiClient } from '../api_client.js';
import { ConfigStore } from '../config_store.js';
import { ANSI, BOX, moveTo, padCenter, padRight, stringWidth } from './ansi.js';
import { CodeEditor } from './code_editor.js';
import { ExerciseTree } from './exercise_tree.js';
import { InstructionsView } from './instructions_view.js';
import { LoginModal } from './login_modal.js';
import { StatusBar } from './status_bar.js';
import { TestRunnerView } from './test_runner_view.js';
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
    loginModal;
    isRunning = false;
    isAuthenticating = false;
    loadedExerciseSlug = null;
    layout = null;
    inputBuffer = '';
    showHelp = false;
    resizeListener = null;
    selectionRequestId = 0;
    constructor(env = process.env) {
        this.store = new ConfigStore(env);
        const apiBaseUrl = String(env.JS_CHALLENGE_API_URL || 'http://localhost:3333');
        this.api = new ApiClient(apiBaseUrl, () => this.store.read().then((c) => c.token));
        this.loginModal = new LoginModal(`${apiBaseUrl.replace(/\/$/, '')}/profile#api-token`);
    }
    async start() {
        if (!input.isTTY || !output.isTTY) {
            console.error('La TUI nécessite un terminal interactif. Utilisez une sous-commande CLI dans un pipe ou une CI.');
            return 1;
        }
        const config = await this.store.read();
        this.isRunning = true;
        this.setupTerminal();
        try {
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
                    this.loginModal.errorMessage =
                        err instanceof Error ? err.message : 'Erreur d’authentification';
                }
            }
            this.render();
            await this.runEventLoop();
            return 0;
        }
        finally {
            this.isRunning = false;
            this.cleanupTerminal();
        }
    }
    setupTerminal() {
        if (input.isTTY && input.setRawMode) {
            input.setRawMode(true);
        }
        input.resume();
        output.write(ANSI.enterAltScreen);
        output.write(ANSI.hideCursor);
        output.write(ANSI.clearScreen);
        // Enable SGR mouse tracking (button clicks and wheel)
        output.write('\x1b[?1000h\x1b[?1002h\x1b[?1006h');
        this.resizeListener = () => this.render();
        output.on('resize', this.resizeListener);
        process.once('SIGINT', this.handleSignal);
        process.once('SIGTERM', this.handleSignal);
    }
    cleanupTerminal() {
        // Disable mouse tracking
        output.write('\x1b[?1006l\x1b[?1002l\x1b[?1000l');
        if (input.isTTY && input.setRawMode) {
            input.setRawMode(false);
        }
        input.pause();
        if (this.resizeListener) {
            output.off('resize', this.resizeListener);
            this.resizeListener = null;
        }
        process.off('SIGINT', this.handleSignal);
        process.off('SIGTERM', this.handleSignal);
        output.write(ANSI.showCursor);
        output.write(ANSI.leaveAltScreen);
    }
    handleSignal = () => {
        if (this.isRunning)
            input.emit('data', Buffer.from('\u0003'));
    };
    drawLoading(message) {
        const rows = output.rows || 24;
        const cols = output.columns || 80;
        const msg = `${ANSI.cyan}${ANSI.bold}[~] ${message}${ANSI.reset}`;
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
        const requestId = ++this.selectionRequestId;
        this.loadedExerciseSlug = challenge.slug;
        try {
            const fullChallenge = await this.api.getChallenge(challenge.slug);
            if (requestId !== this.selectionRequestId)
                return;
            this.instructions.setChallenge(fullChallenge);
            const isLocked = !fullChallenge.isUnlocked;
            const lockMsg = isLocked
                ? `Cet exercice (#${fullChallenge.number}) est verrouillé. Terminez l’exercice #${Math.max(1, fullChallenge.number - 1)} pour le débloquer.`
                : '';
            const localFilePath = resolve(`${challenge.slug}.js`);
            let codeToLoad = fullChallenge.starterCode || `// ${fullChallenge.title}\n\n`;
            if (!isLocked) {
                try {
                    await access(localFilePath);
                    codeToLoad = await readFile(localFilePath, 'utf8');
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
    /**
     * Run tests locally without official submission (Dry Run).
     */
    async testCodeLocally() {
        const currentChallenge = this.instructions.challenge;
        if (!currentChallenge)
            return;
        if (!currentChallenge.isUnlocked) {
            this.statusBar.showNotification('[LOCK] Cet exercice est verrouillé. Débloquez-le d’abord !');
            return;
        }
        const code = this.editor.getText();
        const localFilePath = resolve(`${currentChallenge.slug}.js`);
        await writeFile(localFilePath, code, { encoding: 'utf8' });
        this.runner.setLoading(true, true, `Vérification de ${currentChallenge.title}...`);
        this.activePanel = 'results';
        this.statusBar.setActivePanel('results');
        this.render();
        try {
            const submission = await this.api.createSubmission({
                challengeId: currentChallenge.id,
                code,
                dryRun: true,
            });
            this.runner.setSubmission(submission, true);
            if (submission.accepted) {
                this.statusBar.showNotification('✓ Tests réussis en console ! [Ctrl+S] pour soumettre.');
            }
            else {
                this.statusBar.showNotification('✗ Échec de certains tests en console.');
            }
        }
        catch (err) {
            this.runner.setError(err instanceof Error ? err.message : String(err));
        }
        this.render();
    }
    /**
     * Submit officially and register progress.
     */
    async submitCurrentCode() {
        const currentChallenge = this.instructions.challenge;
        if (!currentChallenge)
            return;
        if (!currentChallenge.isUnlocked) {
            this.statusBar.showNotification('[LOCK] Cet exercice est verrouillé.');
            return;
        }
        const code = this.editor.getText();
        const localFilePath = resolve(`${currentChallenge.slug}.js`);
        await writeFile(localFilePath, code, { encoding: 'utf8' });
        this.runner.setLoading(false, false, `Soumission officielle de ${currentChallenge.title}...`);
        this.activePanel = 'results';
        this.statusBar.setActivePanel('results');
        this.render();
        try {
            const submission = await this.api.createSubmission({
                challengeId: currentChallenge.id,
                code,
                idempotencyKey: randomUUID(),
                dryRun: false,
            });
            this.runner.setSubmission(submission, false);
            if (submission.accepted) {
                currentChallenge.isCompleted = true;
                this.statusBar.showNotification(`✓ Challenge validé avec succès ! (+${currentChallenge.points} pts)`);
                const challengesRes = await this.api.listChallenges(1, 200);
                this.tree.setChallenges(challengesRes.data);
            }
        }
        catch (err) {
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
            let handler;
            const onData = async (chunk) => {
                const text = this.decodeInput(chunk);
                if (text === null)
                    return;
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
                // Global quit: Ctrl+C, Ctrl+Q, or q outside the code editor.
                if (text === '\u0003' ||
                    text === '\u0011' ||
                    (text.toLowerCase() === 'q' && this.activePanel !== 'editor')) {
                    input.off('data', handler);
                    this.isRunning = false;
                    resolve();
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
                if (this.showHelp) {
                    if (text === '?' || text === '\x1b' || text === '\r') {
                        this.showHelp = false;
                        this.render();
                    }
                    return;
                }
                // Contextual help is available from every non-editor panel.
                if (text === '?' && this.activePanel !== 'editor') {
                    this.showHelp = true;
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
            handler = (chunk) => {
                void onData(chunk).catch((err) => {
                    this.statusBar.showNotification(`Erreur inattendue: ${err instanceof Error ? err.message : String(err)}`);
                    this.render();
                });
            };
            input.on('data', handler);
        });
    }
    decodeInput(chunk) {
        this.inputBuffer += chunk.toString('utf8');
        if (this.inputBuffer.startsWith('\x1b[<')) {
            if (!/[Mm]$/.test(this.inputBuffer))
                return null;
        }
        else if (this.inputBuffer.startsWith('\x1b[')) {
            if (!/[@-~]$/.test(this.inputBuffer))
                return null;
        }
        const decoded = this.inputBuffer;
        this.inputBuffer = '';
        return decoded;
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
        const { is3Columns, leftWidth, midWidth, editorTop, editorHeight, editorLeft, runnerTop, runnerHeight, } = this.layout;
        // 1. Mouse Wheel Scroll Up (btn === 64)
        if (btn === 64) {
            if (col <= leftWidth) {
                this.tree.moveUp();
                const sel = this.tree.getSelectedChallenge();
                if (sel && sel.slug !== this.loadedExerciseSlug)
                    await this.selectChallenge(sel);
            }
            else if (is3Columns && col <= leftWidth + 1 + midWidth) {
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
            if (col <= leftWidth) {
                this.tree.moveDown();
                const sel = this.tree.getSelectedChallenge();
                if (sel && sel.slug !== this.loadedExerciseSlug)
                    await this.selectChallenge(sel);
            }
            else if (is3Columns && col <= leftWidth + 1 + midWidth) {
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
            if (col <= leftWidth) {
                this.activePanel = 'tree';
                this.statusBar.setActivePanel('tree');
                const treeStartRow = 4; // Header is ~3 lines
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
            if (is3Columns && col <= leftWidth + 1 + midWidth) {
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
                this.statusBar.showNotification(`[LOCK] L’exercice #${sel.number} est verrouillé.`);
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
            this.statusBar.showNotification('[LOCK] Exercice verrouillé : écriture désactivée.');
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
    renderHelp(rows, cols) {
        const lines = [
            `${ANSI.brightCyan}${ANSI.bold} AIDE JS CHALLENGE ${ANSI.reset}`,
            '',
            `${ANSI.bold}Navigation${ANSI.reset}`,
            '  Tab / Shift+Tab   Changer de panneau',
            '  j / k ou ↑ / ↓    Déplacer la sélection ou faire défiler',
            '  Entrée            Ouvrir l’exercice sélectionné',
            '  ?                 Fermer cette aide',
            '  Ctrl+R            Actualiser le catalogue',
            '  Ctrl+Q / Ctrl+C   Quitter',
            '',
            `${ANSI.bold}Édition et validation${ANSI.reset}`,
            '  Ctrl+T / F5       Vérification serveur non persistée',
            '  Ctrl+S / F6       Soumission officielle et progression',
            '  Souris            Cliquer, sélectionner, défiler',
            '',
            `${ANSI.dim}Appuyez sur ? ou Échap pour revenir${ANSI.reset}`,
        ];
        const contentWidth = Math.min(72, cols - 8);
        const startRow = Math.max(2, Math.floor((rows - lines.length) / 2));
        const startCol = Math.max(2, Math.floor((cols - contentWidth) / 2));
        const outputLines = [ANSI.clearScreen];
        for (let index = 0; index < lines.length; index += 1) {
            outputLines.push(moveTo(startRow + index, startCol) + padRight(lines[index], contentWidth));
        }
        return outputLines;
    }
    computeLayout(rows, cols) {
        const is3Columns = cols >= 105;
        const statusBarHeight = 1;
        const mainHeight = rows - statusBarHeight;
        if (is3Columns) {
            const leftWidth = Math.min(30, Math.max(24, Math.floor(cols * 0.22)));
            const midWidth = Math.min(48, Math.max(34, Math.floor(cols * 0.35)));
            const rightWidth = cols - leftWidth - midWidth - 2; // 2 vertical dividers
            const runnerHeight = Math.max(7, Math.floor(mainHeight * 0.36));
            const editorHeight = mainHeight - runnerHeight - 2; // 2 header borders
            const editorLeft = leftWidth + midWidth + 2;
            return {
                is3Columns: true,
                leftWidth,
                midWidth,
                rightWidth,
                mainHeight,
                instructionsTop: 1,
                instructionsHeight: mainHeight - 1,
                editorTop: 1,
                editorHeight,
                editorLeft,
                runnerTop: editorHeight + 2,
                runnerHeight,
                runnerLeft: editorLeft,
            };
        }
        else {
            const leftWidth = Math.min(28, Math.max(22, Math.floor(cols * 0.26)));
            const rightWidth = cols - leftWidth - 1;
            const instructionsHeight = Math.max(6, Math.floor(mainHeight * 0.32));
            const runnerHeight = Math.max(5, Math.floor(mainHeight * 0.26));
            const editorHeight = mainHeight - instructionsHeight - runnerHeight - 3;
            return {
                is3Columns: false,
                leftWidth,
                midWidth: 0,
                rightWidth,
                mainHeight,
                instructionsTop: 1,
                instructionsHeight,
                editorTop: instructionsHeight + 2,
                editorHeight,
                editorLeft: leftWidth + 1,
                runnerTop: instructionsHeight + editorHeight + 3,
                runnerHeight,
                runnerLeft: leftWidth + 1,
            };
        }
    }
    render() {
        if (!this.isRunning)
            return;
        const actualRows = output.rows || 24;
        const actualCols = output.columns || 80;
        if (actualRows < 24 || actualCols < 80) {
            const message = [
                ANSI.clearScreen,
                moveTo(Math.max(1, Math.floor(actualRows / 2) - 1), 1),
                padCenter(`${ANSI.brightYellow}${ANSI.bold}Terminal trop petit${ANSI.reset}`, actualCols),
                moveTo(Math.max(1, Math.floor(actualRows / 2) + 1), 1),
                padCenter(`${ANSI.dim}JS Challenge nécessite au minimum 80x24.${ANSI.reset}`, actualCols),
                moveTo(Math.max(1, Math.floor(actualRows / 2) + 3), 1),
                padCenter(`${ANSI.dim}Redimensionnez le terminal ou appuyez sur Ctrl+C pour quitter.${ANSI.reset}`, actualCols),
            ].join('');
            output.write(`${ANSI.syncStart}${message}${ANSI.syncEnd}`);
            return;
        }
        const rows = actualRows;
        const cols = actualCols;
        let buffer = `${ANSI.syncStart}${moveTo(1, 1)}`;
        if (this.isAuthenticating) {
            buffer += ANSI.clearScreen;
            const modalLines = this.loginModal.render(rows, cols);
            const startRow = Math.max(1, Math.floor((rows - modalLines.length) / 2));
            for (let i = 0; i < modalLines.length; i += 1) {
                buffer += moveTo(startRow + i, Math.max(1, Math.floor((cols - 64) / 2))) + modalLines[i];
            }
            output.write(`${buffer}${ANSI.syncEnd}`);
            return;
        }
        if (this.showHelp) {
            output.write(`${ANSI.syncStart}${this.renderHelp(rows, cols).join('')}${ANSI.syncEnd}`);
            return;
        }
        const layout = this.computeLayout(rows, cols);
        this.layout = layout;
        const panelHeader = (title, width, isFocused = false, actionTag = '') => {
            const color = isFocused
                ? ANSI.panelFocus + ANSI.white + ANSI.bold
                : ANSI.panelSurface + ANSI.muted;
            const edge = isFocused ? BOX.horizontalHeavy : BOX.horizontal;
            const tagStr = actionTag ? ` ${actionTag}` : '';
            const prefix = ` ${title}${tagStr} `;
            const barLen = Math.max(0, width - stringWidth(prefix) - 1);
            const bar = edge.repeat(barLen);
            return `${color}${edge}${prefix}${bar}${ANSI.reset}`;
        };
        // 1. Render Tree column
        const treeLines = this.tree.render(layout.mainHeight, layout.leftWidth, this.activePanel === 'tree');
        if (layout.is3Columns) {
            // 3-Column Layout: Tree | Instructions | Editor + Tests
            const instructionsHeader = panelHeader('CONSIGNES & OBJECTIF', layout.midWidth, this.activePanel === 'instructions');
            const instructionLines = [
                instructionsHeader,
                ...this.instructions.render(layout.instructionsHeight, layout.midWidth, this.activePanel === 'instructions'),
            ];
            const editorAction = this.editor.isLocked
                ? '[LOCK]'
                : '[Ctrl+T/F5: Vérifier │ Ctrl+S/F6: Valider]';
            const editorHeader = panelHeader('ÉDITEUR JAVASCRIPT', layout.rightWidth, this.activePanel === 'editor', editorAction);
            const runnerHeader = panelHeader('CONSOLE & TESTS', layout.rightWidth, this.activePanel === 'results');
            const editorLines = this.editor.render(layout.editorHeight, layout.rightWidth, this.activePanel === 'editor');
            const runnerLines = this.runner.render(layout.runnerHeight, layout.rightWidth, this.activePanel === 'results');
            const rightColLines = [editorHeader, ...editorLines, runnerHeader, ...runnerLines];
            for (let r = 0; r < layout.mainHeight; r += 1) {
                const col1 = treeLines[r] || ' '.repeat(layout.leftWidth);
                const col2 = instructionLines[r] || ' '.repeat(layout.midWidth);
                const col3 = rightColLines[r] || ' '.repeat(layout.rightWidth);
                const div = `${ANSI.gray}${BOX.vertical}${ANSI.reset}`;
                buffer += moveTo(r + 1, 1) + `${col1}${div}${col2}${div}${col3}`;
            }
        }
        else {
            // 2-Column Layout
            const instructionsHeader = panelHeader('CONSIGNES & OBJECTIF', layout.rightWidth, this.activePanel === 'instructions');
            const editorAction = this.editor.isLocked
                ? '[LOCK]'
                : '[Ctrl+T/F5: Vérifier │ Ctrl+S/F6: Valider]';
            const editorHeader = panelHeader('ÉDITEUR JAVASCRIPT', layout.rightWidth, this.activePanel === 'editor', editorAction);
            const runnerHeader = panelHeader('CONSOLE & TESTS', layout.rightWidth, this.activePanel === 'results');
            const instructionLines = this.instructions.render(layout.instructionsHeight, layout.rightWidth, this.activePanel === 'instructions');
            const editorLines = this.editor.render(layout.editorHeight, layout.rightWidth, this.activePanel === 'editor');
            const runnerLines = this.runner.render(layout.runnerHeight, layout.rightWidth, this.activePanel === 'results');
            const rightColLines = [
                instructionsHeader,
                ...instructionLines,
                editorHeader,
                ...editorLines,
                runnerHeader,
                ...runnerLines,
            ];
            for (let r = 0; r < layout.mainHeight; r += 1) {
                const col1 = treeLines[r] || ' '.repeat(layout.leftWidth);
                const col2 = rightColLines[r] || ' '.repeat(layout.rightWidth);
                const div = `${ANSI.gray}${BOX.vertical}${ANSI.reset}`;
                buffer += moveTo(r + 1, 1) + `${col1}${div}${col2}`;
            }
        }
        // Status bar at bottom
        buffer += moveTo(rows, 1) + this.statusBar.render(cols);
        output.write(`${buffer}${ANSI.syncEnd}`);
    }
}
//# sourceMappingURL=app.js.map