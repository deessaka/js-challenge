import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

import { atomicWriteFile } from './atomic_write.js'
import {
  defaultApiUrlFor,
  inferEnvironmentFromUrl,
  type EnvironmentName,
  validateApiUrl,
} from './environment.js'

export const DEFAULT_API_URL = defaultApiUrlFor('production')

export function normalizeApiUrl(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

export interface CliConfig {
  apiBaseUrl: string
  token?: string
}

export class ConfigStore {
  readonly filePath: string
  readonly legacyFilePath: string
  readonly legacyCodojoFilePath: string
  readonly defaultApiUrl: string
  readonly environment: EnvironmentName

  constructor(
    private readonly env: NodeJS.ProcessEnv = process.env,
    home = homedir(),
    environment: EnvironmentName = 'production'
  ) {
    this.environment = environment
    this.defaultApiUrl =
      environment === 'staging'
        ? this.env.CODOJO_STAGING_API_URL
          ? validateApiUrl('staging', this.env.CODOJO_STAGING_API_URL)
          : ''
        : environment === 'development'
          ? validateApiUrl(
              'development',
              this.env.CODOJO_DEV_API_URL || defaultApiUrlFor(environment)
            )
          : defaultApiUrlFor(environment)
    const configHome = this.env.XDG_CONFIG_HOME || join(home, '.config')
    const configDirectory = join(configHome, 'codojo')
    this.filePath = join(configDirectory, 'profiles', `${environment}.json`)
    this.legacyCodojoFilePath = join(configDirectory, 'config.json')
    this.legacyFilePath = join(configHome, 'js-challenge', 'config.json')
  }

  async read(): Promise<CliConfig> {
    const current = await this.readFile(this.filePath)
    if (current) return current

    const legacy = await this.readLegacyFile(this.legacyCodojoFilePath)
    if (legacy) return legacy

    const oldLegacy = await this.readLegacyFile(this.legacyFilePath)
    if (oldLegacy) return oldLegacy

    if (!this.defaultApiUrl) {
      throw new Error('Configurez un endpoint staging avant d’utiliser ce profil.')
    }
    return { apiBaseUrl: this.defaultApiUrl }
  }

  async save(config: CliConfig): Promise<void> {
    const validated = this.validateConfig(config)
    await atomicWriteFile(this.filePath, `${JSON.stringify(validated, null, 2)}\n`, 0o600)
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

  private async readFile(filePath: string): Promise<CliConfig | null> {
    try {
      const content = await readFile(filePath, 'utf8')
      return this.validateConfig(JSON.parse(content) as Partial<CliConfig>)
    } catch {
      return null
    }
  }

  private async readLegacyFile(filePath: string): Promise<CliConfig | null> {
    const legacy = await this.readFile(filePath)
    if (!legacy) return null

    const inferredEnvironment = inferEnvironmentFromUrl(legacy.apiBaseUrl)
    if (inferredEnvironment !== this.environment) {
      return null
    }

    await this.save(legacy)
    return legacy
  }

  private validateConfig(config: Partial<CliConfig>): CliConfig {
    if (typeof config.apiBaseUrl !== 'string' || !config.apiBaseUrl.trim()) {
      throw new Error('La configuration Codojo ne contient pas d’URL d’API valide.')
    }

    const apiBaseUrl = validateApiUrl(this.environment, normalizeApiUrl(config.apiBaseUrl))
    if (config.token !== undefined && (typeof config.token !== 'string' || !config.token.trim())) {
      throw new Error('La configuration Codojo contient un token invalide.')
    }

    return {
      apiBaseUrl,
      ...(config.token ? { token: config.token } : {}),
    }
  }
}
