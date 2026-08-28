import { request } from 'node:https'
import { join } from 'node:path'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import semver from 'semver'

export const PACKAGE_NAME = '@codojo/cli'

export interface UpdateInfo {
  hasUpdate: boolean
  current: string
  latest: string
  tag: string
}

interface NpmResponse {
  'dist-tags': Record<string, string>
}

interface CacheData {
  lastCheck: number
  latestVersion: string
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 // 24 hours
const REQUEST_TIMEOUT_MS = 2000

function getCachePath(): string {
  return join(homedir(), '.config', 'codojo', 'update-cache.json')
}

async function readCache(): Promise<CacheData | null> {
  try {
    const data = await readFile(getCachePath(), 'utf8')
    return JSON.parse(data) as CacheData
  } catch {
    return null
  }
}

async function writeCache(data: CacheData): Promise<void> {
  try {
    const cachePath = getCachePath()
    await mkdir(join(homedir(), '.config', 'codojo'), { recursive: true })
    await writeFile(cachePath, JSON.stringify(data), 'utf8')
  } catch {
    // Ignore cache write errors
  }
}

async function fetchNpmTags(): Promise<Record<string, string> | null> {
  return new Promise((resolve) => {
    // Note: We use the public NPM registry directly here for speed and to avoid 
    // the 3+ second overhead of spawning an `npm view` process in the background.
    // If the user uses a mirror, this background check will just fail silently.
    const req = request(`https://registry.npmjs.org/${PACKAGE_NAME}`, {
      method: 'GET',
      headers: { accept: 'application/vnd.npm.install-v1+json' },
      timeout: REQUEST_TIMEOUT_MS
    }, (res) => {
      if (res.statusCode !== 200) {
        res.resume()
        return resolve(null)
      }
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData) as NpmResponse
          resolve(parsed['dist-tags'] || null)
        } catch {
          resolve(null)
        }
      })
    })

    req.on('timeout', () => {
      req.destroy()
      resolve(null)
    })
    req.on('error', () => {
      resolve(null)
    })
    req.end()
  })
}

export async function checkUpdate(currentVersion: string, forceNetwork = false): Promise<UpdateInfo | null> {
  // Respect CI and non-interactive environments
  if (process.env.CI) return null

  let tags: Record<string, string> | null = null

  if (!forceNetwork) {
    const cache = await readCache()
    if (cache && Date.now() - cache.lastCheck < CACHE_TTL_MS) {
      tags = { latest: cache.latestVersion }
    }
  }

  if (!tags) {
    tags = await fetchNpmTags()
    if (tags && tags.latest) {
      // Don't await cache write to avoid blocking
      writeCache({ lastCheck: Date.now(), latestVersion: tags.latest }).catch(() => {})
    }
  }

  if (!tags || !tags.latest) return null

  const latestStable = tags.latest

  try {
    // Only notify if latest stable is strictly greater than current version
    const hasUpdate = semver.gt(latestStable, currentVersion)
    if (hasUpdate) {
      return {
        hasUpdate: true,
        current: currentVersion,
        latest: latestStable,
        tag: 'latest'
      }
    }
  } catch {
    // Invalid semver
  }
  return null
}

export async function getLatestVersionForTag(tag: string): Promise<string | null> {
  const tags = await fetchNpmTags()
  if (!tags) return null
  return tags[tag] || null
}
