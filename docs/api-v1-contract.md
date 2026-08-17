# Contrat API v1 proposé

## Principes

L’API v1 est la source de vérité commune au dashboard web et à l’extension VS Code. Les clients ne consomment pas directement les modèles Lucid et ne dépendent pas des contrôleurs Inertia. Les réponses sont des DTO publics versionnés.

Les ressources utilisent des identifiants stables et un `slug` pour les challenges. Les dates sont transmises en ISO 8601. Les états sont explicites et extensibles.

## Authentification

Les endpoints API utilisent le guard token `api` existant. Le parcours de connexion de l’extension doit être ajouté séparément via un callback navigateur et un token stocké dans `vscode.SecretStorage`. Les sessions web Inertia restent utilisées par le dashboard.

## Ressources

### Challenge

```ts
interface ChallengeSummary {
  id: string
  slug: string
  title: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
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
  client: 'web' | 'vscode'
  clientVersion?: string
}

interface SubmissionResponse {
  id: string
  status: 'queued' | 'running' | 'passed' | 'failed' | 'error' | 'timeout'
  accepted: boolean
  results: TestResult[]
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
| `GET` | `/api/v1/challenges` | Catalogue paginé avec filtres de difficulté, catégorie et état. |
| `GET` | `/api/v1/challenges/:slug` | Détail d’un challenge et template de départ. |
| `GET` | `/api/v1/progress` | Synthèse de progression. |
| `GET` | `/api/v1/progress/:challengeId` | Progression détaillée d’un challenge. |
| `POST` | `/api/v1/submissions` | Créer une soumission officielle. |
| `GET` | `/api/v1/submissions/:id` | Consulter le résultat d’une soumission, utile si elle est asynchrone. |
| `GET` | `/api/v1/recommendations/next` | Obtenir le prochain challenge recommandé. |

## Endpoints admin

| Méthode | Endpoint | Usage |
|---|---|---|
| `GET` | `/api/v1/admin/users` | Rechercher et filtrer les utilisateurs. |
| `GET` | `/api/v1/admin/submissions` | Inspecter les soumissions. |
| `GET` | `/api/v1/admin/statistics` | Statistiques globales et santé de la plateforme. |
| `POST` | `/api/v1/admin/challenges` | Créer un challenge en brouillon. |
| `PATCH` | `/api/v1/admin/challenges/:id` | Modifier le contenu ou la configuration. |
| `POST` | `/api/v1/admin/challenges/:id/publish` | Publier une version validée. |
| `POST` | `/api/v1/admin/challenges/:id/archive` | Archiver un challenge. |

## Compatibilité avec l’existant

Les routes actuelles `/api/exercises/:exerciseId/*` doivent rester disponibles pendant la migration. Elles peuvent déléguer progressivement aux nouveaux services et seront dépréciées après migration du dashboard et de l’extension.

Le modèle interne `Exercise` peut rester inchangé dans la première version. Un mapper dédié transforme `Exercise` en `ChallengeSummary` ou `ChallengeDetail`. Cela évite de coupler le premier contrat public à un renommage massif de la base.

## Idempotence et sécurité

`POST /api/v1/submissions` doit accepter une clé d’idempotence pour éviter les doubles validations dues aux retries réseau. Les soumissions doivent être associées à l’utilisateur authentifié et au challenge publié demandé. Le serveur ne doit jamais accepter un résultat de test envoyé par le client comme preuve de réussite.
