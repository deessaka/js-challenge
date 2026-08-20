import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Box, useApp, Text } from 'ink';
import { readFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ApiClient } from '../api_client.js';
import { ConfigStore, DEFAULT_API_URL } from '../config_store.js';
import { EditorPersistence } from '../editor_persistence.js';
import { Header } from './Header.js';
import { ChallengeList } from './ChallengeList.js';
import { ChallengeDetails } from './ChallengeDetails.js';
import { CodeEditorView } from './CodeEditorView.js';
import { TestView } from './TestView.js';
import { HelpView } from './HelpView.js';
import { LoginView } from './LoginView.js';
import { RecoveryPrompt } from './RecoveryPrompt.js';
import { COLORS, inferStarterCode } from './theme.js';
import { createTerminalViewState, getSelectedExercise, reduceTerminalViewState, } from './terminal_view_state.js';
import { LatestExerciseCodeRequest } from './exercise_code_request.js';
import { LatestDryRun, createEditorFeedbackState, reduceEditorFeedback } from './editor_feedback.js';
import { useTerminalInput } from './use_terminal_input.js';
export const App = ({ apiBaseUrl = DEFAULT_API_URL }) => {
    const { exit } = useApp();
    const [store] = useState(() => new ConfigStore(process.env));
    const [api, setApi] = useState(() => new ApiClient(apiBaseUrl, () => store.read().then((c) => c.token)));
    const [user, setUser] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [terminalState, setTerminalState] = useState(() => createTerminalViewState());
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [editorCode, setEditorCode] = useState('');
    const [loadedExerciseId, setLoadedExerciseId] = useState(null);
    const [pendingRecovery, setPendingRecovery] = useState(null);
    const [editorLoadError, setEditorLoadError] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const [isDryRun, setIsDryRun] = useState(true);
    const [isWatching, setIsWatching] = useState(false);
    const [submission, setSubmission] = useState(null);
    const [testError, setTestError] = useState(null);
    const [executionTimeMs, setExecutionTimeMs] = useState(null);
    const [editorFeedback, setEditorFeedback] = useState(() => createEditorFeedbackState());
    const watcherRef = useRef(null);
    const debounceTimerRef = useRef(null);
    const exerciseCodeRequestRef = useRef(new LatestExerciseCodeRequest());
    const persistenceByExerciseRef = useRef(new Map());
    const latestDryRunRef = useRef(new LatestDryRun());
    const dispatchTerminalEvent = useCallback((event) => {
        setTerminalState((state) => reduceTerminalViewState(state, event, challenges));
    }, [challenges]);
    const replaceChallenges = useCallback((nextChallenges) => {
        setChallenges(nextChallenges);
        setTerminalState((state) => reduceTerminalViewState(state, { type: 'catalog-updated' }, nextChallenges));
    }, []);
    // Load Initial Data
    const loadData = useCallback(async () => {
        try {
            const config = await store.read();
            if (!config.token) {
                setIsAuthenticating(true);
                return;
            }
            const client = new ApiClient(apiBaseUrl, () => Promise.resolve(config.token));
            setApi(client);
            const me = await client.getMe();
            setUser(me);
            const res = await client.listAllChallenges();
            replaceChallenges(res.data);
            setIsAuthenticating(false);
        }
        catch (err) {
            setIsAuthenticating(true);
            setLoginError(err instanceof Error ? err.message : 'Erreur d’authentification');
        }
    }, [apiBaseUrl, replaceChallenges, store]);
    useEffect(() => {
        loadData();
    }, [loadData]);
    const currentChallenge = getSelectedExercise(terminalState, challenges);
    // Prepare challenge code from local file or infer starter code
    const prepareChallengeFile = useCallback(async (challenge) => {
        const fullChallenge = await api.getChallenge(challenge.slug);
        const filePath = resolve(`${challenge.slug}.js`);
        const starter = inferStarterCode(fullChallenge);
        const persistence = new EditorPersistence({
            workspacePath: process.cwd(),
            exerciseId: challenge.id,
            filePath,
        });
        persistenceByExerciseRef.current.set(challenge.id, persistence);
        const opened = await persistence.open(starter);
        const isPlaceholder = opened.code.trim() === "console.log('Hello');" ||
            opened.code.trim() === "console.log('Hello')";
        if (isPlaceholder && !opened.recovery) {
            await persistence.save(starter);
            return { exerciseId: challenge.id, code: starter, recovery: null, persistence };
        }
        return {
            exerciseId: challenge.id,
            code: opened.code,
            recovery: opened.recovery,
            persistence,
        };
    }, [api]);
    // Sync editor code whenever challenge changes
    useEffect(() => {
        if (currentChallenge) {
            latestDryRunRef.current.invalidate();
            setEditorFeedback(createEditorFeedbackState());
            setEditorCode('');
            setLoadedExerciseId(null);
            setPendingRecovery(null);
            setEditorLoadError(null);
            void exerciseCodeRequestRef.current.load(currentChallenge, prepareChallengeFile, (session) => {
                if (session.recovery) {
                    setPendingRecovery(session);
                    return;
                }
                setEditorCode(session.code);
                setLoadedExerciseId(session.exerciseId);
            }, (error) => {
                setEditorLoadError(error instanceof Error ? error.message : String(error));
            });
        }
        else {
            latestDryRunRef.current.invalidate();
            setEditorFeedback(createEditorFeedbackState());
            exerciseCodeRequestRef.current.cancel();
            setEditorCode('');
            setLoadedExerciseId(null);
            setPendingRecovery(null);
            setEditorLoadError(null);
        }
    }, [currentChallenge, prepareChallengeFile]);
    const editorIsReady = currentChallenge !== null && loadedExerciseId === currentChallenge.id;
    const recoveryAwaitingChoice = currentChallenge !== null && pendingRecovery?.exerciseId === currentChallenge.id;
    // Save Code Handler
    const handleSaveCode = useCallback(async (newCode) => {
        if (!currentChallenge)
            return;
        setEditorCode(newCode);
        const persistence = persistenceByExerciseRef.current.get(currentChallenge.id) ??
            (await prepareChallengeFile(currentChallenge)).persistence;
        await persistence.save(newCode);
    }, [currentChallenge, prepareChallengeFile]);
    const handleEditorCodeChange = useCallback((newCode) => {
        setEditorCode(newCode);
        setIsTesting(false);
        latestDryRunRef.current.invalidate();
        setEditorFeedback((state) => reduceEditorFeedback(state, { type: 'buffer-changed' }));
    }, []);
    // Run Test Locally (Dry-run)
    const runTestLocally = useCallback(async (challenge, codeOverride) => {
        const needsSession = !persistenceByExerciseRef.current.has(challenge.id) ||
            (codeOverride === undefined && loadedExerciseId !== challenge.id);
        const session = needsSession ? await prepareChallengeFile(challenge) : null;
        const codeToRun = codeOverride ?? (loadedExerciseId === challenge.id ? editorCode : (session?.code ?? ''));
        setIsTesting(true);
        setIsDryRun(true);
        setTestError(null);
        setSubmission(null);
        setEditorFeedback((state) => reduceEditorFeedback(state, { type: 'dry-run-started' }));
        let applied = false;
        try {
            const outcome = await latestDryRunRef.current.run(() => api.createSubmission({
                challengeId: challenge.id,
                code: codeToRun,
                dryRun: true,
            }));
            if (!outcome)
                return;
            applied = true;
            setExecutionTimeMs(outcome.durationMs);
            setSubmission(outcome.submission);
            setEditorFeedback((state) => reduceEditorFeedback(state, {
                type: 'dry-run-succeeded',
                submission: outcome.submission,
                durationMs: outcome.durationMs,
            }));
        }
        catch (err) {
            applied = true;
            const message = err instanceof Error ? err.message : String(err);
            setTestError(message);
            setEditorFeedback((state) => reduceEditorFeedback(state, { type: 'dry-run-failed', error: message }));
        }
        finally {
            if (applied)
                setIsTesting(false);
        }
    }, [api, editorCode, loadedExerciseId, prepareChallengeFile]);
    // Submit Solution Officially
    const submitSolution = useCallback(async (challenge, codeOverride, isDurablySaved = false) => {
        const needsSession = !persistenceByExerciseRef.current.has(challenge.id) ||
            (codeOverride === undefined && loadedExerciseId !== challenge.id);
        const session = needsSession ? await prepareChallengeFile(challenge) : null;
        if (session?.recovery) {
            setPendingRecovery(session);
            dispatchTerminalEvent({ type: 'select-view', view: 'editor' });
            return;
        }
        const codeToRun = codeOverride ?? (loadedExerciseId === challenge.id ? editorCode : (session?.code ?? ''));
        const persistence = persistenceByExerciseRef.current.get(challenge.id) ?? session?.persistence;
        if (!isDurablySaved) {
            try {
                if (!persistence)
                    throw new Error('Stockage durable indisponible.');
                await persistence.save(codeToRun);
            }
            catch (err) {
                const message = `Soumission bloquée : la sauvegarde durable a échoué. ` +
                    `${err instanceof Error ? err.message : String(err)} Réessayez avec Ctrl+S.`;
                setIsDryRun(false);
                setSubmission(null);
                setTestError(message);
                dispatchTerminalEvent({ type: 'select-view', view: 'tests' });
                return;
            }
        }
        setIsTesting(true);
        setIsDryRun(false);
        setTestError(null);
        setSubmission(null);
        dispatchTerminalEvent({ type: 'select-view', view: 'tests' });
        const start = Date.now();
        try {
            const sub = await api.createSubmission({
                challengeId: challenge.id,
                code: codeToRun,
                idempotencyKey: randomUUID(),
                dryRun: false,
            });
            setExecutionTimeMs(Date.now() - start);
            setSubmission(sub);
            if (sub.accepted) {
                const me = await api.getMe();
                setUser(me);
                const res = await api.listAllChallenges();
                replaceChallenges(res.data);
            }
        }
        catch (err) {
            setTestError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setIsTesting(false);
        }
    }, [
        api,
        dispatchTerminalEvent,
        editorCode,
        loadedExerciseId,
        prepareChallengeFile,
        replaceChallenges,
    ]);
    // Watch Mode Setup
    useEffect(() => {
        if (!isWatching || !currentChallenge) {
            if (watcherRef.current) {
                watcherRef.current.close();
                watcherRef.current = null;
            }
            return;
        }
        const filePath = resolve(`${currentChallenge.slug}.js`);
        const startWatching = async () => {
            await prepareChallengeFile(currentChallenge);
            try {
                const watcher = watch(filePath, async () => {
                    if (debounceTimerRef.current)
                        clearTimeout(debounceTimerRef.current);
                    debounceTimerRef.current = setTimeout(async () => {
                        try {
                            const updated = await readFile(filePath, 'utf8');
                            setEditorCode(updated);
                            runTestLocally(currentChallenge, updated);
                        }
                        catch {
                            // fallback
                        }
                    }, 200);
                });
                watcherRef.current = watcher;
            }
            catch {
                // watch fallback
            }
        };
        startWatching();
        return () => {
            if (watcherRef.current) {
                watcherRef.current.close();
                watcherRef.current = null;
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [isWatching, currentChallenge, prepareChallengeFile, runTestLocally]);
    useTerminalInput({
        state: terminalState,
        isAuthenticating,
        editorOwnsInput: editorIsReady || recoveryAwaitingChoice,
        selectedExercise: currentChallenge,
        dispatch: dispatchTerminalEvent,
        exit,
        runTest: runTestLocally,
        submit: submitSolution,
        toggleWatch: () => setIsWatching((watching) => !watching),
    });
    // Handle Login submission
    const handleLogin = async (token) => {
        await store.save({ apiBaseUrl, token });
        await loadData();
    };
    if (isAuthenticating) {
        return (_jsx(Box, { justifyContent: "center", alignItems: "center", paddingY: 2, children: _jsx(LoginView, { tokenUrl: `${apiBaseUrl}/profile#api-token`, onSubmit: handleLogin, errorMessage: loginError }) }));
    }
    return (_jsxs(Box, { flexDirection: "column", paddingX: 1, paddingY: 0, children: [_jsx(Header, { user: user, challenges: challenges, activeView: terminalState.activeView, apiBaseUrl: apiBaseUrl }), terminalState.activeView === 'catalog' && (_jsx(ChallengeList, { exercises: challenges, selectedExerciseId: terminalState.selectedExerciseId, searchQuery: terminalState.searchQuery, filterMode: terminalState.filterMode })), terminalState.activeView === 'instructions' && (_jsx(ChallengeDetails, { challenge: currentChallenge })), terminalState.activeView === 'editor' && currentChallenge && editorIsReady && (_jsx(CodeEditorView, { challenge: currentChallenge, initialCode: editorCode, feedback: editorFeedback, onSaveCode: handleSaveCode, onCodeChange: handleEditorCodeChange, onTestLocally: (code) => runTestLocally(currentChallenge, code), onSubmitSolution: (code) => submitSolution(currentChallenge, code, true), onSelectView: (view) => dispatchTerminalEvent({ type: 'select-view', view }), onBack: () => dispatchTerminalEvent({ type: 'back' }) })), terminalState.activeView === 'editor' &&
                currentChallenge &&
                recoveryAwaitingChoice &&
                pendingRecovery.recovery && (_jsx(RecoveryPrompt, { challengeTitle: currentChallenge.title, mainCode: pendingRecovery.code, recoveryCode: pendingRecovery.recovery.code, onRestore: async () => {
                    const code = await pendingRecovery.persistence.restoreRecovery();
                    setEditorCode(code);
                    setLoadedExerciseId(pendingRecovery.exerciseId);
                    setPendingRecovery(null);
                }, onIgnore: async () => {
                    await pendingRecovery.persistence.ignoreRecovery();
                    try {
                        await readFile(pendingRecovery.persistence.filePath, 'utf8');
                    }
                    catch {
                        await pendingRecovery.persistence.save(pendingRecovery.code);
                    }
                    setEditorCode(pendingRecovery.code);
                    setLoadedExerciseId(pendingRecovery.exerciseId);
                    setPendingRecovery(null);
                }, onSelectView: (view) => dispatchTerminalEvent({ type: 'select-view', view }) })), terminalState.activeView === 'editor' &&
                currentChallenge &&
                !editorIsReady &&
                !recoveryAwaitingChoice && (_jsx(Box, { borderStyle: "round", padding: 1, children: _jsx(Text, { color: editorLoadError ? COLORS.error : COLORS.cyan, children: editorLoadError
                        ? `Impossible de charger la solution : ${editorLoadError}`
                        : `Chargement de la solution pour ${currentChallenge.title}…` }) })), terminalState.activeView === 'tests' && (_jsx(TestView, { challengeTitle: currentChallenge?.title || 'Défi', isTesting: isTesting, isDryRun: isDryRun, isWatching: isWatching, submission: submission, error: testError, executionTimeMs: executionTimeMs })), terminalState.activeView === 'help' && _jsx(HelpView, {})] }));
};
//# sourceMappingURL=App.js.map