import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Box, useApp, Text } from 'ink';
import { randomUUID } from 'node:crypto';
import { ApiClient } from '../api_client.js';
import { ConfigStore } from '../config_store.js';
import { openBrowser } from '../browser.js';
import { DEFAULT_PRODUCTION_API_URL } from '../environment.js';
import { EditorPersistence } from '../editor_persistence.js';
import { Header } from './Header.js';
import { ChallengeList } from './ChallengeList.js';
import { ChallengeDetails } from './ChallengeDetails.js';
import { CodeEditorView } from './CodeEditorView.js';
import { TestView } from './TestView.js';
import { HelpView } from './HelpView.js';
import { LoginView } from './LoginView.js';
import { COLORS, inferStarterCode } from './theme.js';
import { createTerminalViewState, getSelectedExercise, reduceTerminalViewState, } from './terminal_view_state.js';
import { LatestExerciseCodeRequest } from './exercise_code_request.js';
import { LatestDryRun, createEditorFeedbackState, reduceEditorFeedback } from './editor_feedback.js';
import { shortcutKeys } from './shortcut_catalog.js';
import { useTerminalInput } from './use_terminal_input.js';
export const App = ({ apiBaseUrl = DEFAULT_PRODUCTION_API_URL, environment = 'production', clientVersion = 'unknown', initialSlug, }) => {
    const { exit } = useApp();
    const [store] = useState(() => new ConfigStore(process.env, undefined, environment));
    const [api, setApi] = useState(() => new ApiClient(apiBaseUrl, () => store.read().then((c) => c.token), clientVersion));
    const [user, setUser] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [terminalState, setTerminalState] = useState(() => createTerminalViewState());
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [browserOpened, setBrowserOpened] = useState(false);
    const [editorCode, setEditorCode] = useState('');
    const [loadedExerciseId, setLoadedExerciseId] = useState(null);
    const [editorLoadError, setEditorLoadError] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const [isDryRun, setIsDryRun] = useState(true);
    const [submission, setSubmission] = useState(null);
    const [testError, setTestError] = useState(null);
    const [executionTimeMs, setExecutionTimeMs] = useState(null);
    const [editorFeedback, setEditorFeedback] = useState(() => createEditorFeedbackState());
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
            const client = new ApiClient(apiBaseUrl, () => Promise.resolve(config.token), clientVersion);
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
    }, [apiBaseUrl, clientVersion, replaceChallenges, store]);
    useEffect(() => {
        loadData();
    }, [loadData]);
    useEffect(() => {
        if (!isAuthenticating)
            return;
        setBrowserOpened(openBrowser(`${apiBaseUrl}/profile#api-token`));
    }, [apiBaseUrl, isAuthenticating]);
    useEffect(() => {
        if (initialSlug && challenges.length > 0) {
            const challenge = challenges.find((c) => c.slug === initialSlug);
            if (challenge) {
                dispatchTerminalEvent({ type: 'select-exercise', exerciseId: challenge.id });
                dispatchTerminalEvent({ type: 'select-view', view: 'editor' });
            }
        }
    }, [initialSlug, challenges]);
    const currentChallenge = getSelectedExercise(terminalState, challenges);
    // Prepare challenge code from local file or infer starter code
    const prepareChallengeFile = useCallback(async (challenge) => {
        const fullChallenge = await api.getChallenge(challenge.slug);
        const starter = inferStarterCode(fullChallenge);
        const persistence = new EditorPersistence({
            slug: challenge.slug,
            legacyWorkspacePath: process.cwd(),
            legacyExerciseId: challenge.id,
        });
        persistenceByExerciseRef.current.set(challenge.id, persistence);
        const opened = await persistence.open(starter);
        const isPlaceholder = opened.code.trim() === "console.log('Hello');" ||
            opened.code.trim() === "console.log('Hello')";
        if (isPlaceholder) {
            await persistence.save(starter);
            return { exerciseId: challenge.id, code: starter, persistence };
        }
        return {
            exerciseId: challenge.id,
            code: opened.code,
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
            setEditorLoadError(null);
            void exerciseCodeRequestRef.current.load(currentChallenge, prepareChallengeFile, (session) => {
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
            setEditorLoadError(null);
        }
    }, [currentChallenge, prepareChallengeFile]);
    const editorIsReady = currentChallenge !== null && loadedExerciseId === currentChallenge.id;
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
                    `${err instanceof Error ? err.message : String(err)} Réessayez avec ${shortcutKeys('editor-save')}.`;
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
    useTerminalInput({
        state: terminalState,
        isAuthenticating,
        editorOwnsInput: editorIsReady,
        dispatch: dispatchTerminalEvent,
        exit,
    });
    // Handle Login submission
    const handleLogin = async (token) => {
        await store.save({ apiBaseUrl, token });
        await loadData();
    };
    if (isAuthenticating) {
        return (_jsx(Box, { justifyContent: "center", alignItems: "center", paddingY: 2, children: _jsx(LoginView, { environment: environment, browserOpened: browserOpened, onSubmit: handleLogin, errorMessage: loginError }) }));
    }
    return (_jsxs(Box, { flexDirection: "column", paddingX: 1, paddingY: 0, children: [_jsx(Header, { user: user, challenges: challenges, activeView: terminalState.activeView, environment: environment }), terminalState.activeView === 'catalog' && (_jsx(ChallengeList, { exercises: challenges, selectedExerciseId: terminalState.selectedExerciseId, searchQuery: terminalState.searchQuery, filterMode: terminalState.filterMode })), terminalState.activeView === 'instructions' && (_jsx(ChallengeDetails, { challenge: currentChallenge })), terminalState.activeView === 'editor' && currentChallenge && editorIsReady && (_jsx(CodeEditorView, { challenge: currentChallenge, initialCode: editorCode, feedback: editorFeedback, onSaveCode: handleSaveCode, onCodeChange: handleEditorCodeChange, onTestLocally: (code) => runTestLocally(currentChallenge, code), onSubmitSolution: (code) => submitSolution(currentChallenge, code, true), onSelectView: (view) => dispatchTerminalEvent({ type: 'select-view', view }), onBack: () => dispatchTerminalEvent({ type: 'back' }) })), terminalState.activeView === 'editor' && currentChallenge && !editorIsReady && (_jsx(Box, { borderStyle: "round", padding: 1, children: _jsx(Text, { color: editorLoadError ? COLORS.error : COLORS.cyan, children: editorLoadError
                        ? `Impossible de charger la solution : ${editorLoadError}`
                        : `Chargement de la solution pour ${currentChallenge.title}…` }) })), terminalState.activeView === 'tests' && (_jsx(TestView, { exerciseTitle: currentChallenge?.title || 'Exercice', isTesting: isTesting, isDryRun: isDryRun, submission: submission, error: testError, executionTimeMs: executionTimeMs })), terminalState.activeView === 'help' && _jsx(HelpView, {})] }));
};
//# sourceMappingURL=App.js.map