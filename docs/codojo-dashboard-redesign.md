# Refonte Web Codojo — Dashboard développeur

## Positionnement

Le Web Codojo devient un **centre de pilotage de progression**. L’édition et l’exécution du code appartiennent au CLI ; le dashboard Web sert à comprendre où l’on en est, choisir la prochaine compétence, consulter son activité et gérer son compte.

L’inspiration retenue vient des produits développeur modernes comme Windsurf : continuité du travail, reprise d’une session, activité récente, problèmes ou résultats visibles, navigation latérale persistante et actions rapides. Codojo conserve une identité propre, son vocabulaire pédagogique et ses composants shadcn.

## Navigation cible

| Zone             | Route                        | Rôle                                                                         |
| ---------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| Vue d’ensemble   | `/home`                      | Reprendre le parcours, progression, prochaine compétence et activité récente |
| Parcours         | `/home#path` ou `/exercises` | Explorer les exercices, états verrouillé/disponible/terminé et filtres       |
| Activité         | `/home#activity`             | Voir les dernières validations et la série de pratique                       |
| Profil & CLI     | `/profile`                   | Gérer le compte et générer le token CLI                                      |
| Administration   | `/admin/*`                   | Conserver les outils admin pour les rôles autorisés                          |
| Authentification | `/auth/*`                    | Conserver les parcours login/register/reset                                  |

Les routes historiques `/exercises/:exerciseId` restent accessibles pour compatibilité, mais ne proposent plus d’éditeur ou d’exécution Web. Elles présentent le détail de l’exercice, les prérequis et l’action « Ouvrir dans Codojo CLI ».

## Shell visuel

Le shell authentifié utilise une sidebar persistante sur desktop et un drawer shadcn sur mobile. Elle contient le logo Codojo, la vue d’ensemble, le parcours, l’activité, le lien Profil & CLI et, conditionnellement, Administration. Le bas de sidebar affiche l’utilisateur et la déconnexion.

La zone principale utilise une grille dense mais respirante : un en-tête de page court, une carte d’action principale, des indicateurs secondaires et des sections d’activité. Les surfaces utilisent une palette sombre/bleu nuit avec accents cyan/vert pour les actions et jaune pour les récompenses. Les états ne dépendent jamais uniquement de la couleur.

## Page d’accueil dashboard

La page `/home` comporte :

1. Un en-tête « Reprendre votre parcours » avec le prochain exercice et une action vers son détail.
2. Une carte « Progression globale » avec pourcentage, exercices terminés, points et série actuelle.
3. Une section « Continuer l’apprentissage » listant les exercices disponibles autour de la prochaine compétence.
4. Une timeline « Activité récente » basée sur les données réellement disponibles ; si l’historique détaillé n’existe pas encore, afficher un état vide honnête plutôt que des données inventées.
5. Une carte « Utiliser Codojo CLI » avec les commandes d’installation et un lien vers le profil pour générer un token.
6. Une carte de statut « Système » légère, limitée aux informations que le backend peut réellement fournir.

## Éléments retirés du Web

L’éditeur de code, la console d’exécution, les contrôles de sauvegarde de code et les actions d’exécution côté Web ne doivent plus être le centre de l’expérience. Le backend et les routes historiques restent disponibles si nécessaire, mais le dashboard ne les expose plus comme parcours principal.

Les pages publiques de marketing peuvent rester simples et orienter les utilisateurs vers le dashboard et le CLI. L’ancienne page d’exercice devient une page de transition pédagogique, pas un second éditeur concurrent du CLI.

## Données et compatibilité

La première version réutilise les props existantes de `HomeController` (`progressExercises`, `users`, `user`) afin d’éviter une migration de base. Les statistiques calculées doivent être dérivées des données réellement retournées. Les identifiants de challenge et les routes API restent inchangés.

Lorsque de nouvelles métriques sont nécessaires, elles seront ajoutées via des DTO ou services dédiés plutôt que calculées dans de multiples composants React. Les composants de présentation restent réutilisables et ne doivent pas appeler directement le backend.

## Critères UX

Le nouveau dashboard doit être compréhensible en moins de quelques secondes : l’utilisateur doit savoir son niveau de progression, ce qu’il peut faire ensuite et comment utiliser le CLI. Toutes les pages authentifiées doivent partager le même shell, les mêmes conventions de titre, les mêmes états de chargement et les mêmes liens de sortie.

Les interactions doivent privilégier les transitions courtes, les états hover/focus visibles, la navigation clavier et le respect de `prefers-reduced-motion`. Le responsive doit conserver les actions essentielles sur mobile sans reproduire une sidebar miniature illisible.
