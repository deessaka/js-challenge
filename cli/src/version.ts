import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

interface PackageManifest {
  version?: string
}

function readPackageVersion(): string {
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    const pkgPath = join(here, '..', 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as PackageManifest
    return pkg.version || '0.0.0'
  } catch {
    return '0.0.0'
  }
}

/** Single source of truth for the CLI's version — read from package.json so
 * it can never drift from what actually shipped, unlike a hardcoded string. */
export const VERSION = readPackageVersion()
