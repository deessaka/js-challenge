import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Box, useInput, useApp } from 'ink';
import { access, readFile, writeFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ApiClient } from '../api_client.js';
import { ConfigStore } from '../config_store.js';
import { Header } from './Header.js';
import { ChallengeList } from './ChallengeList.js';
import { ChallengeDetails } from './ChallengeDetails.js';
import { CodeEditorView } from './CodeEditorView.js';
import { TestView } from './TestView.js';
import { HelpView } from './HelpView.js';
import { LoginView } from './LoginView.js';
import { inferStarterCode } from './theme.js';
export const App = ({ apiBaseUrl = 'http://localhost:3333' }) => {
    const { exit } = useApp();
    const [store] = useState(() => new ConfigStore(process.env));
    const [api, setApi] = useState(() => new ApiClient(apiBaseUrl, () => store.read().then((c) => c.token)));
    const [user, setUser] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filterMode, setFilterMode] = useState('all');
    const [activeTab, setActiveTab] = useState('list');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [editorCode, setEditorCode] = useState('');
    const [isTesting, setIsTesting] = useState(false);
    const [isDryRun, setIsDryRun] = useState(true);
    const [isWatching, setIsWatching] = useState(false);
    const [submission, setSubmission] = useState(null);
    const [testError, setTestError] = useState(null);
    const [executionTimeMs, setExecutionTimeMs] = useState(null);
    const watcherRef = useRef(null);
    const debounceTimerRef = useRef(null);
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
            setChallenges(res.data);
            setIsAuthenticating(false);
        }
        catch (err) {
            setIsAuthenticating(true);
            setLoginError(err instanceof Error ? err.message : 'Erreur d’authentification');
        }
    }, [apiBaseUrl, store]);
    useEffect(() => {
        loadData();
    }, [loadData]);
    const currentChallenge = challenges[selectedIndex] || null;
    // Prepare challenge code from local file or infer starter code
    const prepareChallengeFile = useCallback(async (challenge) => {
        const fullChallenge = await api.getChallenge(challenge.slug);
        const filePath = resolve(`${challenge.slug}.js`);
        let starter = inferStarterCode(fullChallenge);
        try {
            await access(filePath);
            const existing = await readFile(filePath, 'utf8');
            if (existing.trim() &&
                existing.trim() !== "console.log('Hello');" &&
                existing.trim() !== "console.log('Hello')") {
                return { filePath, code: existing };
            }
        }
        catch {
            // file does not exist
        }
        await writeFile(filePath, starter, { encoding: 'utf8' });
        return { filePath, code: starter };
    }, [api]);
    // Sync editor code whenever challenge changes
    useEffect(() => {
        if (currentChallenge) {
            prepareChallengeFile(currentChallenge).then(({ code }) => {
                setEditorCode(code);
            });
        }
    }, [currentChallenge, prepareChallengeFile]);
    // Save Code Handler
    const handleSaveCode = useCallback(async (newCode) => {
        if (!currentChallenge)
            return;
        setEditorCode(newCode);
        const filePath = resolve(`${currentChallenge.slug}.js`);
        await writeFile(filePath, newCode, { encoding: 'utf8' });
    }, [currentChallenge]);
    // Run Test Locally (Dry-run)
    const runTestLocally = useCallback(async (challenge, codeOverride) => {
        const codeToRun = codeOverride ?? editorCode;
        const filePath = resolve(`${challenge.slug}.js`);
        await writeFile(filePath, codeToRun, { encoding: 'utf8' });
        setIsTesting(true);
        setIsDryRun(true);
        setTestError(null);
        setSubmission(null);
        setActiveTab('test');
        const start = Date.now();
        try {
            const sub = await api.createSubmission({
                challengeId: challenge.id,
                code: codeToRun,
                dryRun: true,
            });
            setExecutionTimeMs(Date.now() - start);
            setSubmission(sub);
        }
        catch (err) {
            setTestError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setIsTesting(false);
        }
    }, [api, editorCode]);
    // Submit Solution Officially
    const submitSolution = useCallback(async (challenge, codeOverride) => {
        const codeToRun = codeOverride ?? editorCode;
        const filePath = resolve(`${challenge.slug}.js`);
        await writeFile(filePath, codeToRun, { encoding: 'utf8' });
        setIsTesting(true);
        setIsDryRun(false);
        setTestError(null);
        setSubmission(null);
        setActiveTab('test');
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
                setChallenges(res.data);
            }
        }
        catch (err) {
            setTestError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setIsTesting(false);
        }
    }, [api, editorCode]);
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
    // Global Keyboard Input (active when not in integrated editor)
    useInput((input, key) => {
        if (isAuthenticating || activeTab === 'editor')
            return;
        if (key.ctrl && (input === 'c' || input === 'q')) {
            exit();
            return;
        }
        if (isSearching) {
            if (key.return || key.escape) {
                setIsSearching(false);
                return;
            }
            if (key.backspace || key.delete) {
                setSearchQuery((prev) => prev.slice(0, -1));
                return;
            }
            if (input) {
                setSearchQuery((prev) => prev + input);
                return;
            }
        }
        if (input === '/' && activeTab === 'list') {
            setIsSearching(true);
            return;
        }
        // Direct Tab switching numbers
        if (input === '1') {
            setActiveTab('list');
            return;
        }
        if (input === '2') {
            if (currentChallenge)
                setActiveTab('details');
            return;
        }
        if (input === '3') {
            if (currentChallenge && currentChallenge.isUnlocked) {
                setActiveTab('editor');
            }
            return;
        }
        if (input === '4') {
            if (currentChallenge && currentChallenge.isUnlocked) {
                setActiveTab('test');
            }
            return;
        }
        if (input === '?' || input === '\x1bOP') {
            setActiveTab((prev) => (prev === 'help' ? 'list' : 'help'));
            return;
        }
        if (input === 'f' && activeTab === 'list') {
            setFilterMode((prev) => {
                if (prev === 'all')
                    return 'unlocked';
                if (prev === 'unlocked')
                    return 'completed';
                if (prev === 'completed')
                    return 'locked';
                return 'all';
            });
            return;
        }
        if (activeTab === 'list') {
            if (key.upArrow || input === 'k') {
                setSelectedIndex((prev) => Math.max(0, prev - 1));
                return;
            }
            if (key.downArrow || input === 'j') {
                setSelectedIndex((prev) => Math.min(challenges.length - 1, prev + 1));
                return;
            }
            if (key.return) {
                setActiveTab('details');
                return;
            }
        }
        if (activeTab === 'details') {
            if (key.return || input === 'e') {
                if (currentChallenge && currentChallenge.isUnlocked) {
                    setActiveTab('editor');
                }
                return;
            }
        }
        if (currentChallenge && currentChallenge.isUnlocked) {
            if (input === 't' || input === 'r') {
                runTestLocally(currentChallenge);
                return;
            }
            if (input === 's') {
                submitSolution(currentChallenge);
                return;
            }
            if (input === 'w') {
                setIsWatching((prev) => !prev);
                setActiveTab('test');
                return;
            }
        }
        // Hierarchical Level-by-Level Back Navigation
        if (key.escape) {
            if (activeTab === 'test') {
                setActiveTab('editor');
            }
            else if (activeTab === 'details') {
                setActiveTab('list');
            }
            else if (activeTab === 'help') {
                setActiveTab('list');
            }
            else if (searchQuery) {
                setSearchQuery('');
            }
            return;
        }
    });
    // Handle Login submission
    const handleLogin = async (token) => {
        await store.save({ apiBaseUrl, token });
        await loadData();
    };
    if (isAuthenticating) {
        return (_jsx(Box, { justifyContent: "center", alignItems: "center", paddingY: 2, children: _jsx(LoginView, { tokenUrl: `${apiBaseUrl}/profile#api-token`, onSubmit: handleLogin, errorMessage: loginError }) }));
    }
    return (_jsxs(Box, { flexDirection: "column", paddingX: 1, paddingY: 0, children: [_jsx(Header, { user: user, challenges: challenges, activeTab: activeTab }), activeTab === 'list' && (_jsx(ChallengeList, { challenges: challenges, selectedIndex: selectedIndex, searchQuery: searchQuery, filterMode: filterMode })), activeTab === 'details' && _jsx(ChallengeDetails, { challenge: currentChallenge }), activeTab === 'editor' && currentChallenge && (_jsx(CodeEditorView, { challenge: currentChallenge, initialCode: editorCode, onSaveCode: handleSaveCode, onTestLocally: (code) => runTestLocally(currentChallenge, code), onSubmitSolution: (code) => submitSolution(currentChallenge, code), onBack: () => setActiveTab('details') })), activeTab === 'test' && (_jsx(TestView, { challengeTitle: currentChallenge?.title || 'Défi', isTesting: isTesting, isDryRun: isDryRun, isWatching: isWatching, submission: submission, error: testError, executionTimeMs: executionTimeMs })), activeTab === 'help' && _jsx(HelpView, {})] }));
};
//# sourceMappingURL=App.js.map