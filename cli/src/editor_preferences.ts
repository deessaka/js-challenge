import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

import { atomicWriteFile } from './atomic_write.js'

export interface EditorPreferences {
  alternateScreen: boolean
  autoPairs: boolean
}

const DEFAULT_EDITOR_PREFERENCES: EditorPreferences = {
  alternateScreen: true,
  autoPairs: false,
}

export class EditorPreferencesStore {
  readonly filePath: string

  constructor(env: NodeJS.ProcessEnv = process.env, home = homedir()) {
    const configHome = env.XDG_CONFIG_HOME || join(home, '.config')
    this.filePath = join(configHome, 'codojo', 'editor-preferences.json')
  }

  async read(): Promise<EditorPreferences> {
    try {
      const parsed = JSON.parse(await readFile(this.filePath, 'utf8')) as Partial<EditorPreferences>
      return {
        alternateScreen:
          typeof parsed.alternateScreen === 'boolean'
            ? parsed.alternateScreen
            : DEFAULT_EDITOR_PREFERENCES.alternateScreen,
        autoPairs:
          typeof parsed.autoPairs === 'boolean'
            ? parsed.autoPairs
            : DEFAULT_EDITOR_PREFERENCES.autoPairs,
      }
    } catch {
      return { ...DEFAULT_EDITOR_PREFERENCES }
    }
  }

  async save(preferences: EditorPreferences): Promise<void> {
    await atomicWriteFile(this.filePath, `${JSON.stringify(preferences, null, 2)}\n`)
  }
}
