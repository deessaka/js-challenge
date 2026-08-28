import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
export const PACKAGE_NAME = '@codojo/cli';
export const DEFAULT_REGISTRY = 'https://registry.npmjs.org';
export const UPDATE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
export const UPDATE_CHECK_TIMEOUT_MS = 1500;
export function isUpdateCheckDisabled(env = process.env) {
    return (env.CI === 'true' ||
        env.CI === '1' ||
        env.CODOJO_NO_UPDATE_CHECK === '1' ||
        env.CODOJO_NO_UPDATE_CHECK === 'true' ||
        env.NO_UPDATE_NOTIFIER === '1' ||
        env.NO_UPDATE_NOTIFIER === 'true');
}
export function resolveRegistry(env = process.env) {
    const configured = env.npm_config_registry || env.NPM_CONFIG_REGISTRY;
    return (configured || DEFAULT_REGISTRY).replace(/\/+$/, '');
}
export function getUpdateCachePath(env = process.env, cachePath) {
    if (cachePath)
        return cachePath;
    const cacheHome = env.XDG_CACHE_HOME || join(homedir(), '.cache');
    return join(cacheHome, 'codojo', 'update-check.json');
}
export function isNewerVersion(currentVersion, candidateVersion) {
    const current = parseVersion(currentVersion);
    const candidate = parseVersion(candidateVersion);
    if (!current || !candidate)
        return false;
    for (const key of ['major', 'minor', 'patch']) {
        if (current[key] !== candidate[key])
            return candidate[key] > current[key];
    }
    if (!current.preRelease && !candidate.preRelease)
        return false;
    if (!current.preRelease)
        return false;
    if (!candidate.preRelease)
        return true;
    const length = Math.max(current.preRelease.length, candidate.preRelease.length);
    for (let index = 0; index < length; index += 1) {
        const currentIdentifier = current.preRelease[index];
        const candidateIdentifier = candidate.preRelease[index];
        if (currentIdentifier === undefined)
            return true;
        if (candidateIdentifier === undefined)
            return false;
        if (currentIdentifier === candidateIdentifier)
            continue;
        const currentNumber = numericIdentifier(currentIdentifier);
        const candidateNumber = numericIdentifier(candidateIdentifier);
        if (currentNumber !== null && candidateNumber !== null) {
            return candidateNumber > currentNumber;
        }
        if (currentNumber !== null)
            return true;
        if (candidateNumber !== null)
            return false;
        return candidateIdentifier > currentIdentifier;
    }
    return false;
}
export async function getCachedUpdateInfo(currentVersion, tag = 'latest', options = {}) {
    const env = options.env || process.env;
    const now = options.now || Date.now;
    const cached = await readCache(getUpdateCachePath(env, options.cachePath));
    if (!cached ||
        cached.tag !== tag ||
        now() - cached.checkedAt >= UPDATE_CACHE_TTL_MS ||
        !cached.latestVersion ||
        !isNewerVersion(currentVersion, cached.latestVersion)) {
        return null;
    }
    return { currentVersion, latestVersion: cached.latestVersion, tag };
}
export async function getUpdateInfo(currentVersion, tag = 'latest', options = {}) {
    const env = options.env || process.env;
    const now = options.now || Date.now;
    const cachePath = getUpdateCachePath(env, options.cachePath);
    const cached = await readCache(cachePath);
    if (cached && cached.tag === tag && now() - cached.checkedAt < UPDATE_CACHE_TTL_MS) {
        return cached.latestVersion
            ? { currentVersion, latestVersion: cached.latestVersion, tag }
            : null;
    }
    const latestVersion = await fetchTaggedVersion(tag, options);
    await writeCache(cachePath, {
        checkedAt: now(),
        tag,
        latestVersion,
    });
    return latestVersion ? { currentVersion, latestVersion, tag } : null;
}
export async function notifyIfUpdateAvailable(currentVersion, options = {}) {
    if (isUpdateCheckDisabled(options.env || process.env))
        return;
    try {
        const update = await getUpdateInfo(currentVersion, 'latest', options);
        if (!update || !isNewerVersion(update.currentVersion, update.latestVersion))
            return;
        console.error(`📦 Une nouvelle version de Codojo est disponible : ${update.currentVersion} → ${update.latestVersion}`);
        console.error('   Lancez `codojo update` pour mettre à jour.');
    }
    catch {
        // An update check must never interfere with the primary CLI command.
    }
}
async function fetchTaggedVersion(tag, options) {
    const fetcher = options.fetcher || fetch;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? UPDATE_CHECK_TIMEOUT_MS);
    try {
        const packagePath = encodeURIComponent(PACKAGE_NAME).replace(/%2F/gi, '%2f');
        const response = await fetcher(`${resolveRegistry(options.env || process.env)}/${packagePath}`, {
            headers: { Accept: 'application/vnd.npm.install-v1+json' },
            signal: controller.signal,
        });
        if (!response.ok)
            return null;
        const metadata = (await response.json());
        const version = metadata['dist-tags']?.[tag];
        return typeof version === 'string' && parseVersion(version) ? version : null;
    }
    catch {
        return null;
    }
    finally {
        clearTimeout(timeout);
    }
}
async function readCache(cachePath) {
    try {
        const value = JSON.parse(await readFile(cachePath, 'utf8'));
        if (typeof value.checkedAt !== 'number' ||
            typeof value.tag !== 'string' ||
            (value.latestVersion !== null && typeof value.latestVersion !== 'string')) {
            return null;
        }
        return value;
    }
    catch {
        return null;
    }
}
async function writeCache(cachePath, cache) {
    try {
        await mkdir(dirname(cachePath), { recursive: true });
        await writeFile(cachePath, `${JSON.stringify(cache)}\n`, 'utf8');
    }
    catch {
        // A read-only cache must not affect the CLI.
    }
}
function parseVersion(value) {
    const match = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.exec(value);
    if (!match)
        return null;
    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
        preRelease: match[4] ? match[4].split('.') : null,
    };
}
function numericIdentifier(value) {
    return /^(0|[1-9]\d*)$/.test(value) ? Number(value) : null;
}
//# sourceMappingURL=update_service.js.map