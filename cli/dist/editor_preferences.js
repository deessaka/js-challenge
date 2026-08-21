import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { atomicWriteFile } from './atomic_write.js';
const DEFAULT_EDITOR_PREFERENCES = {
    alternateScreen: true,
    autoPairs: false,
};
export class EditorPreferencesStore {
    filePath;
    constructor(env = process.env, home = homedir()) {
        const configHome = env.XDG_CONFIG_HOME || join(home, '.config');
        this.filePath = join(configHome, 'codojo', 'editor-preferences.json');
    }
    async read() {
        try {
            const parsed = JSON.parse(await readFile(this.filePath, 'utf8'));
            return {
                alternateScreen: typeof parsed.alternateScreen === 'boolean'
                    ? parsed.alternateScreen
                    : DEFAULT_EDITOR_PREFERENCES.alternateScreen,
                autoPairs: typeof parsed.autoPairs === 'boolean'
                    ? parsed.autoPairs
                    : DEFAULT_EDITOR_PREFERENCES.autoPairs,
            };
        }
        catch {
            return { ...DEFAULT_EDITOR_PREFERENCES };
        }
    }
    async save(preferences) {
        await atomicWriteFile(this.filePath, `${JSON.stringify(preferences, null, 2)}\n`);
    }
}
//# sourceMappingURL=editor_preferences.js.map