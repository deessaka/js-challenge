import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import { atomicWriteFile } from './atomic_write.js'
import { DEFAULT_API_URL, normalizeApiUrl } from './config_store.js'

interface EditorPersistenceKey {
  slug: string
  /** Keep local drafts isolated when the CLI targets dev or staging. */
  apiBaseUrl?: string
  legacyWorkspacePath?: string
  legacyExerciseId?: string
}

interface EditorPersistenceOptions {
  env?: NodeJS.ProcessEnv
  home?: string
  platform?: NodeJS.Platform
}

interface RecoveryRecord {
  version: 1
  workspacePath: string
  exerciseId: string
  code: string
  savedAt: number
}

export interface OpenedEditorDocument {
  code: string
}

interface SeedRecord {
  version: 1
  seededStarterCodeHash: string
}

export class EditorPersistence {
  readonly virtualFilePath: string
  /** Tracks the starter code a draft was seeded from, to detect untouched drafts left stale by a contract update. */
  readonly seedFilePath: string
  readonly slug: string

  // Legacy paths for migration
  private readonly legacyWorkspacePath?: string
  private readonly legacyExerciseId?: string
  private readonly legacyFilePath?: string
  private readonly legacyRecoveryFilePath?: string

  private saveQueue: Promise<void> = Promise.resolve()

  constructor(key: EditorPersistenceKey, options: EditorPersistenceOptions = {}) {
    const env = options.env ?? process.env
    const home = options.home ?? homedir()
    const platform = options.platform ?? process.platform
    
    this.slug = key.slug
    const normalizedApiBaseUrl = normalizeApiUrl(key.apiBaseUrl || DEFAULT_API_URL)
    const targetFolder =
      normalizedApiBaseUrl === DEFAULT_API_URL ? [] : [digest(normalizedApiBaseUrl)]
    this.virtualFilePath = join(
      stateHome(env, home, platform),
      'codojo',
      'exercises',
      ...targetFolder,
      `${this.slug}.js`
    )
    this.seedFilePath = join(dirname(this.virtualFilePath), `${this.slug}.seed.json`)

    if (key.legacyWorkspacePath && key.legacyExerciseId) {
      this.legacyWorkspacePath = resolve(key.legacyWorkspacePath)
      this.legacyExerciseId = key.legacyExerciseId
      this.legacyFilePath = resolve(this.legacyWorkspacePath, `${this.slug}.js`)
      
      const workspaceKey = digest(this.legacyWorkspacePath)
      const exerciseKey = digest(this.legacyExerciseId)
      this.legacyRecoveryFilePath = join(
        stateHome(env, home, platform),
        'codojo',
        'recovery',
        workspaceKey,
        `${exerciseKey}.json`
      )
    }
  }

  async open(starterCode: string): Promise<OpenedEditorDocument> {
    try {
      const code = await readFile(this.virtualFilePath, 'utf8')
      return await this.reconcileWithStarterCode(code, starterCode)
    } catch (error) {
      if (!hasCode(error, 'ENOENT')) throw error

      // Virtual document doesn't exist, try non-destructive migration
      const migratedCode = await this.migrateLegacyData()
      const initialCode = migratedCode !== null ? migratedCode : starterCode

      await atomicWriteFile(this.virtualFilePath, initialCode)
      await this.writeSeed(initialCode)
      return { code: initialCode }
    }
  }

  save(code: string): Promise<void> {
    const operation = this.saveQueue.catch(() => undefined).then(() => atomicWriteFile(this.virtualFilePath, code))
    this.saveQueue = operation
    return operation
  }

  /**
   * A saved draft can go stale when the exercise's starter code changes server-side (e.g. a
   * contract republish). We can only tell "untouched starter code" apart from "the learner's
   * work" by comparing the draft against the hash it was seeded with, so an unmodified draft is
   * safely refreshed while any real edit is always left alone.
   */
  private async reconcileWithStarterCode(
    savedCode: string,
    starterCode: string
  ): Promise<OpenedEditorDocument> {
    const seededHash = await this.readSeedHash()
    if (seededHash === null) {
      // No seed record (drafts created before this existed, or migrated from a legacy path).
      // We can't tell an edited draft from a starter template that just happens to be stale, so
      // never auto-refresh here. Only bootstrap a seed when the draft already matches the
      // current starter code exactly — that's a safe baseline, not a guess.
      if (savedCode === starterCode) await this.writeSeed(starterCode)
      return { code: savedCode }
    }

    if (seededHash === contentHash(savedCode) && savedCode !== starterCode) {
      await atomicWriteFile(this.virtualFilePath, starterCode)
      await this.writeSeed(starterCode)
      return { code: starterCode }
    }

    return { code: savedCode }
  }

  private async readSeedHash(): Promise<string | null> {
    try {
      const parsed = JSON.parse(await readFile(this.seedFilePath, 'utf8')) as Partial<SeedRecord>
      return typeof parsed.seededStarterCodeHash === 'string' ? parsed.seededStarterCodeHash : null
    } catch (error) {
      if (!hasCode(error, 'ENOENT')) throw error
      return null
    }
  }

  private async writeSeed(code: string): Promise<void> {
    const record: SeedRecord = { version: 1, seededStarterCodeHash: contentHash(code) }
    await atomicWriteFile(this.seedFilePath, JSON.stringify(record))
  }

  private async migrateLegacyData(): Promise<string | null> {
    if (!this.legacyFilePath || !this.legacyRecoveryFilePath || !this.legacyWorkspacePath || !this.legacyExerciseId) {
      return null
    }

    let legacyMainCode: string | null = null
    let legacyMainMtime = 0
    try {
      const mainStat = await stat(this.legacyFilePath)
      legacyMainCode = await readFile(this.legacyFilePath, 'utf8')
      legacyMainMtime = mainStat.mtimeMs
    } catch (error) {
      if (!hasCode(error, 'ENOENT')) throw error
    }

    let recoveryCode: string | null = null
    let recoverySavedAt = 0
    try {
      const parsed = JSON.parse(
        await readFile(this.legacyRecoveryFilePath, 'utf8')
      ) as Partial<RecoveryRecord>
      
      if (
        parsed.version === 1 &&
        parsed.workspacePath === this.legacyWorkspacePath &&
        parsed.exerciseId === this.legacyExerciseId &&
        typeof parsed.code === 'string' &&
        typeof parsed.savedAt === 'number'
      ) {
        recoveryCode = parsed.code
        recoverySavedAt = parsed.savedAt
      }
    } catch (error) {
      if (!hasCode(error, 'ENOENT')) throw error
    }

    // Pick the most recent one
    if (recoveryCode !== null && legacyMainCode !== null) {
      return recoverySavedAt > legacyMainMtime ? recoveryCode : legacyMainCode
    }
    if (recoveryCode !== null) return recoveryCode
    if (legacyMainCode !== null) return legacyMainCode

    return null
  }
}

function stateHome(env: NodeJS.ProcessEnv, home: string, platform: NodeJS.Platform): string {
  if (env.XDG_STATE_HOME) return env.XDG_STATE_HOME
  if (platform === 'darwin') return join(home, 'Library', 'Application Support')
  if (platform === 'win32') {
    return env.LOCALAPPDATA || env.APPDATA || join(home, 'AppData', 'Local')
  }
  return join(home, '.local', 'state')
}

function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 24)
}

function contentHash(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function hasCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code
}
