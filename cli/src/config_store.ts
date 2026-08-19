import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

export const DEFAULT_API_URL = 'https://codojo.ekodevs.com'

export function normalizeApiUrl(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

interface CliConfig {
  apiBaseUrl: string
  token?: string
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

  async read(): Promise<CliConfig> {
    // Try modern codojo path
    try {
      const content = await readFile(this.filePath, 'utf8')
      const parsed = JSON.parse(content) as Partial<CliConfig>
      return {
        apiBaseUrl: normalizeApiUrl(parsed.apiBaseUrl || this.defaultApiUrl),
        token: parsed.token,
      }
    } catch {
      // Fallback to legacy js-challenge config path
      try {
        const content = await readFile(this.legacyFilePath, 'utf8')
        const parsed = JSON.parse(content) as Partial<CliConfig>
        // Migrate automatically to codojo, including tokenless configuration.
        await this.save({
          apiBaseUrl: normalizeApiUrl(parsed.apiBaseUrl || this.defaultApiUrl),
          token: parsed.token,
        })
        return {
          apiBaseUrl: normalizeApiUrl(parsed.apiBaseUrl || this.defaultApiUrl),
          token: parsed.token,
        }
      } catch {
        return { apiBaseUrl: this.defaultApiUrl }
      }
    }
  }

  async save(config: CliConfig): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true, mode: 0o700 })
    await writeFile(this.filePath, `${JSON.stringify(config, null, 2)}\n`, {
      encoding: 'utf8',
      mode: 0o600,
    })
    await chmod(this.filePath, 0o600)
  }

  async setToken(token: string): Promise<void> {
    const config = await this.read()
    await this.save({ ...config, token })
  }

  async clearToken(): Promise<void> {
    const config = await this.read()
    delete config.token
    await this.save(config)
  }
}
