import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

export const DEFAULT_API_URL = 'https://codojo.ekodevs.com'

export function normalizeApiUrl(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

interface StoredConfig {
  apiBaseUrl?: string
  tokens?: Record<string, string>
  /** Legacy single-target shape, migrated into `tokens` on read. */
  token?: string
}

export interface ResolvedConfig {
  /** The persisted *default* target — never mutated by an env-var override. */
  apiBaseUrl: string
  /** Access tokens keyed by normalized API base URL, one per environment. */
  tokens: Record<string, string>
}

export class ConfigStore {
  readonly filePath: string
  readonly legacyFilePath: string
  readonly defaultApiUrl: string

  constructor(env: NodeJS.ProcessEnv = process.env, home = homedir()) {
    this.defaultApiUrl = normalizeApiUrl(
      env.CODOJO_API_URL || env.JS_CHALLENGE_API_URL || DEFAULT_API_URL
    )
    const configHome = env.XDG_CONFIG_HOME || join(home, '.config')
    this.filePath = join(configHome, 'codojo', 'config.json')
    this.legacyFilePath = join(configHome, 'js-challenge', 'config.json')
  }

  async read(): Promise<ResolvedConfig> {
    const raw = await this.#readRaw()
    return this.#normalize(raw)
  }

  async #readRaw(): Promise<StoredConfig | null> {
    try {
      const content = await readFile(this.filePath, 'utf8')
      return JSON.parse(content) as StoredConfig
    } catch {
      // Fallback to legacy js-challenge config path
      try {
        const content = await readFile(this.legacyFilePath, 'utf8')
        const parsed = JSON.parse(content) as StoredConfig
        // Migrate automatically to codojo, including tokenless configuration.
        await this.save(parsed)
        return parsed
      } catch {
        return null
      }
    }
  }

  /**
   * Normalizes whatever is on disk into the multi-target shape. A legacy
   * `{ apiBaseUrl, token }` record is treated as a token scoped to that one
   * `apiBaseUrl` — never as a global token usable against any target.
   */
  #normalize(raw: StoredConfig | null): ResolvedConfig {
    const apiBaseUrl = normalizeApiUrl(raw?.apiBaseUrl || this.defaultApiUrl)
    const tokens: Record<string, string> = { ...(raw?.tokens || {}) }
    if (raw?.token && raw?.apiBaseUrl) {
      const legacyKey = normalizeApiUrl(raw.apiBaseUrl)
      if (!tokens[legacyKey]) tokens[legacyKey] = raw.token
    }
    return { apiBaseUrl, tokens }
  }

  async save(config: StoredConfig): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true, mode: 0o700 })
    await writeFile(this.filePath, `${JSON.stringify(config, null, 2)}\n`, {
      encoding: 'utf8',
      mode: 0o600,
    })
    await chmod(this.filePath, 0o600)
  }

  /**
   * Persists the token for a single API target only. Logging in against a
   * non-default target (a local/staging server) never touches credentials
   * stored for any other target, so switching environments can't corrupt an
   * already-working installation pointed at production.
   */
  async setToken(apiBaseUrl: string, token: string): Promise<void> {
    const normalized = normalizeApiUrl(apiBaseUrl)
    const resolved = await this.read()
    const tokens = { ...resolved.tokens, [normalized]: token }
    await this.save({ apiBaseUrl: resolved.apiBaseUrl, tokens })
  }

  /** Clears the token for a single API target only. */
  async clearToken(apiBaseUrl: string): Promise<void> {
    const normalized = normalizeApiUrl(apiBaseUrl)
    const resolved = await this.read()
    const tokens = { ...resolved.tokens }
    delete tokens[normalized]
    await this.save({ apiBaseUrl: resolved.apiBaseUrl, tokens })
  }

  /**
   * Sets the default target used when no `--api-url` flag and no
   * `CODOJO_API_URL` / `JS_CHALLENGE_API_URL` env var is present. Only call
   * this in response to an *explicit* user action (e.g. an explicit
   * `--api-url` flag) — never as a side effect of an env-var override, or a
   * one-off dev/staging session would silently redirect every future
   * invocation of the stable, globally-installed CLI.
   */
  async setDefaultApiUrl(apiBaseUrl: string): Promise<void> {
    const resolved = await this.read()
    await this.save({ apiBaseUrl: normalizeApiUrl(apiBaseUrl), tokens: resolved.tokens })
  }
}
