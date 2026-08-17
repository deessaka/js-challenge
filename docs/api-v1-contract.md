# Contrat API v1

## Principes

L’API v1 est la source de vérité commune au dashboard Web et au CLI terminal. Les clients ne consomment pas directement les modèles Lucid et ne dépendent pas des contrôleurs Inertia. Les réponses sont des DTO publics versionnés.

Les ressources utilisent des identifiants stables et un `slug` pour les challenges. Les dates sont transmises en ISO 8601. Les états sont explicites et extensibles.

## Authentification

Les endpoints API utilisent le guard token `api` existant. Le CLI demande temporairement un token dans le terminal et le stocke sous `${XDG_CONFIG_HOME:-~/.config}/js-challenge/config.json` avec des permissions `0600`. Une future version pourra ajouter un login navigateur avec OAuth 2.0 + PKCE ou un keychain système. Les sessions Web Inertia restent utilisées par le dashboard.

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
}

interface SubmissionResponse {
  id: string
  status: 'queued' | 'running' | 'passed' | 'failed' | 'error' | 'timeout'
  accepted: boolean | null
  results: TestResult[]
  client: 'web' | 'terminal'
  startedAt: string | null
  completedAt: string | null
}

interface TestResult {
  name: string
  passed: boolean
  message?: string
  durationMs?: number
}
```

## Endpoints utilisateurs

| Méthode | Endpoint | Usage |
|---|---|---|
| `GET` | `/api/v1/me` | Profil courant et capacités du compte. |
| `GET` | `/api/v1/challenges` | Catalogue paginé avec filtres. |
| `GET` | `/api/v1/challenges/:slug` | Détail du challenge et starter code. |
| `GET` | `/api/v1/progress` | Synthèse de progression. |
| `GET` | `/api/v1/progress/:challengeId` | Progression détaillée. |
| `POST` | `/api/v1/submissions` | Créer une soumission officielle depuis Web ou terminal. |
| `GET` | `/api/v1/submissions/:id` | Consulter le résultat d’une soumission. |
| `GET` | `/api/v1/recommendations/next` | Obtenir le prochain challenge recommandé. |

## Compatibilité avec l’existant

Les routes actuelles `/api/exercises/:exerciseId/*` restent disponibles pendant la migration. Elles pourront déléguer progressivement aux nouveaux services et être dépréciées après migration du dashboard.

Le modèle interne `Exercise` peut rester inchangé. Un mapper dédié transforme `Exercise` en `ChallengeSummary` ou `ChallengeDetail`, ce qui évite un renommage massif de la base.

## Idempotence et sécurité

`POST /api/v1/submissions` accepte une clé d’idempotence pour éviter les doubles validations dues aux retries réseau. Les soumissions sont associées à l’utilisateur authentifié et au challenge publié demandé. Le serveur ne doit jamais accepter un résultat de test envoyé par le client comme preuve de réussite.
