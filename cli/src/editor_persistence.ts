import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

import { atomicWriteFile } from './atomic_write.js'

interface EditorPersistenceKey {
  slug: string
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

export class EditorPersistence {
  readonly virtualFilePath: string
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
    this.virtualFilePath = join(
      stateHome(env, home, platform),
      'codojo',
      'exercises',
      `${this.slug}.js`
    )

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
      return { code }
    } catch (error) {
      if (!hasCode(error, 'ENOENT')) throw error
      
      // Virtual document doesn't exist, try non-destructive migration
      const migratedCode = await this.migrateLegacyData()
      const initialCode = migratedCode !== null ? migratedCode : starterCode
      
      await atomicWriteFile(this.virtualFilePath, initialCode)
      return { code: initialCode }
    }
  }

  save(code: string): Promise<void> {
    const operation = this.saveQueue.catch(() => undefined).then(() => atomicWriteFile(this.virtualFilePath, code))
    this.saveQueue = operation
    return operation
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

function hasCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code
}
