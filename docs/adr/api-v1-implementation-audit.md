# Audit technique avant implémentation de l’API v1

## État actuel

Le projet utilise AdonisJS avec deux guards : `web` pour les sessions Inertia et `api` pour les access tokens. Le guard par défaut est `api`, donc chaque route API v1 devra déclarer explicitement le guard `api` pour rendre son intention lisible.

Le modèle `Exercise` est déjà proche de la ressource publique `Challenge`. Il possède un statut de cycle de vie (`draft`, `published`, `archived`), un slug, une description, une difficulté, une catégorie, des points, un starter code, un hint et un prérequis.

La progression est actuellement portée par `UserProgress`, qui stocke `isUnlocked`, `completed`, `unlockedAt` et `completedAt`. Le dernier code de travail est stocké chiffré dans `UserSolution`. Il n’existe pas encore d’historique de soumissions ou de tentatives.

## Routes à conserver

Les routes actuelles `/api/exercises/:exerciseId/load-progress`, `/api/exercises/:exerciseId/save-progress` et `/api/exercises/:exerciseId/execute` sont utilisées par l’atelier Monaco. Elles doivent rester actives pendant la migration.

Les nouveaux endpoints `/api/v1` doivent appeler des services communs et ne pas appeler les contrôleurs Inertia. Le dashboard pourra migrer progressivement vers ces endpoints avant le retrait de Monaco.

## Execution actuelle

`IsolatedTestRunner` utilise `isolated-vm`, une limite de mémoire de 128 MB et un timeout de cinq secondes. Il charge les tests depuis `tests/exercises/Exercice{id}.test.js` et renvoie un tableau de résultats `{ description, passed, error? }`.

Cette implémentation est réutilisable pour le premier endpoint de soumission, mais elle s’exécute actuellement directement dans la requête HTTP. Le premier refactor doit donc introduire un service d’exécution abstrait sans déplacer immédiatement le runner dans une queue.

## Décisions d’implémentation

1. Utiliser des DTO sérialisés plutôt que retourner directement les modèles Lucid.
2. Exposer `Exercise` sous le nom public `Challenge` dans les réponses API.
3. Ajouter une validation Vine dédiée aux requêtes de soumission.
4. Ajouter des resources API séparées des réponses Inertia.
5. Réutiliser `UserProgressService` et `ExerciseServices` via des méthodes typées plutôt que recopier leurs requêtes.
6. Introduire `Submission` et `Attempt` seulement après stabilisation des endpoints de lecture si le périmètre de la première tranche doit rester réduit.
7. Préserver les anciennes routes et les tester contre les nouveaux services lors de la migration.

## Risques identifiés

Le service de progression retourne aujourd’hui plusieurs types `any` et calcule certains agrégats à la volée. Il faudra éviter d’introduire ces `any` dans les DTO publics.

Le runner prend actuellement `Record<string, any>` et suppose une propriété `code`. La validation v1 doit normaliser explicitement `challengeId`, `language` et `code` avant d’appeler le service.

Les tests du dépôt sont principalement des tests d’exercices JavaScript unitaires. Il manque des tests fonctionnels HTTP dédiés à l’auth API, au catalogue, à la progression et aux soumissions.
