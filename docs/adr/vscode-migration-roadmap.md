# Feuille de route de migration vers VS Code

## Règle de non-régression

Aucune étape ne doit rendre l’extension obligatoire avant que les endpoints API v1, l’authentification extension et la soumission officielle soient disponibles. Les routes et l’éditeur Monaco actuels restent compatibles pendant toute la phase de transition.

## Étape 0 — Gel des contrats actuels

Documenter les routes existantes et éviter d’ajouter de nouvelles dépendances clientes sur les contrôleurs Inertia. Les routes `/api/exercises/:exerciseId/*` restent actives, mais tout nouveau développement client doit viser `/api/v1`.

## Étape 1 — Lecture API v1

Ajouter les DTO et endpoints de lecture en s’appuyant sur les modèles existants : catalogue, détail d’un challenge, profil et progression. Le dashboard peut ensuite commencer à consommer ces DTO sans modifier le schéma complet.

## Étape 2 — Soumissions et historique

Créer les tables `submissions` et `attempts`, puis un service de soumission qui encapsule le runner actuel. Dans cette étape, l’exécution peut rester synchrone pour limiter le changement opérationnel, mais le contrat doit déjà retourner un `submissionId` et un statut explicite.

## Étape 3 — MVP VS Code

Créer un projet indépendant `vscode-extension` avec quatre fonctionnalités : connexion via navigateur, TreeView des challenges, création du fichier de challenge et commandes Tester/Soumettre. L’extension ne doit pas reproduire le dashboard ni connaître les règles de progression.

## Étape 4 — Double client

Faire consommer les mêmes endpoints au web et à VS Code. Le dashboard montre les soumissions créées depuis l’extension. Les anciens endpoints peuvent devenir des adaptateurs internes vers les nouveaux services, sans duplication métier.

## Étape 5 — Worker d’exécution

Déplacer l’exécution hors de la requête HTTP vers une queue et un worker spécialisé. L’API crée la soumission, le worker exécute, puis le résultat met à jour la soumission et la progression. Le client interroge le statut ou reçoit une notification lorsque le système le permettra.

## Étape 6 — Retrait progressif de Monaco

Lorsque le MVP VS Code couvre l’ouverture, l’exécution, la soumission et la synchronisation, masquer l’atelier Monaco pour les nouveaux utilisateurs ou le conserver comme fallback temporaire. Supprimer le composant seulement après observation des métriques d’adoption et confirmation de la stabilité de l’extension.

## Compatibilité des données

Le modèle `UserSolution` peut être conservé comme dernier état de travail pendant la migration. `Submission` et `Attempt` deviennent la source de l’historique et des statistiques. Une tâche de reconstruction pourra calculer l’historique existant à partir des données disponibles, sans inventer de résultats passés.

## Critères de sortie

Une étape est considérée comme terminée lorsque les endpoints sont testés, documentés, observables et consommés par au moins un client. La migration ne doit pas être pilotée par la suppression de code, mais par la capacité démontrée du nouveau client à réaliser le parcours complet sans perte de progression.
