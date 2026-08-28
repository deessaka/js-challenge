#!/usr/bin/env node
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { stdin } from 'node:process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ApiClient, ApiError } from './api_client.js';
import { ConfigStore } from './config_store.js';
import { EditorPreferencesStore } from './editor_preferences.js';
import { DEFAULT_ENVIRONMENT, inferEnvironmentFromUrl, parseEnvironment, resolveEnvironment, } from './environment.js';
import { askSecret, error, info, success, table, warning } from './terminal_ui.js';
import { shortcutKeys } from './ui/shortcut_catalog.js';
import { readCliVersion } from './version.js';
import { openBrowser } from './browser.js';
import { getCachedUpdateInfo, getUpdateInfo, isNewerVersion, notifyIfUpdateAvailable, PACKAGE_NAME, } from './update_service.js';
const UPDATE_TAGS = ['latest', 'beta'];
export function parseArguments(args) {
    const positional = [];
    const options = {};
    let command = 'tui';
    let commandFound = false;
    for (let index = 0; index < args.length; index += 1) {
        const value = args[index];
        if (value === '-v') {
            options.version = true;
            continue;
        }
        if (value === '-h') {
            options.help = true;
            continue;
        }
        if (value.startsWith('--')) {
            const [rawKey, inlineValue] = value.slice(2).split('=', 2);
            const key = rawKey === 'show-url' ? 'print-url' : rawKey;
            if (inlineValue !== undefined) {
                options[key] = inlineValue;
            }
            else if (args[index + 1] && !args[index + 1].startsWith('-')) {
                options[key] = args[index + 1];
                index += 1;
            }
            else {
                options[key] = true;
            }
            continue;
        }
        if (!commandFound) {
            command = value;
            commandFound = true;
        }
        else {
            positional.push(value);
        }
    }
    return { command, positional, options };
}
export async function runCli(args, env = process.env) {
    const parsed = parseArguments(args);
    try {
        validateParsedArguments(parsed);
    }
    catch (caught) {
        error(caught instanceof Error ? caught.message : String(caught));
        return 1;
    }
    if (parsed.options.version === true || parsed.command === 'version') {
        console.log(`codojo ${await readCliVersion()}`);
        return 0;
    }
    if (parsed.options.help === true || parsed.command === 'help') {
        printHelp();
        return 0;
    }
    try {
        const cliVersion = await readCliVersion();
        const requestedEnvironment = parseEnvironment(parsed.options.environment ?? env.CODOJO_ENV);
        const explicitApiUrl = typeof parsed.options['api-url'] === 'string' ? parsed.options['api-url'] : undefined;
        const inferredEnvironment = explicitApiUrl ? inferEnvironmentFromUrl(explicitApiUrl) : undefined;
        const initialEnvironment = requestedEnvironment || inferredEnvironment || DEFAULT_ENVIRONMENT;
        let store = new ConfigStore(env, undefined, initialEnvironment);
        let savedConfig = await store.read();
        let environmentContext = resolveEnvironment({
            requestedEnvironment,
            explicitApiUrl,
            persistedApiUrl: savedConfig.apiBaseUrl,
            env,
        });
        if (environmentContext.environment !== initialEnvironment) {
            store = new ConfigStore(env, undefined, environmentContext.environment);
            savedConfig = await store.read();
            environmentContext = resolveEnvironment({
                requestedEnvironment,
                explicitApiUrl,
                persistedApiUrl: savedConfig.apiBaseUrl,
                env,
            });
        }
        const { apiBaseUrl } = environmentContext;
        let token = savedConfig.token;
        const api = new ApiClient(apiBaseUrl, () => token, cliVersion);
        const shouldCheckForUpdate = !['update', 'version', 'help'].includes(parsed.command) &&
            parsed.options['no-update-check'] !== true;
        const isTuiCommand = parsed.command === 'tui' || parsed.command === 'start';
        const cachedUpdate = shouldCheckForUpdate && isTuiCommand
            ? await getCachedUpdateInfo(cliVersion, 'latest', { env })
            : null;
        if (shouldCheckForUpdate) {
            const updateCheck = setTimeout(() => {
                if (isTuiCommand) {
                    void getUpdateInfo(cliVersion, 'latest', { env });
                }
                else {
                    void notifyIfUpdateAvailable(cliVersion, { env });
                }
            }, 0);
            updateCheck.unref();
        }
        switch (parsed.command) {
            case 'tui': {
                const React = (await import('react')).default;
                const { runTui } = await import('./tui_runtime.js');
                const { App } = await import('./ui/App.js');
                const editorPreferences = await new EditorPreferencesStore(env).read();
                await runTui(React.createElement(App, {
                    apiBaseUrl,
                    environment: environmentContext.environment,
                    clientVersion: cliVersion,
                    updateInfo: cachedUpdate,
                }), {
                    alternateScreen: editorPreferences.alternateScreen,
                });
                return 0;
            }
            case 'login': {
                if (parsed.positional.length > 0 || parsed.options.token !== undefined) {
                    throw new Error('Ne passez pas le token dans la ligne de commande. Utilisez la saisie masquée de `codojo login`.');
                }
                const tokenUrl = `${apiBaseUrl}/profile#api-token`;
                info(`Connexion à l’environnement ${environmentLabel(environmentContext.environment)}.`);
                if (parsed.options['no-browser'] !== true) {
                    if (openBrowser(tokenUrl)) {
                        info('Profil ouvert dans le navigateur. Revenez ici avec le token généré.');
                    }
                    else {
                        warning(`Impossible d’ouvrir le navigateur. Utilisez : ${tokenUrl}`);
                    }
                }
                else {
                    info(`Générez votre token dans votre profil ${environmentLabel(environmentContext.environment)}. Utilisez --print-url pour afficher le lien.`);
                    if (parsed.options['print-url'] === true)
                        console.log(tokenUrl);
                }
                const nextToken = parsed.options['token-stdin'] === true
                    ? await readTokenFromStdin()
                    : await askSecret('Token API Codojo : ');
                if (!nextToken)
                    return 1;
                token = nextToken;
                const user = await api.getMe();
                await store.save({ apiBaseUrl, token });
                success(`Connecté en tant que ${user.username}.`);
                return 0;
            }
            case 'logout':
                await store.clearToken();
                success(`Token local supprimé du profil ${environmentLabel(environmentContext.environment)}.`);
                return 0;
            case 'list': {
                requireToken(token);
                const response = await api.listAllChallenges();
                table(response.data.map((challenge) => ({
                    '#': String(challenge.number),
                    'Exercice': challenge.slug,
                    'Titre': challenge.title,
                    'État': challenge.isCompleted
                        ? 'terminé'
                        : challenge.isUnlocked
                            ? 'disponible'
                            : 'verrouillé',
                    'Points': String(challenge.points),
                })));
                return 0;
            }
            case 'next': {
                requireToken(token);
                const challenge = await api.getNextChallenge();
                if (!challenge) {
                    info('Aucun exercice disponible pour le moment.');
                    return 0;
                }
                printChallenge(challenge);
                return 0;
            }
            case 'start': {
                requireToken(token);
                const slug = requireArgument(parsed.positional[0], 'Indiquez le slug de l’exercice.');
                const React = (await import('react')).default;
                const { runTui } = await import('./tui_runtime.js');
                const { App } = await import('./ui/App.js');
                const editorPreferences = await new EditorPreferencesStore(env).read();
                await runTui(React.createElement(App, {
                    apiBaseUrl,
                    environment: environmentContext.environment,
                    clientVersion: cliVersion,
                    initialSlug: slug,
                    updateInfo: cachedUpdate,
                }), { alternateScreen: editorPreferences.alternateScreen });
                return 0;
            }
            case 'submit': {
                requireToken(token);
                const slug = requireArgument(parsed.positional[0], 'Indiquez le slug de l’exercice.');
                const challenge = await api.getChallenge(slug);
                const { EditorPersistence } = await import('./editor_persistence.js');
                const persistence = new EditorPersistence({
                    slug: challenge.slug,
                    apiBaseUrl,
                    legacyWorkspacePath: process.cwd(),
                    legacyExerciseId: challenge.id,
                });
                let code;
                if (parsed.positional[1]) {
                    const filePath = resolve(parsed.positional[1]);
                    code = await readFile(filePath, 'utf8');
                }
                else {
                    try {
                        code = await readFile(persistence.virtualFilePath, 'utf8');
                    }
                    catch {
                        const session = await persistence.open(challenge.starterCode || `// ${challenge.title}\n`);
                        code = session.code;
                    }
                }
                const submission = await api.createSubmission({
                    challengeId: challenge.id,
                    code,
                    idempotencyKey: randomUUID(),
                });
                printSubmission(submission);
                if (submission.accepted) {
                    const next = await api.getNextChallenge().catch(() => undefined);
                    if (next !== undefined)
                        printNextStep(next);
                }
                return submission.accepted ? 0 : 2;
            }
            case 'export': {
                requireToken(token);
                const slug = requireArgument(parsed.positional[0], 'Indiquez le slug de l’exercice.');
                const challenge = await api.getChallenge(slug);
                const { EditorPersistence } = await import('./editor_persistence.js');
                const persistence = new EditorPersistence({
                    slug: challenge.slug,
                    apiBaseUrl,
                    legacyWorkspacePath: process.cwd(),
                    legacyExerciseId: challenge.id,
                });
                try {
                    const code = await readFile(persistence.virtualFilePath, 'utf8');
                    process.stdout.write(code + '\n');
                    return 0;
                }
                catch {
                    error(`L'exercice ${challenge.slug} n'a jamais été ouvert localement. L'historique se trouve sur le portail web.`);
                    return 1;
                }
            }
            case 'dashboard': {
                if (parsed.options['print-url'] === true) {
                    console.log(`${apiBaseUrl}/home`);
                }
                else {
                    info(`Tableau de bord disponible dans l’environnement ${environmentLabel(environmentContext.environment)}. Utilisez --print-url pour afficher le lien.`);
                }
                return 0;
            }
            case 'doctor': {
                printDiagnostics(environmentContext, cliVersion, parsed.options['print-url'] === true);
                return 0;
            }
            case 'update':
                return await runUpdate(parsed, env, cliVersion);
            default:
                error(`Commande inconnue : ${parsed.command}. Utilisez \`codojo --help\` pour voir les commandes.`);
                return 1;
        }
    }
    catch (caught) {
        if (caught instanceof ApiError) {
            error(caught.message);
            if (caught.status === 401)
                warning('Exécutez `codojo login` pour vous authentifier.');
            return 1;
        }
        error(caught instanceof Error ? caught.message : String(caught));
        return 1;
    }
}
function validateParsedArguments(parsed) {
    const booleanOptions = new Set([
        'version',
        'help',
        'no-browser',
        'print-url',
        'token-stdin',
        'no-update-check',
    ]);
    const valueOptions = new Set(['environment', 'api-url', 'tag']);
    for (const [key, value] of Object.entries(parsed.options)) {
        if (!booleanOptions.has(key) && !valueOptions.has(key)) {
            throw new Error(`Option inconnue : --${key}. Utilisez \`codojo --help\`.`);
        }
        if (valueOptions.has(key) && value === true) {
            throw new Error(`L’option --${key} attend une valeur.`);
        }
        if (booleanOptions.has(key) && typeof value === 'string') {
            throw new Error(`L’option --${key} ne prend pas de valeur.`);
        }
    }
}
async function readTokenFromStdin() {
    if (stdin.isTTY) {
        throw new Error('L’option --token-stdin nécessite un token fourni par l’entrée standard.');
    }
    const chunks = [];
    for await (const chunk of stdin) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }
    const token = Buffer.concat(chunks).toString('utf8').trim();
    if (!token)
        throw new Error('Le token fourni par stdin ne peut pas être vide.');
    return token;
}
function requireToken(token) {
    if (!token)
        throw new Error('Vous devez vous connecter avec `codojo login`.');
}
function requireArgument(value, message) {
    if (!value)
        throw new Error(message);
    return value;
}
function printChallenge(challenge) {
    console.log(`${challenge.number}. ${challenge.title}`);
    console.log(`Slug : ${challenge.slug}`);
    console.log(`Difficulté : ${challenge.difficultyLabel}`);
    console.log(`Points : ${challenge.points}`);
    console.log(`État : ${challenge.isCompleted ? 'terminé' : challenge.isUnlocked ? 'disponible' : 'verrouillé'}`);
    console.log(`\n${challenge.description}`);
    if (challenge.hint)
        console.log(`\nIndice : ${challenge.hint}`);
}
function printSubmission(submission) {
    console.log(`Soumission #${submission.id}`);
    console.log(`Statut : ${submission.status}`);
    console.log(`Acceptée : ${submission.accepted ? 'oui' : 'non'}`);
    for (const result of submission.results) {
        console.log(`${result.passed ? 'PASS' : 'FAIL'} — ${result.description}`);
        if (result.error)
            console.log(`  ${result.error}`);
    }
}
function printNextStep(next) {
    if (next) {
        success('Exercice réussi ! Prochaine étape :');
        console.log(`  ${next.number}. ${next.title} (${next.slug})`);
        console.log(`  → codojo start ${next.slug}`);
    }
    else {
        success('Exercice réussi ! Vous avez terminé tous les exercices disponibles pour le moment. 🎉');
    }
}
function environmentLabel(environment) {
    return environment === 'production'
        ? 'production'
        : environment === 'development'
            ? 'développement'
            : 'staging';
}
function printDiagnostics(context, version, includeUrl) {
    console.log(`Version : ${version}`);
    console.log(`Environnement : ${environmentLabel(context.environment)}`);
    console.log(`Source de configuration : ${context.source}`);
    if (includeUrl)
        console.log(`API : ${context.apiBaseUrl}`);
}
function printHelp() {
    const views = ['view-catalog', 'view-instructions', 'view-editor', 'view-tests']
        .map(shortcutKeys)
        .join(' / ');
    console.log(`Codojo (codojo / dojo) — Le dojo d'entraînement JavaScript dans le terminal

Usage:
  codojo                           Lance l'interface interactive TUI (éditeur Vim + tests + logs)
  codojo login                     Connexion avec un jeton API (saisie masquée)
  codojo logout                    Supprime le jeton du profil actif
  codojo list                      Liste les exercices disponibles
  codojo next                      Affiche le prochain exercice
  codojo start <slug>              Ouvre directement l'éditeur sur l'exercice
  codojo submit <slug> [code.js]   Soumet et teste le code
  codojo export <slug>             Imprime le document virtuel de l'exercice
  codojo dashboard [--print-url]   Indique ou affiche l'accès au tableau de bord
  codojo doctor [--print-url]      Affiche le contexte actif sans token ni host par défaut
  codojo update [--tag latest|beta] Met à jour l'installation globale depuis NPM
  codojo version                   Affiche la version installée

Options globales:
  --version, -v                    Affiche la version et quitte
  --help, -h                       Affiche cette aide et quitte
  --environment <nom>              production, development ou staging
  --api-url <url>                  Override explicite et validé de l’endpoint
  --no-browser                     N’ouvre pas automatiquement le navigateur pour login
  --print-url                      Affiche explicitement un lien lorsque la commande en fournit un
  --token-stdin                    Lit le token depuis stdin, sans l’exposer dans l’historique
  --no-update-check                Désactive la vérification automatique de mise à jour

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

Configuration isolée:
  ${'${XDG_CONFIG_HOME:-~/.config}/codojo/profiles/production.json'}
  ${'${XDG_CONFIG_HOME:-~/.config}/codojo/profiles/development.json'}
  ${'${XDG_CONFIG_HOME:-~/.config}/codojo/profiles/staging.json'}

Exemples:
  codojo --version
  codojo --help
  CODOJO_ENV=development codojo
  codojo --environment development login

Mise à jour:
  codojo update --tag beta         Installer le canal bêta
`);
}
async function runUpdate(parsed, env, currentVersion) {
    const requestedTag = String(parsed.options.tag || parsed.positional[0] || 'latest');
    if (!UPDATE_TAGS.includes(requestedTag)) {
        throw new Error(`Tag invalide : ${requestedTag}. Utilisez latest ou beta.`);
    }
    const tag = requestedTag;
    const update = await getUpdateInfo(currentVersion, tag, { env });
    if (update && !isNewerVersion(update.currentVersion, update.latestVersion)) {
        info(update.currentVersion === update.latestVersion
            ? `Codojo ${currentVersion} est déjà à jour sur le canal ${tag}.`
            : `Codojo ${currentVersion} est plus récent que le canal ${tag} (${update.latestVersion}).`);
        return 0;
    }
    info(`Mise à jour de ${PACKAGE_NAME} vers le canal ${tag}…`);
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(npmCommand, ['install', '--global', `${PACKAGE_NAME}@${tag}`], {
        env,
        stdio: 'inherit',
        shell: false,
    });
    return await new Promise((resolve, reject) => {
        child.once('error', reject);
        child.once('exit', (code, signal) => resolve(signal ? 128 : (code ?? 1)));
    }).then((code) => {
        if (code === 0)
            success(`Codojo a été mis à jour avec succès depuis le canal ${tag}.`);
        return code;
    });
}
function isMainModule() {
    if (!process.argv[1])
        return false;
    try {
        const currentPath = fileURLToPath(import.meta.url);
        const scriptPath = realpathSync(process.argv[1]);
        return currentPath === scriptPath;
    }
    catch {
        return false;
    }
}
if (isMainModule()) {
    runCli(process.argv.slice(2)).then((code) => {
        process.exitCode = code;
    });
}
//# sourceMappingURL=main.js.map