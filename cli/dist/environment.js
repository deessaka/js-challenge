export const DEFAULT_ENVIRONMENT = 'production';
export const DEFAULT_PRODUCTION_API_URL = 'https://codojo.ekodevs.com';
export const DEFAULT_DEVELOPMENT_API_URL = 'http://localhost:3333';
export class EnvironmentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EnvironmentError';
    }
}
export function parseEnvironment(value) {
    if (value === undefined || value === null || value === '')
        return undefined;
    const normalized = String(value).trim().toLowerCase();
    if (normalized === 'production' || normalized === 'prod' || normalized === 'live') {
        return 'production';
    }
    if (normalized === 'development' || normalized === 'dev' || normalized === 'local') {
        return 'development';
    }
    if (normalized === 'staging' || normalized === 'stage' || normalized === 'preview') {
        return 'staging';
    }
    throw new EnvironmentError(`Environnement inconnu : ${String(value)}. Utilisez production, development ou staging.`);
}
export function normalizeApiUrl(value) {
    return value.trim().replace(/\/+$/, '');
}
export function isLoopbackHost(hostname) {
    const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '');
    return normalized === 'localhost' || normalized === '127.0.0.1' || normalized === '::1';
}
export function inferEnvironmentFromUrl(value) {
    const url = parseApiUrl(value);
    if (url.protocol === 'https:' && url.hostname === 'codojo.ekodevs.com') {
        return 'production';
    }
    if (isLoopbackHost(url.hostname))
        return 'development';
    return undefined;
}
export function validateApiUrl(environment, value) {
    const normalized = normalizeApiUrl(value);
    const url = parseApiUrl(normalized);
    if (url.username || url.password) {
        throw new EnvironmentError('Les identifiants sont interdits dans l’URL de l’API.');
    }
    if (url.search || url.hash) {
        throw new EnvironmentError('Les paramètres et fragments sont interdits dans l’URL de l’API.');
    }
    if (environment === 'production') {
        if (url.protocol !== 'https:' || url.hostname !== 'codojo.ekodevs.com') {
            throw new EnvironmentError('L’environnement production exige exactement https://codojo.ekodevs.com.');
        }
    }
    else if (environment === 'development') {
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            throw new EnvironmentError('L’environnement development exige une URL HTTP(S).');
        }
        if (!isLoopbackHost(url.hostname)) {
            throw new EnvironmentError('L’environnement development est limité à localhost, 127.0.0.1 ou ::1.');
        }
    }
    else if (url.protocol !== 'https:') {
        throw new EnvironmentError('L’environnement staging exige une URL HTTPS.');
    }
    return normalized;
}
export function resolveEnvironment(options = {}) {
    const env = options.env || process.env;
    const explicitEnvironment = parseEnvironment(options.requestedEnvironment ?? env.CODOJO_ENV);
    const explicitApiUrl = firstString(options.explicitApiUrl, env.CODOJO_API_URL, env.JS_CHALLENGE_API_URL);
    let environment = explicitEnvironment;
    if (!environment && explicitApiUrl) {
        const inferred = inferEnvironmentFromUrl(explicitApiUrl);
        if (!inferred) {
            throw new EnvironmentError('Un endpoint personnalisé exige un environnement explicite avec CODOJO_ENV ou --environment.');
        }
        if (env.CODOJO_API_URL || env.JS_CHALLENGE_API_URL) {
            throw new EnvironmentError(`L’override ${inferred} doit être confirmé avec CODOJO_ENV=${inferred}.`);
        }
        environment = inferred;
    }
    environment ||= DEFAULT_ENVIRONMENT;
    const environmentVariableUrl = environment === 'development'
        ? env.CODOJO_DEV_API_URL
        : environment === 'staging'
            ? env.CODOJO_STAGING_API_URL
            : undefined;
    const candidateUrl = firstString(explicitApiUrl, environmentVariableUrl, options.persistedApiUrl);
    const source = explicitApiUrl || environmentVariableUrl
        ? 'explicit'
        : options.persistedApiUrl
            ? 'profile'
            : 'default';
    const apiBaseUrl = candidateUrl || defaultApiUrlFor(environment);
    return {
        environment,
        apiBaseUrl: validateApiUrl(environment, apiBaseUrl),
        source,
    };
}
export function defaultApiUrlFor(environment) {
    if (environment === 'production')
        return DEFAULT_PRODUCTION_API_URL;
    if (environment === 'development')
        return DEFAULT_DEVELOPMENT_API_URL;
    throw new EnvironmentError('Aucun endpoint staging par défaut n’est autorisé. Configurez CODOJO_STAGING_API_URL.');
}
function firstString(...values) {
    for (const value of values) {
        if (typeof value === 'string' && value.trim())
            return value;
    }
    return undefined;
}
function parseApiUrl(value) {
    let url;
    try {
        url = new URL(normalizeApiUrl(value));
    }
    catch {
        throw new EnvironmentError('L’URL de l’API est invalide.');
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new EnvironmentError('Seuls les schémas HTTP et HTTPS sont autorisés.');
    }
    if (!url.hostname)
        throw new EnvironmentError('L’URL de l’API doit contenir un host.');
    return url;
}
//# sourceMappingURL=environment.js.map