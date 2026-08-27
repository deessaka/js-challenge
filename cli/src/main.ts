#!/usr/bin/env node
import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { realpathSync } from 'node:fs'
import { access, readFile, writeFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ApiClient, ApiError } from './api_client.js'
import { ConfigStore, DEFAULT_API_URL, normalizeApiUrl } from './config_store.js'
import { EditorPreferencesStore } from './editor_preferences.js'
import { askSecret, error, info, success, table, warning } from './terminal_ui.js'
import type { Challenge, Submission } from './types.js'
import { shortcutKeys } from './ui/shortcut_catalog.js'
import {
  getCachedUpdateInfo,
  getUpdateInfo,
  isNewerVersion,
  notifyIfUpdateAvailable,
  PACKAGE_NAME,
} from './update_service.js'

const VERSION = readPackageVersion()
const UPDATE_TAGS = ['latest', 'beta'] as const

function openBrowser(url: string): boolean {
  const command =
    process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
  const args = process.platform === 'win32' ? ['', url] : [url]

  try {
    const child = spawn(command, args, {
      detached: true,
      stdio: 'ignore',
      shell: process.platform === 'win32',
    })
    child.unref()
    return true
  } catch {
    return false
  }
}

interface ParsedArguments {
  command: string
  positional: string[]
  options: Record<string, string | boolean>
}

function parseArguments(args: string[]): ParsedArguments {
  if (args.length === 0) {
    return { command: 'tui', positional: [], options: {} }
  }

  const [command = 'tui', ...rest] = args
  const positional: string[] = []
  const options: Record<string, string | boolean> = {}

  for (let index = 0; index < rest.length; index += 1) {
    const value = rest[index]
    if (!value.startsWith('--')) {
      positional.push(value)
      continue
    }

    const [key, inlineValue] = value.slice(2).split('=', 2)
    if (inlineValue !== undefined) {
      options[key] = inlineValue
    } else if (rest[index + 1] && !rest[index + 1].startsWith('--')) {
      options[key] = rest[index + 1]
      index += 1
    } else {
      options[key] = true
    }
  }

  return { command, positional, options }
}

