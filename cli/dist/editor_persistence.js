import { createHash } from 'node:crypto';
import { readFile, rm, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { atomicWriteFile } from './atomic_write.js';
export class EditorPersistence {
    filePath;
    recoveryFilePath;
    workspacePath;
    exerciseId;
    saveQueue = Promise.resolve();
    constructor(key, options = {}) {
        const env = options.env ?? process.env;
        const home = options.home ?? homedir();
        const platform = options.platform ?? process.platform;
        this.workspacePath = resolve(key.workspacePath);
        this.exerciseId = key.exerciseId;
        this.filePath = resolve(key.filePath);
        const workspaceKey = digest(this.workspacePath);
        const exerciseKey = digest(this.exerciseId);
        this.recoveryFilePath = join(stateHome(env, home, platform), 'codojo', 'recovery', workspaceKey, `${exerciseKey}.json`);
    }
    async open(starterCode) {
        let code;
        try {
            code = await readFile(this.filePath, 'utf8');
        }
        catch (error) {
            if (!hasCode(error, 'ENOENT'))
                throw error;
            const recovery = await this.inspectRecovery();
            if (recovery)
                return { code: starterCode, recovery };
            await atomicWriteFile(this.filePath, starterCode);
            code = starterCode;
        }
        return { code, recovery: await this.inspectRecovery() };
    }
    save(code) {
        const operation = this.saveQueue.catch(() => undefined).then(() => this.saveNow(code));
        this.saveQueue = operation;
        return operation;
    }
    async saveNow(code) {
        await this.preserveRecovery(code);
        await atomicWriteFile(this.filePath, code);
        await this.ignoreRecovery();
    }
    async preserveRecovery(code) {
        const record = {
            version: 1,
            workspacePath: this.workspacePath,
            exerciseId: this.exerciseId,
            code,
            savedAt: Date.now(),
        };
        await atomicWriteFile(this.recoveryFilePath, `${JSON.stringify(record)}\n`);
    }
    async inspectRecovery() {
        const recovery = await this.readRecovery();
        if (!recovery)
            return null;
        try {
            const main = await stat(this.filePath);
            const mainCode = await readFile(this.filePath, 'utf8');
            if (recovery.savedAt <= main.mtimeMs || recovery.code === mainCode)
                return null;
        }
        catch (error) {
            if (!hasCode(error, 'ENOENT'))
                throw error;
        }
        return { code: recovery.code, savedAt: recovery.savedAt };
    }
    async restoreRecovery() {
        const recovery = await this.readRecovery();
        if (!recovery)
            throw new Error('Aucune sauvegarde de récupération disponible.');
        await atomicWriteFile(this.filePath, recovery.code);
        await this.ignoreRecovery();
        return recovery.code;
    }
    async ignoreRecovery() {
        await rm(this.recoveryFilePath, { force: true });
    }
    async readRecovery() {
        try {
            const parsed = JSON.parse(await readFile(this.recoveryFilePath, 'utf8'));
            if (parsed.version !== 1 ||
                parsed.workspacePath !== this.workspacePath ||
                parsed.exerciseId !== this.exerciseId ||
                typeof parsed.code !== 'string' ||
                typeof parsed.savedAt !== 'number') {
                return null;
            }
            return parsed;
        }
        catch {
            return null;
        }
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
function hasCode(error, code) {
    return error instanceof Error && 'code' in error && error.code === code;
}
//# sourceMappingURL=editor_persistence.js.map