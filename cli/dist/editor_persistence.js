import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { atomicWriteFile } from './atomic_write.js';
import { DEFAULT_API_URL, normalizeApiUrl } from './config_store.js';
export class EditorPersistence {
    virtualFilePath;
    /** Tracks the starter code a draft was seeded from, to detect untouched drafts left stale by a contract update. */
    seedFilePath;
    slug;
    // Legacy paths for migration
    legacyWorkspacePath;
    legacyExerciseId;
    legacyFilePath;
    legacyRecoveryFilePath;
    saveQueue = Promise.resolve();
    constructor(key, options = {}) {
        const env = options.env ?? process.env;
        const home = options.home ?? homedir();
        const platform = options.platform ?? process.platform;
        this.slug = key.slug;
        const normalizedApiBaseUrl = normalizeApiUrl(key.apiBaseUrl || DEFAULT_API_URL);
        const targetFolder = normalizedApiBaseUrl === DEFAULT_API_URL ? [] : [digest(normalizedApiBaseUrl)];
        this.virtualFilePath = join(stateHome(env, home, platform), 'codojo', 'exercises', ...targetFolder, `${this.slug}.js`);
        this.seedFilePath = join(dirname(this.virtualFilePath), `${this.slug}.seed.json`);
        if (key.legacyWorkspacePath && key.legacyExerciseId) {
            this.legacyWorkspacePath = resolve(key.legacyWorkspacePath);
            this.legacyExerciseId = key.legacyExerciseId;
            this.legacyFilePath = resolve(this.legacyWorkspacePath, `${this.slug}.js`);
            const workspaceKey = digest(this.legacyWorkspacePath);
            const exerciseKey = digest(this.legacyExerciseId);
            this.legacyRecoveryFilePath = join(stateHome(env, home, platform), 'codojo', 'recovery', workspaceKey, `${exerciseKey}.json`);
        }
    }
    async open(starterCode) {
        try {
            const code = await readFile(this.virtualFilePath, 'utf8');
            return await this.reconcileWithStarterCode(code, starterCode);
        }
        catch (error) {
            if (!hasCode(error, 'ENOENT'))
                throw error;
            // Virtual document doesn't exist, try non-destructive migration
            const migratedCode = await this.migrateLegacyData();
            const initialCode = migratedCode !== null ? migratedCode : starterCode;
            await atomicWriteFile(this.virtualFilePath, initialCode);
            await this.writeSeed(initialCode);
            return { code: initialCode };
        }
    }
    save(code) {
        const operation = this.saveQueue.catch(() => undefined).then(() => atomicWriteFile(this.virtualFilePath, code));
        this.saveQueue = operation;
        return operation;
    }
    /**
     * A saved draft can go stale when the exercise's starter code changes server-side (e.g. a
     * contract republish). We can only tell "untouched starter code" apart from "the learner's
     * work" by comparing the draft against the hash it was seeded with, so an unmodified draft is
     * safely refreshed while any real edit is always left alone.
     */
    async reconcileWithStarterCode(savedCode, starterCode) {
        const seededHash = await this.readSeedHash();
        if (seededHash === null) {
            // No seed record (drafts created before this existed, or migrated from a legacy path).
            // We can't tell an edited draft from a starter template that just happens to be stale, so
            // never auto-refresh here. Only bootstrap a seed when the draft already matches the
            // current starter code exactly — that's a safe baseline, not a guess.
            if (savedCode === starterCode)
                await this.writeSeed(starterCode);
            return { code: savedCode };
        }
        if (seededHash === contentHash(savedCode) && savedCode !== starterCode) {
            await atomicWriteFile(this.virtualFilePath, starterCode);
            await this.writeSeed(starterCode);
            return { code: starterCode };
        }
        return { code: savedCode };
    }
    async readSeedHash() {
        try {
            const parsed = JSON.parse(await readFile(this.seedFilePath, 'utf8'));
            return typeof parsed.seededStarterCodeHash === 'string' ? parsed.seededStarterCodeHash : null;
        }
        catch (error) {
            if (!hasCode(error, 'ENOENT'))
                throw error;
            return null;
        }
    }
    async writeSeed(code) {
        const record = { version: 1, seededStarterCodeHash: contentHash(code) };
        await atomicWriteFile(this.seedFilePath, JSON.stringify(record));
    }
    async migrateLegacyData() {
        if (!this.legacyFilePath || !this.legacyRecoveryFilePath || !this.legacyWorkspacePath || !this.legacyExerciseId) {
            return null;
        }
        let legacyMainCode = null;
        let legacyMainMtime = 0;
        try {
            const mainStat = await stat(this.legacyFilePath);
            legacyMainCode = await readFile(this.legacyFilePath, 'utf8');
            legacyMainMtime = mainStat.mtimeMs;
        }
        catch (error) {
            if (!hasCode(error, 'ENOENT'))
                throw error;
        }
        let recoveryCode = null;
        let recoverySavedAt = 0;
        try {
            const parsed = JSON.parse(await readFile(this.legacyRecoveryFilePath, 'utf8'));
            if (parsed.version === 1 &&
                parsed.workspacePath === this.legacyWorkspacePath &&
                parsed.exerciseId === this.legacyExerciseId &&
                typeof parsed.code === 'string' &&
                typeof parsed.savedAt === 'number') {
                recoveryCode = parsed.code;
                recoverySavedAt = parsed.savedAt;
            }
        }
        catch (error) {
            if (!hasCode(error, 'ENOENT'))
                throw error;
        }
        // Pick the most recent one
        if (recoveryCode !== null && legacyMainCode !== null) {
            return recoverySavedAt > legacyMainMtime ? recoveryCode : legacyMainCode;
        }
        if (recoveryCode !== null)
            return recoveryCode;
        if (legacyMainCode !== null)
            return legacyMainCode;
        return null;
    }
}
function stateHome(env, home, platform) {
    if (env.XDG_STATE_HOME)
        return env.XDG_STATE_HOME;
    if (platform === 'darwin')
        return join(home, 'Library', 'Application Support');
    if (platform === 'win32') {
        return env.LOCALAPPDATA || env.APPDATA || join(home, 'AppData', 'Local');
    }
    return join(home, '.local', 'state');
}
function digest(value) {
    return createHash('sha256').update(value).digest('hex').slice(0, 24);
}
function contentHash(value) {
    return createHash('sha256').update(value).digest('hex');
}
function hasCode(error, code) {
    return error instanceof Error && 'code' in error && error.code === code;
}
//# sourceMappingURL=editor_persistence.js.map