# Panel d’administration

Le panel est disponible sous `/admin` pour les comptes dont le rôle est `admin` ou `super_admin`. Il reprend la direction visuelle de Codojo tout en ajoutant une navigation de console, des indicateurs orientés action, des listes filtrables et des confirmations pour les opérations sensibles.

## Installation

Après déploiement, exécuter les migrations :

```bash
node ace migration:run
```

Créer ou utiliser un utilisateur existant et vérifié, puis renseigner son email dans `ADMIN_EMAIL` avant d’exécuter le seeder :

```bash
ADMIN_EMAIL=admin@example.com node ace db:seed
```

Le seeder admin ne crée aucun compte et ne promeut personne si `ADMIN_EMAIL` est absent. Il transforme uniquement un utilisateur existant en `super_admin` et le réactive. Le compte de test `codojo_test_user` est géré par un seeder séparé, automatiquement ignoré lorsque `NODE_ENV=production` et uniquement créé si `SEED_TEST_USER_PASSWORD` est défini.

## Modules V1

Le dashboard présente les utilisateurs actifs et suspendus, les nouvelles inscriptions, les exercices publiés, les brouillons, les archives et les dernières actions sensibles. La vue utilisateurs permet de rechercher, filtrer, changer les rôles, suspendre ou réactiver un compte et, pour un `super_admin`, réinitialiser une progression avec justification.

La vue exercices permet de créer un exercice, modifier son contenu pédagogique, son ordre, sa difficulté, sa catégorie, ses points et son statut. Le panel peut vérifier la présence du fichier de tests versionné dans `tests/exercises/Exercice{id}.test.js`, mais n’édite pas de JavaScript de test depuis l’interface.

## Permissions

Le rôle `user` n’accède pas au panel. Le rôle `admin` peut gérer les utilisateurs opérationnellement et administrer le catalogue. Le rôle `super_admin` est requis pour attribuer le rôle `super_admin` et réinitialiser une progression. Un administrateur ne peut pas suspendre son propre compte ni réduire ses propres permissions.

Les actions de rôle, de suspension, de réactivation, d’archivage et de réinitialisation sont inscrites dans `admin_activity_logs`. Les comptes suspendus sont déconnectés par le middleware d’authentification et ne peuvent plus utiliser les routes protégées.

## Déploiement progressif

Les migrations ajoutent des valeurs par défaut rétrocompatibles : les utilisateurs existants deviennent `user` et `active`, tandis que les exercices existants deviennent `published`, reçoivent la catégorie `JavaScript` et une valeur de points par défaut. L’archivage retire un exercice du catalogue apprenant sans supprimer ses progressions ni ses solutions historiques.
