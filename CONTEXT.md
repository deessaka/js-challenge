# JS Challenge

Ce contexte décrit le vocabulaire métier partagé entre l’expérience d’apprentissage et le panel d’administration. Il distingue les comptes, les contenus pédagogiques, la progression et les opérations réservées aux administrateurs.

## Comptes et accès

**Utilisateur** : personne inscrite qui utilise JS Challenge pour résoudre des exercices et conserver sa progression.
_Avoid_: Compte, membre, client.

**Administrateur** : utilisateur autorisé à gérer les utilisateurs, le catalogue d’exercices et les opérations administratives courantes.
_Avoid_: Modérateur, opérateur.

**Super administrateur** : administrateur autorisé à gérer les rôles, effectuer les opérations destructives ou sensibles et réinitialiser une progression.
_Avoid_: Propriétaire, root.

**Suspension** : état réversible qui empêche un utilisateur d’accéder à l’application sans supprimer son historique.
_Avoid_: Bannissement, suppression, désactivation définitive.

**Action sensible** : opération qui modifie les droits, l’accès, la progression ou la disponibilité d’un contenu et qui doit être confirmée et journalisée.
_Avoid_: Action critique, mutation admin.

## Catalogue pédagogique

**Exercice** : unité d’apprentissage JavaScript composée d’un énoncé, d’un niveau de difficulté et de règles de progression.
_Avoid_: Challenge dans le code métier, leçon, problème.

**Exercice brouillon** : exercice en préparation, invisible pour les apprenants et non pris en compte dans le parcours public.
_Avoid_: Draft dans les libellés utilisateur.

**Exercice publié** : exercice disponible dans le catalogue public et pouvant être débloqué par les apprenants.
_Avoid_: Actif, visible, live.

**Exercice archivé** : exercice retiré du catalogue et du déverrouillage futur, dont les anciennes solutions, scores et statistiques sont conservés.
_Avoid_: Supprimé, désactivé.

**Difficulté** : niveau de complexité pédagogique utilisé pour présenter et valoriser un exercice.
_Avoid_: Rang, grade.

**Prérequis** : exercice ou condition qui doit être satisfait avant qu’un autre exercice puisse être débloqué.
_Avoid_: Dépendance technique, parent.

**Test d’exercice** : ensemble de cas d’exécution versionnés dans Git qui vérifie la solution d’un apprenant.
_Avoid_: Test admin, script libre.

## Progression et administration

**Progression** : état d’avancement d’un utilisateur dans le parcours séquentiel des exercices.
_Avoid_: Score, historique.

**Réinitialisation de progression** : opération réservée au super administrateur qui supprime ou remet à zéro la progression d’un utilisateur après confirmation et justification.
_Avoid_: Reset silencieux, purge.

**Journal d’activité** : historique des actions sensibles réalisées par les administrateurs, avec acteur, cible, action, raison et date.
_Avoid_: Logs de debug, audit log dans les écrans utilisateurs.

**Catalogue public** : ensemble des exercices publiés et non archivés qui peuvent être présentés et débloqués par les apprenants.
_Avoid_: Liste des exercices, bibliothèque.
