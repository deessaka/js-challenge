import { spawnSync } from 'node:child_process'

export class EditorNotFoundError extends Error {
  constructor() {
    super(
      'Aucun éditeur trouvé. Installez Neovim ou Vim, ou définissez JSC_EDITOR, VISUAL ou EDITOR.'
    )
    this.name = 'EditorNotFoundError'
  }
}

export function resolveEditor(env: NodeJS.ProcessEnv = process.env): string {
  const configured = [env.JSC_EDITOR, env.VISUAL, env.EDITOR].find((value) => value?.trim())
  if (configured) return configured.trim()

  for (const candidate of ['nvim', 'vim', 'vi']) {
    const result = spawnSync('sh', ['-c', `command -v ${candidate}`], { encoding: 'utf8' })
    if (result.status === 0 && result.stdout.trim()) return candidate
  }

  throw new EditorNotFoundError()
}

export function openEditor(filePath: string, env: NodeJS.ProcessEnv = process.env): void {
  const command = resolveEditor(env)
  const result = spawnSync(command, [filePath], { stdio: 'inherit', shell: false })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`L’éditeur « ${command} » s’est fermé avec le code ${result.status ?? 1}.`)
  }
}
