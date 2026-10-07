# Règles de sécurité et de contribution

## État et activation

Les JSON dans `.github/rulesets/` sont des configurations à importer dans Settings → Rules → Rulesets. Leur présence dans Git ne les active pas. Avant l'activation, attendre les premiers résultats des trois checks requis et importer chaque fichier. L'ancien ruleset `ekodev` ne cible aucune branche (liste include vide).

Après fusion des workflows sur main et disponibilité d'un autre mainteneur de confiance, un administrateur connecté avec le CLI officiel peut appliquer les configurations avec `bash scripts/apply-repository-rules.sh`. Le script refuse d'activer les règles avant la présence de CODEOWNERS et du scan sur main, puis crée ou actualise les rulesets par nom. Il ne configure pas les environnements ni les permissions Actions.

## Branches

Toutes les branches : suppression et force push bloqués, sans bypass. Cela bloque aussi le nettoyage des branches de travail ; supprimer une branche exige une modification explicite du ruleset par un administrateur. Les commits ordinaires restent possibles sur les branches de travail.

`main`, `develop`, `release/**` : pull request obligatoire, une approbation, approbations périmées annulées, dernière poussée approuvée par une autre personne, revue CODEOWNERS, discussions résolues, historique linéaire, branche à jour et checks GitHub Actions requis : `test-and-build`, `cli-test-and-build`, `secret-scan`. Utiliser squash merge.

Un auteur ne peut pas approuver sa propre PR. Le propriétaire unique doit ajouter un mainteneur de confiance disposant des droits appropriés et actualiser CODEOWNERS avant de pouvoir fusionner ses propres changements. Ne pas ajouter de bypass automatique pour les bots ou les administrateurs.

Tags `v*` et `cli-v*` : modifications et suppressions bloquées. La publication CLI vérifie l'ascendance sur main et la concordance tag/version.

## Réglages GitHub à activer

- Actions : token par défaut en lecture seule, création/approbation de PR par Actions désactivée ; approbation manuelle des workflows pour tous les contributeurs externes.
- Activer Dependabot alerts, security updates, secret scanning, push protection et signalement privé des vulnérabilités lorsque disponibles.
- Environnements `production` et `npm-release` : revue manuelle par un mainteneur de confiance, auto-approbation interdite, bypass administrateur désactivé. Limiter production à main, npm-release à main et aux tags cli-v*.
- Conserver les secrets de déploiement exclusivement dans l'environnement production. Aucune PR de fork ne doit recevoir de secret ou de token en écriture. Ne pas utiliser pull_request_target pour exécuter le code d'un fork.

## Garde-fous dans le code

Actions épinglées par SHA, permissions minimales, credentials Git non persistés, délais limités, scan de secrets des nouveaux commits avec valeurs masquées. Les anciens secrets identifiés nécessitent une rotation ; un scan différentiel ne constitue pas une remise à zéro de l'historique.

Le déploiement Render devient manuel via workflow_dispatch sur main, après réussite des jobs serveur et CLI. La publication npm exige également tests et validation de la source. Les protections d'environnements doivent être activées dans GitHub pour imposer la revue humaine.

## Revue et maintenance

Discuter les changements importants en issue. Garder les PR petites, fournir la validation et conserver les licences. Ne jamais fusionner une mise à jour majeure uniquement parce qu'un bot l'a proposée. Ne pas contourner un audit rouge. Les vulnérabilités existantes restent bloquantes jusqu'à correction vérifiée. Vérifier le canal de contact dans SECURITY.md avant l'appel public aux contributeurs.
