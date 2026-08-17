import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
export class ConfigStore {
    filePath;
    constructor(env = process.env, home = homedir()) {
        const configHome = env.XDG_CONFIG_HOME || join(home, '.config');
        this.filePath = join(configHome, 'js-challenge', 'config.json');
    }
    async read() {
        try {
            const content = await readFile(this.filePath, 'utf8');
            const parsed = JSON.parse(content);
            return {
                apiBaseUrl: parsed.apiBaseUrl || 'http://localhost:3333',
                token: parsed.token,
            };
        }
        catch {
            return { apiBaseUrl: 'http://localhost:3333' };
        }
    }
    async save(config) {
        await mkdir(dirname(this.filePath), { recursive: true, mode: 0o700 });
        await writeFile(this.filePath, `${JSON.stringify(config, null, 2)}\n`, {
            encoding: 'utf8',
            mode: 0o600,
        });
        await chmod(this.filePath, 0o600);
    }
    async setToken(token) {
        const config = await this.read();
        await this.save({ ...config, token });
    }
    async clearToken() {
        const config = await this.read();
        delete config.token;
        await this.save(config);
    }
}
//# sourceMappingURL=config_store.js.map