import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { atomicWriteFile } from './atomic_write.js';
import { defaultApiUrlFor, inferEnvironmentFromUrl, validateApiUrl, } from './environment.js';
export const DEFAULT_API_URL = defaultApiUrlFor('production');
export function normalizeApiUrl(value) {
    return value.trim().replace(/\/+$/, '');
}
export class ConfigStore {
    env;
    filePath;
    legacyFilePath;
    legacyCodojoFilePath;
    defaultApiUrl;
    environment;
    constructor(env = process.env, home = homedir(), environment = 'production') {
        this.env = env;
        this.environment = environment;
        this.defaultApiUrl =
            environment === 'staging'
                ? this.env.CODOJO_STAGING_API_URL
                    ? validateApiUrl('staging', this.env.CODOJO_STAGING_API_URL)
                    : ''
                : environment === 'development'
                    ? validateApiUrl('development', this.env.CODOJO_DEV_API_URL || defaultApiUrlFor(environment))
                    : defaultApiUrlFor(environment);
        const configHome = this.env.XDG_CONFIG_HOME || join(home, '.config');
        const configDirectory = join(configHome, 'codojo');
        this.filePath = join(configDirectory, 'profiles', `${environment}.json`);
        this.legacyCodojoFilePath = join(configDirectory, 'config.json');
        this.legacyFilePath = join(configHome, 'js-challenge', 'config.json');
    }
    async read() {
        const current = await this.readFile(this.filePath);
        if (current)
            return current;
        const legacy = await this.readLegacyFile(this.legacyCodojoFilePath);
        if (legacy)
            return legacy;
        const oldLegacy = await this.readLegacyFile(this.legacyFilePath);
        if (oldLegacy)
            return oldLegacy;
        if (!this.defaultApiUrl) {
            throw new Error('Configurez un endpoint staging avant d’utiliser ce profil.');
        }
        return { apiBaseUrl: this.defaultApiUrl };
    }
    async save(config) {
        const validated = this.validateConfig(config);
        await atomicWriteFile(this.filePath, `${JSON.stringify(validated, null, 2)}\n`, 0o600);
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
    async readFile(filePath) {
        try {
            const content = await readFile(filePath, 'utf8');
            return this.validateConfig(JSON.parse(content));
        }
        catch {
            return null;
        }
    }
    async readLegacyFile(filePath) {
        const legacy = await this.readFile(filePath);
        if (!legacy)
            return null;
        const inferredEnvironment = inferEnvironmentFromUrl(legacy.apiBaseUrl);
        if (inferredEnvironment !== this.environment) {
            return null;
        }
        await this.save(legacy);
        return legacy;
    }
    validateConfig(config) {
        if (typeof config.apiBaseUrl !== 'string' || !config.apiBaseUrl.trim()) {
            throw new Error('La configuration Codojo ne contient pas d’URL d’API valide.');
        }
        const apiBaseUrl = validateApiUrl(this.environment, normalizeApiUrl(config.apiBaseUrl));
        if (config.token !== undefined && (typeof config.token !== 'string' || !config.token.trim())) {
            throw new Error('La configuration Codojo contient un token invalide.');
        }
        return {
            apiBaseUrl,
            ...(config.token ? { token: config.token } : {}),
        };
    }
}
//# sourceMappingURL=config_store.js.map