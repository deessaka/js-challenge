# Contrat API v1

## Principes

L’API v1 est la source de vérité commune au dashboard Web et au CLI terminal. Les clients ne consomment pas directement les modèles Lucid et ne dépendent pas des contrôleurs Inertia. Les réponses sont des DTO publics versionnés.

Les ressources utilisent des identifiants stables et un `slug` pour les challenges. Les dates sont transmises en ISO 8601. Les états sont explicites et extensibles.

## Authentification

Les endpoints API utilisent le guard token `api` existant. Depuis le profil Web, un utilisateur connecté peut générer un token CLI via `POST /profile/api-tokens`; le secret est affiché une seule fois dans un message flash. La commande CLI ouvre cette page et conserve la saisie manuelle comme fallback. Le token est ensuite stocké sous `${XDG_CONFIG_HOME:-~/.config}/js-challenge/config.json` avec des permissions `0600`. Les sessions Web Inertia restent utilisées par le dashboard.

## Ressources

### Challenge

```ts
interface ChallengeSummary {
  id: string
  slug: string
  title: string
  category: string
  difficulty: number
  difficultyLabel: 'easy' | 'medium' | 'hard'
  points: number
  status: 'draft' | 'published' | 'archived'
  isUnlocked: boolean
  isCompleted: boolean
}

interface ChallengeDetail extends ChallengeSummary {
  description: string
  language: 'javascript' | 'typescript'
  starterCode: string | null
  entrypoint: string | null
  testVersion: number
  hint: string | null
  prerequisiteId: string | null
}
```

### Progress

```ts
interface ProgressSummary {
  total: number
  completed: number
  unlocked: number
  points: number
  currentStreak: number
}

interface ChallengeProgress {
  challengeId: string
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  attempts: number
  successfulAttempts: number
  lastAttemptAt: string | null
  completedAt: string | null
}
```

### Submission

```ts
interface SubmissionRequest {
  challengeId: string
  code: string
  language: 'javascript' | 'typescript'
  client: 'web' | 'terminal'
  clientVersion?: string
  idempotencyKey?: string
  dryRun?: boolean
}

interface SubmissionResponse {
  id: string
  status: 'queued' | 'running' | 'passed' | 'failed' | 'error' | 'timeout'
  accepted: boolean | null
  results: TestResult[]
  consoleLogs: string[]
  client: 'web' | 'terminal'
  startedAt: string | null
  completedAt: string | null
}

// `consoleLogs` contient la sortie console de l’exécution courante. Elle n’est pas persistée dans l’historique.
interface TestResult {
  name: string
  passed: boolean
  message?: string
  durationMs?: number
}
```

## Endpoints utilisateurs

| Méthode | Endpoint                        | Usage                                                                            |
| ------- | ------------------------------- | -------------------------------------------------------------------------------- |
| `GET`   | `/api/v1/me`                    | Profil courant et capacités du compte.                                           |
| `GET`   | `/api/v1/challenges`            | Catalogue paginé avec filtres.                                                   |
| `GET`   | `/api/v1/challenges/:slug`      | Détail du challenge et starter code.                                             |
| `GET`   | `/api/v1/progress`              | Synthèse de progression.                                                         |
| `GET`   | `/api/v1/progress/:challengeId` | Progression détaillée.                                                           |
| `POST`  | `/api/v1/submissions`           | Créer une soumission officielle depuis Web ou terminal.                          |
| `GET`   | `/api/v1/submissions/:id`       | Consulter le résultat d’une soumission.                                          |
| `GET`   | `/api/v1/recommendations/next`  | Obtenir le prochain challenge recommandé.                                        |
| `GET`   | `/profile/api-tokens`           | Lister les métadonnées des tokens CLI du compte Web.                             |
| `POST`  | `/profile/api-tokens`           | Générer un token CLI ; le secret n’est retourné qu’une seule fois via flash Web. |

## Compatibilité avec l’existant

Les routes actuelles `/api/exercises/:exerciseId/*` restent disponibles pendant la migration. Elles pourront déléguer progressivement aux nouveaux services et être dépréciées après migration du dashboard.

Le modèle interne `Exercise` peut rester inchangé. Un mapper dédié transforme `Exercise` en `ChallengeSummary` ou `ChallengeDetail`, ce qui évite un renommage massif de la base.

## Idempotence et sécurité

`POST /api/v1/submissions` accepte une clé d’idempotence pour éviter les doubles validations dues aux retries réseau. Les soumissions sont associées à l’utilisateur authentifié et au challenge publié demandé. Le serveur ne doit jamais accepter un résultat de test envoyé par le client comme preuve de réussite.
