# Évaluation de la plateforme API-first et de l’extension VS Code

## Conclusion

La proposition est faisable et constitue une bonne direction produit. Le dépôt possède déjà plusieurs fondations utiles : AdonisJS, PostgreSQL/Lucid, authentification web et token, exercices persistés, progression utilisateur, solutions sauvegardées, rate limiting, panel admin et exécution isolée via `isolated-vm`.

La principale adaptation nécessaire est de faire de l’API une source de vérité explicite pour deux clients : le dashboard web et l’extension VS Code. L’éditeur Monaco ne doit pas être supprimé avant que le contrat API, les soumissions et le MVP VS Code soient suffisamment stables.

## Écart entre la cible et l’existant

| Domaine | Existant | Écart à combler |
|---|---|---|
| Challenge | Modèle `Exercise` avec titre, numéro, description, difficulté, slug, catégorie, points, statut, starter code, hint et prérequis. | Renommer ou exposer un contrat public `Challenge`, ajouter une définition de tests versionnée et séparer contenu pédagogique/configuration/exécution. |
| Progression | `UserProgress` gère déverrouillage, complétion et dates. `User` contient aussi des compteurs agrégés. | Exposer une API versionnée et choisir une source canonique pour les compteurs afin d’éviter les incohérences. |
| Solution | `UserSolution` conserve le dernier code par utilisateur/exercice. | Ajouter `Submission` et `Attempt` pour conserver chaque soumission, son statut, ses résultats et ses métriques. |
| API | Routes web et endpoints `/api/exercises/:id/*` mélangés dans `start/routes.ts`. | Ajouter une couche `/api/v1`, des validateurs, des resources/DTO et une documentation de contrat. |
| Auth | Session `web` pour l’UI et token `api` déjà configuré. | Ajouter un vrai parcours d’authentification extension, d’abord via callback navigateur puis OAuth/PKCE avant publication publique. |
| Exécution | `ExerciseController.execute` lance directement `IsolatedTestRunner` dans la requête HTTP. | Introduire une abstraction de soumission et, à terme, une queue/worker dédié avec timeout, mémoire limitée et réseau désactivé. |
| Administration | CRUD utilisateurs/exercices et journal d’activité déjà présents. | Ajouter soumissions, statistiques, versions de tests et publication de challenges. |
| Web | Dashboard, catalogue, profil, admin et atelier Monaco. | Convertir progressivement le web en dashboard de progression et conserver éventuellement un fallback temporaire. |
| VS Code | Aucun package d’extension actuellement. | Créer un workspace séparé avec TreeView, commandes, authentification, fichiers locaux et client API. |

## Endpoints API prioritaires

```text
GET    /api/v1/me
GET    /api/v1/challenges
GET    /api/v1/challenges/:slug
GET    /api/v1/progress
GET    /api/v1/progress/:challengeId
POST   /api/v1/submissions
GET    /api/v1/submissions/:id
GET    /api/v1/recommendations/next
```

Les endpoints admin peuvent venir dans une seconde tranche :

```text
GET    /api/v1/admin/users
GET    /api/v1/admin/submissions
GET    /api/v1/admin/statistics
POST   /api/v1/admin/challenges
PATCH  /api/v1/admin/challenges/:id
```

## Décisions recommandées

1. Conserver `Exercise` comme modèle interne dans un premier temps et introduire un DTO public `ChallengeResponse` plutôt que renommer immédiatement toute la base.
2. Ajouter `Submission` et `Attempt` avant de créer l’extension afin que l’historique, les statistiques et le feedback soient indépendants du client.
3. Faire de `POST /api/v1/submissions` la future opération officielle de validation, même si elle exécute d’abord le runner actuel de manière synchrone.
4. Introduire une abstraction `ExecutionService` derrière ce endpoint, puis remplacer son implémentation par une queue/worker sans modifier les clients.
5. Ne jamais faire confiance à l’exécution locale de VS Code pour valider une solution. Le résultat serveur reste la vérité.
6. Utiliser un template de challenge versionné et générer le fichier workspace local dans VS Code.
7. Commencer l’auth extension avec un callback navigateur et `SecretStorage`, puis renforcer avec PKCE et tokens courts avant publication publique.

## Séquence de migration

```text
1. Audit API, modèles et exécution
2. DTO Challenge + API /api/v1 en lecture
3. Submission + Attempt + soumission synchrone compatible avec le runner actuel
4. Tests contractuels API
5. Extension VS Code MVP : login, TreeView, ouvrir, tester, soumettre
6. Progression et feedback synchronisés
7. Queue/worker d’exécution isolé
8. Dashboard statistiques et historique
9. Retrait progressif de Monaco
```

## Risques

Le risque le plus important n’est pas VS Code mais l’exécution sécurisée du code utilisateur. `isolated-vm` est une fondation utile, mais l’exécution dans le processus HTTP ne doit pas devenir l’architecture finale si la plateforme doit supporter plusieurs langages, des charges concurrentes ou un environnement public.

Le deuxième risque est la duplication des règles de progression. Les compteurs `User`, les lignes `UserProgress` et les futures soumissions doivent avoir une stratégie claire de calcul et de reconstruction.

Le troisième risque est de construire l’extension avant le contrat API. Cela créerait un client fortement couplé aux contrôleurs actuels et rendrait toute évolution coûteuse.

## Verdict

La proposition est **faisable**, cohérente avec l’évolution actuelle du dépôt et préférable à la poursuite d’un IDE web complet. La bonne première étape n’est pas de coder le TreeView : c’est de stabiliser le contrat `/api/v1`, les soumissions et le modèle d’historique, puis de créer l’extension comme un client mince de cette plateforme.
