import { randomUUID } from 'node:crypto'
import { chmod, mkdir, open, rename, rm } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'

export async function atomicWriteFile(
  filePath: string,
  content: string,
  mode = 0o600
): Promise<void> {
  const directory = dirname(filePath)
  const temporaryPath = join(directory, `.${basename(filePath)}.${process.pid}.${randomUUID()}.tmp`)

  await mkdir(directory, { recursive: true, mode: 0o700 })

  let handle
  try {
    handle = await open(temporaryPath, 'wx', mode)
    await handle.writeFile(content, { encoding: 'utf8' })
    await handle.sync()
    await handle.close()
    handle = undefined
    await rename(temporaryPath, filePath)
    await chmod(filePath, mode)
    await syncDirectory(directory)
  } catch (error) {
    await handle?.close().catch(() => undefined)
    await rm(temporaryPath, { force: true }).catch(() => undefined)
    throw error
  }
}

async function syncDirectory(directory: string): Promise<void> {
  try {
    const handle = await open(directory, 'r')
    try {
      await handle.sync()
    } finally {
      await handle.close()
    }
  } catch (error) {
    if (!isUnsupportedDirectorySync(error)) throw error
  }
}

function isUnsupportedDirectorySync(error: unknown): boolean {
  if (!(error instanceof Error) || !('code' in error)) return false
  return ['EACCES', 'EISDIR', 'EINVAL', 'ENOTSUP', 'EPERM'].includes(String(error.code))
}
