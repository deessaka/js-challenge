# Issue tracker: GitHub

Les issues, spécifications et tickets de ce dépôt vivent dans GitHub Issues sur `Ekole237/js-challenge`. Utiliser `gh` depuis le clone local pour toutes les opérations.

## Conventions

- Créer une issue avec `gh issue create`.
- Lire une issue et ses commentaires avec `gh issue view <number> --comments`.
- Appliquer ou retirer les labels avec `gh issue edit`.
- Commenter avec `gh issue comment`.
- Fermer avec `gh issue close`.
- Les pull requests ne constituent pas une surface de triage.

## Publication

Lorsqu’une skill demande de publier une spécification ou un ticket, créer une GitHub Issue et appliquer le label `ready-for-agent`.

## Dépendances

Utiliser les dépendances natives GitHub Issues pour représenter les relations `blocked_by`.

Le paramètre `issue_id` attendu par l’API est l’identifiant numérique de base de données de l’issue bloquante, obtenu avec :

`gh api repos/Ekole237/js-challenge/issues/<number> --jq .id`

Si les dépendances natives ne sont pas disponibles, ajouter une section `Blocked by` contenant les références `#<number>`.