export async function runCli(
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
): Promise<number> {
  const parsed = parseArguments(args)
  const store = new ConfigStore(env)
  const savedConfig = await store.read()
  const apiBaseUrl = normalizeApiUrl(
    String(
      parsed.options['api-url'] ||
        env.CODOJO_API_URL ||
        env.JS_CHALLENGE_API_URL ||
        savedConfig.apiBaseUrl ||
        DEFAULT_API_URL,
    ),
  )
  let token = savedConfig.token
  const api = new ApiClient(apiBaseUrl, () => token)
  const shouldCheckForUpdate =
    !['update', 'version', 'help'].includes(parsed.command) &&
    parsed.options['no-update-check'] !== true
  const isTuiCommand = parsed.command === 'tui' || parsed.command === 'start'
  const cachedUpdate =
    shouldCheckForUpdate && isTuiCommand
      ? await getCachedUpdateInfo(VERSION, 'latest', { env })
      : null

  if (shouldCheckForUpdate) {
    const updateCheck = setTimeout(() => {
      if (isTuiCommand) {
        void getUpdateInfo(VERSION, 'latest', { env })
      } else {
        void notifyIfUpdateAvailable(VERSION, { env })
      }
    }, 0)
    updateCheck.unref()
  }

  try {
    switch (parsed.command) {
      case 'tui': {
        const React = (await import('react')).default
        const { runTui } = await import('./tui_runtime.js')
        const { App } = await import('./ui/App.js')
        const editorPreferences = await new EditorPreferencesStore(env).read()
        await runTui(React.createElement(App, { apiBaseUrl, updateInfo: cachedUpdate }), {
          alternateScreen: editorPreferences.alternateScreen,
        })
        return 0
      }
      case 'login': {
        const directToken =
          typeof parsed.options['token'] === 'string'
            ? parsed.options['token']
            : parsed.positional[0]
        const tokenUrl = `${apiBaseUrl.replace(/\/$/, '')}/profile#api-token`

        if (!directToken) {
          info('Ouvrez votre profil, générez un token CLI, puis copiez-le dans ce terminal.')
          if (parsed.options['no-browser'] !== true) {
            if (openBrowser(tokenUrl)) {
              info(`Profil ouvert dans le navigateur : ${tokenUrl}`)
            } else {
              warning(`Impossible d’ouvrir le navigateur. Utilisez : ${tokenUrl}`)
            }
          } else {
            info(`Générez votre token ici : ${tokenUrl}`)
          }
        }

        const nextToken = directToken || (await askSecret('Token API Codojo : '))
        if (!nextToken) return 1
        token = nextToken
        const user = await api.getMe()
        await store.save({ apiBaseUrl, token })
        success(`Connecté en tant que ${user.username}.`)
        return 0
      }
      case 'logout':
        await store.clearToken()
        success('Token local supprimé.')
        return 0
      case 'list': {
        requireToken(token)
        const response = await api.listAllChallenges()
        table(
          response.data.map((challenge) => ({
            '#': String(challenge.number),
            Exercice: challenge.slug,
            Titre: challenge.title,
            État: challenge.isCompleted
              ? 'terminé'
              : challenge.isUnlocked
                ? 'disponible'
                : 'verrouillé',
            Points: String(challenge.points),
          })),
        )
        return 0
      }
      case 'next': {
        requireToken(token)
        const challenge = await api.getNextChallenge()
        if (!challenge) {
          info('Aucun exercice disponible pour le moment.')
          return 0
        }
        printChallenge(challenge)
        return 0
      }
      case 'start': {
        requireToken(token)
        const slug = requireArgument(parsed.positional[0], 'Indiquez le slug de l’exercice.')
        const React = (await import('react')).default
        const { runTui } = await import('./tui_runtime.js')
        const { App } = await import('./ui/App.js')
        const editorPreferences = await new EditorPreferencesStore(env).read()
        await runTui(
          React.createElement(App, { apiBaseUrl, initialSlug: slug, updateInfo: cachedUpdate }),
          {
            alternateScreen: editorPreferences.alternateScreen,
          },
        )
        return 0
      }
      case 'submit': {
        requireToken(token)
        const slug = requireArgument(parsed.positional[0], 'Indiquez le slug de l’exercice.')
        const challenge = await api.getChallenge(slug)
        const { EditorPersistence } = await import('./editor_persistence.js')
        const persistence = new EditorPersistence({
          slug: challenge.slug,
          legacyWorkspacePath: process.cwd(),
          legacyExerciseId: challenge.id,
        })

        let code: string
        if (parsed.positional[1]) {
          const filePath = resolve(parsed.positional[1])
          code = await readFile(filePath, 'utf8')
        } else {
          try {
            code = await readFile(persistence.virtualFilePath, 'utf8')
          } catch {
            const session = await persistence.open(
              challenge.starterCode || `// ${challenge.title}\n`,
            )
            code = session.code
          }
        }

        const submission = await api.createSubmission({
          challengeId: challenge.id,
          code,
          idempotencyKey: randomUUID(),
        })
        printSubmission(submission)
        return submission.accepted ? 0 : 2
      }
      case 'export': {
        requireToken(token)
        const slug = requireArgument(parsed.positional[0], 'Indiquez le slug de l’exercice.')
        const challenge = await api.getChallenge(slug)
        const { EditorPersistence } = await import('./editor_persistence.js')
        const persistence = new EditorPersistence({
          slug: challenge.slug,
          legacyWorkspacePath: process.cwd(),
          legacyExerciseId: challenge.id,
        })
        try {
          const code = await readFile(persistence.virtualFilePath, 'utf8')
          process.stdout.write(code + '\n')
          return 0
        } catch {
          error(
            `L'exercice ${challenge.slug} n'a jamais été ouvert localement. L'historique se trouve sur le portail web.`,
          )
          return 1
        }
      }
      case 'dashboard':
        info(`${apiBaseUrl}/home`)
        info('Ouvrez cette URL dans votre navigateur pour voir vos statistiques détaillées.')
        return 0
      case 'update':
        return await runUpdate(parsed, env)
      case 'version':
        console.log(`codojo ${VERSION}`)
        return 0
      case 'help':
      default:
        printHelp()
        return parsed.command === 'help' ? 0 : 1
    }
  } catch (caught) {
    if (caught instanceof ApiError) {
      error(caught.message)
      if (caught.status === 401) warning('Exécutez `codojo login` pour vous authentifier.')
      return 1
    }
    error(caught instanceof Error ? caught.message : String(caught))
    return 1
  }
}

function requireToken(token: string | undefined): asserts token is string {
  if (!token) throw new Error('Vous devez vous connecter avec `codojo login`.')
}

function requireArgument(value: string | undefined, message: string): string {
  if (!value) throw new Error(message)
  return value
}

function ensureUnlocked(challenge: Challenge): void {
  if (!challenge.isUnlocked) throw new Error('Cet exercice est encore verrouillé.')
}

function printChallenge(challenge: Challenge): void {
  console.log(`${challenge.number}. ${challenge.title}`)
  console.log(`Slug : ${challenge.slug}`)
  console.log(`Difficulté : ${challenge.difficultyLabel}`)
  console.log(`Points : ${challenge.points}`)
  console.log(
    `État : ${challenge.isCompleted ? 'terminé' : challenge.isUnlocked ? 'disponible' : 'verrouillé'}`,
  )
  console.log(`\n${challenge.description}`)
  if (challenge.hint) console.log(`\nIndice : ${challenge.hint}`)
}

