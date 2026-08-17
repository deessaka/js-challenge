import { randomUUID } from 'node:crypto';
import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ApiClient, ApiError } from './api_client.js';
import { ConfigStore } from './config_store.js';
import { EditorNotFoundError, openEditor } from './editor.js';
import { askSecret, error, info, success, table, warning } from './terminal_ui.js';
const VERSION = '0.1.0';
const DEFAULT_API_URL = 'http://localhost:3333';
function parseArguments(args) {
    const [command = 'help', ...rest] = args;
    const positional = [];
    const options = {};
    for (let index = 0; index < rest.length; index += 1) {
        const value = rest[index];
        if (!value.startsWith('--')) {
            positional.push(value);
            continue;
        }
        const [key, inlineValue] = value.slice(2).split('=', 2);
        if (inlineValue !== undefined) {
            options[key] = inlineValue;
        }
        else if (rest[index + 1] && !rest[index + 1].startsWith('--')) {
            options[key] = rest[index + 1];
            index += 1;
        }
        else {
            options[key] = true;
        }
    }
    return { command, positional, options };
}
export async function runCli(args, env = process.env) {
    const parsed = parseArguments(args);
    const store = new ConfigStore(env);
    const savedConfig = await store.read();
    const apiBaseUrl = String(parsed.options['api-url'] || env.JS_CHALLENGE_API_URL || savedConfig.apiBaseUrl || DEFAULT_API_URL);
    let token = savedConfig.token;
    const api = new ApiClient(apiBaseUrl, () => token);
    try {
        switch (parsed.command) {
            case 'login': {
                const nextToken = await askSecret('Token API JS Challenge : ');
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
                success('Token local supprimé.');
                return 0;
            case 'list': {
                requireToken(token);
                const response = await api.listChallenges();
                table(response.data.map((challenge) => ({
                    '#': String(challenge.number),
                    Challenge: challenge.slug,
                    Titre: challenge.title,
                    État: challenge.isCompleted ? 'terminé' : challenge.isUnlocked ? 'disponible' : 'verrouillé',
                    Points: String(challenge.points),
                })));
                return 0;
            }
            case 'next': {
                requireToken(token);
                const challenge = await api.getNextChallenge();
                if (!challenge) {
                    info('Aucun challenge disponible pour le moment.');
                    return 0;
                }
                printChallenge(challenge);
                return 0;
            }
            case 'start': {
                requireToken(token);
                const slug = requireArgument(parsed.positional[0], 'Indiquez le slug du challenge.');
                const challenge = await api.getChallenge(slug);
                ensureUnlocked(challenge);
                const filePath = await createChallengeFile(challenge);
                success(`Challenge prêt dans ${filePath}.`);
                if (parsed.options['no-edit'] !== true)
                    openEditor(filePath, env);
                return 0;
            }
            case 'submit': {
                requireToken(token);
                const slug = requireArgument(parsed.positional[0], 'Indiquez le slug du challenge.');
                const challenge = await api.getChallenge(slug);
                const filePath = resolve(parsed.positional[1] || `${safeFileName(challenge.slug)}.js`);
                const code = await readFile(filePath, 'utf8');
                const submission = await api.createSubmission({
                    challengeId: challenge.id,
                    code,
                    idempotencyKey: randomUUID(),
                });
                printSubmission(submission);
                return submission.accepted ? 0 : 2;
            }
            case 'dashboard':
                info(`${apiBaseUrl}/home`);
                info('Ouvrez cette URL dans votre navigateur pour voir vos statistiques détaillées.');
                return 0;
            case 'version':
                console.log(`js-challenge ${VERSION}`);
                return 0;
            case 'help':
            default:
                printHelp();
                return parsed.command === 'help' ? 0 : 1;
        }
    }
    catch (caught) {
        if (caught instanceof ApiError) {
            error(caught.message);
            if (caught.status === 401)
                warning('Exécutez `js-challenge login` pour vous authentifier.');
            return 1;
        }
        if (caught instanceof EditorNotFoundError) {
            error(caught.message);
            return 1;
        }
        error(caught instanceof Error ? caught.message : String(caught));
        return 1;
    }
}
function requireToken(token) {
    if (!token)
        throw new Error('Vous devez vous connecter avec `js-challenge login`.');
}
function requireArgument(value, message) {
    if (!value)
        throw new Error(message);
    return value;
}
function ensureUnlocked(challenge) {
    if (!challenge.isUnlocked)
        throw new Error('Ce challenge est encore verrouillé.');
}
async function createChallengeFile(challenge) {
    const filePath = resolve(`${safeFileName(challenge.slug)}.js`);
    try {
        await access(filePath);
    }
    catch {
        await writeFile(filePath, `${challenge.starterCode || `// ${challenge.title}\n`}\n`, {
            encoding: 'utf8',
            mode: 0o600,
        });
    }
    return filePath;
}
function safeFileName(slug) {
    return slug.replace(/[^a-zA-Z0-9._-]/g, '-');
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
function printHelp() {
    console.log(`JS Challenge CLI — apprendre JavaScript depuis le terminal

Usage:
  js-challenge login [--api-url URL]
  js-challenge logout
  js-challenge list
  js-challenge next
  js-challenge start <slug> [--no-edit]
  js-challenge submit <slug> [fichier.js]
  js-challenge dashboard
  js-challenge version

Éditeur:
  JSC_EDITOR, puis VISUAL, puis EDITOR, puis nvim, vim ou vi.

Configuration:
  JS_CHALLENGE_API_URL ou ~/.config/js-challenge/config.json
`);
}
if (import.meta.url === `file://${process.argv[1]}`) {
    runCli(process.argv.slice(2)).then((code) => {
        process.exitCode = code;
    });
}
//# sourceMappingURL=main.js.map