import { createHash } from 'node:crypto'
import { readFile, rm, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

import { atomicWriteFile } from './atomic_write.js'

interface EditorPersistenceKey {
  workspacePath: string
  exerciseId: string
  filePath: string
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

export interface RecoveryCandidate {
  code: string
  savedAt: number
}

export interface OpenedEditorDocument {
  code: string
  recovery: RecoveryCandidate | null
}

export class EditorPersistence {
  readonly filePath: string
  readonly recoveryFilePath: string
  readonly workspacePath: string
  readonly exerciseId: string
  private saveQueue: Promise<void> = Promise.resolve()

  constructor(key: EditorPersistenceKey, options: EditorPersistenceOptions = {}) {
    const env = options.env ?? process.env
    const home = options.home ?? homedir()
    const platform = options.platform ?? process.platform
    this.workspacePath = resolve(key.workspacePath)
    this.exerciseId = key.exerciseId
    this.filePath = resolve(key.filePath)
    const workspaceKey = digest(this.workspacePath)
    const exerciseKey = digest(this.exerciseId)
    this.recoveryFilePath = join(
      stateHome(env, home, platform),
      'codojo',
      'recovery',
      workspaceKey,
      `${exerciseKey}.json`
    )
  }

  async open(starterCode: string): Promise<OpenedEditorDocument> {
    let code: string
    try {
      code = await readFile(this.filePath, 'utf8')
    } catch (error) {
      if (!hasCode(error, 'ENOENT')) throw error
      const recovery = await this.inspectRecovery()
      if (recovery) return { code: starterCode, recovery }
      await atomicWriteFile(this.filePath, starterCode)
      code = starterCode
    }

    return { code, recovery: await this.inspectRecovery() }
  }

  save(code: string): Promise<void> {
    const operation = this.saveQueue.catch(() => undefined).then(() => this.saveNow(code))
    this.saveQueue = operation
    return operation
  }

  private async saveNow(code: string): Promise<void> {
    await this.preserveRecovery(code)
    await atomicWriteFile(this.filePath, code)
    await this.ignoreRecovery()
  }

  async preserveRecovery(code: string): Promise<void> {
    const record: RecoveryRecord = {
      version: 1,
      workspacePath: this.workspacePath,
      exerciseId: this.exerciseId,
      code,
      savedAt: Date.now(),
    }
    await atomicWriteFile(this.recoveryFilePath, `${JSON.stringify(record)}\n`)
  }

  async inspectRecovery(): Promise<RecoveryCandidate | null> {
    const recovery = await this.readRecovery()
    if (!recovery) return null

    try {
      const main = await stat(this.filePath)
      const mainCode = await readFile(this.filePath, 'utf8')
      if (recovery.savedAt <= main.mtimeMs || recovery.code === mainCode) return null
    } catch (error) {
      if (!hasCode(error, 'ENOENT')) throw error
    }

    return { code: recovery.code, savedAt: recovery.savedAt }
  }

  async restoreRecovery(): Promise<string> {
    const recovery = await this.readRecovery()
    if (!recovery) throw new Error('Aucune sauvegarde de récupération disponible.')
    await atomicWriteFile(this.filePath, recovery.code)
    await this.ignoreRecovery()
    return recovery.code
  }

  async ignoreRecovery(): Promise<void> {
    await rm(this.recoveryFilePath, { force: true })
  }

  private async readRecovery(): Promise<RecoveryRecord | null> {
    try {
      const parsed = JSON.parse(
        await readFile(this.recoveryFilePath, 'utf8')
      ) as Partial<RecoveryRecord>
      if (
        parsed.version !== 1 ||
        parsed.workspacePath !== this.workspacePath ||
        parsed.exerciseId !== this.exerciseId ||
        typeof parsed.code !== 'string' ||
        typeof parsed.savedAt !== 'number'
      ) {
        return null
      }
      return parsed as RecoveryRecord
    } catch {
      return null
    }
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