function printSubmission(submission: Submission): void {
  console.log(`Soumission #${submission.id}`)
  console.log(`Statut : ${submission.status}`)
  console.log(`Acceptée : ${submission.accepted ? 'oui' : 'non'}`)
  for (const result of submission.results) {
    console.log(`${result.passed ? 'PASS' : 'FAIL'} — ${result.description}`)
    if (result.error) console.log(`  ${result.error}`)
  }
}

function printHelp(): void {
  const views = (['view-catalog', 'view-instructions', 'view-editor', 'view-tests'] as const)
    .map(shortcutKeys)
    .join(' / ')
  console.log(`Codojo (codojo / dojo) — Le dojo d'entraînement JavaScript dans le terminal

Usage:
  codojo                           Lance l'interface interactive TUI (éditeur Vim + tests + logs)
  codojo login [token]             Connexion avec un jeton API (ouvre le profil)
  codojo logout                    Supprime le jeton local
  codojo list                      Liste les exercices disponibles
  codojo next                      Affiche le prochain exercice
  codojo start <slug>              Ouvre directement l'éditeur sur l'exercice
  codojo submit <slug> [code.js]   Soumet et teste le code
  codojo export <slug>             Imprime le document virtuel de l'exercice
  codojo dashboard                 Affiche l'URL du tableau de bord
  codojo update [--tag latest|beta] Met à jour l'installation globale depuis NPM
  codojo version                   Affiche la version

Vues terminal (codojo / dojo):
  [${views}]  Ouvrir Exercices, Consignes, Éditeur ou Tests
  [${shortcutKeys('view-help')}]                                  Afficher l'Aide
  [${shortcutKeys('catalog-move')}]                     Parcourir le catalogue public
  [${shortcutKeys('catalog-search')}]                         Rechercher un exercice
  [${shortcutKeys('catalog-filter')}]                                  Changer le filtre
  [${shortcutKeys('editor-save')}]                             Sauvegarder durablement sans soumettre
  [${shortcutKeys('editor-test')}]                             Sauvegarder puis lancer un dry-run dans l'éditeur
  [${shortcutKeys('editor-submit')}]                        Sauvegarder puis soumettre officiellement
  [${shortcutKeys('back')}]                              Revenir à la vue terminal précédente
  [${shortcutKeys('quit')}]                    Quitter proprement

L'éditeur wrappe les lignes longues sans modifier la solution. Le collage identifiable est désactivé.

Configuration:
  CODOJO_API_URL ou ~/.config/codojo/config.json

Mise à jour:
  CODOJO_NO_UPDATE_CHECK=1       Désactiver la vérification automatique
  codojo update --tag beta        Installer le canal bêta
`)
}

async function runUpdate(parsed: ParsedArguments, env: NodeJS.ProcessEnv): Promise<number> {
  const positionalTag = parsed.positional[0]
  const optionTag = parsed.options['tag']
  const requestedTag = String(optionTag || positionalTag || 'latest')
  if (!UPDATE_TAGS.includes(requestedTag as (typeof UPDATE_TAGS)[number])) {
    throw new Error(`Tag invalide : ${requestedTag}. Utilisez latest ou beta.`)
  }

  const tag = requestedTag as (typeof UPDATE_TAGS)[number]
  const update = await getUpdateInfo(VERSION, tag, { env })
  if (update && !isNewerVersion(update.currentVersion, update.latestVersion)) {
    if (update.currentVersion === update.latestVersion) {
      info(`Codojo ${VERSION} est déjà à jour sur le canal ${tag}.`)
    } else {
      info(`Codojo ${VERSION} est plus récent que le canal ${tag} (${update.latestVersion}).`)
    }
    return 0
  }

  info(`Mise à jour de ${PACKAGE_NAME} vers le canal ${tag}…`)
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const child = spawn(npmCommand, ['install', '--global', `${PACKAGE_NAME}@${tag}`], {
    env,
    stdio: 'inherit',
    shell: false,
  })

  return await new Promise<number>((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      resolve(signal ? 128 : (code ?? 1))
    })
  }).then((code) => {
    if (code === 0) success(`Codojo a été mis à jour avec succès depuis le canal ${tag}.`)
    return code
  })
}

function readPackageVersion(): string {
  try {
    const packageJson = JSON.parse(
      readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
    ) as { version?: unknown }
    if (typeof packageJson.version === 'string' && packageJson.version.length > 0) {
      return packageJson.version
    }
  } catch {
    // Keep the CLI usable if the manifest is unavailable in a development context.
  }
  return '0.0.0'
}

function isMainModule(): boolean {
  if (!process.argv[1]) return false
  try {
    const currentPath = fileURLToPath(import.meta.url)
    const scriptPath = realpathSync(process.argv[1])
    return currentPath === scriptPath
  } catch {
    return false
  }
}

if (isMainModule()) {
  runCli(process.argv.slice(2)).then((code) => {
    process.exitCode = code
  })
}
