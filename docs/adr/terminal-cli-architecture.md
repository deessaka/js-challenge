# ADR — Client terminal et TUI interactif pour Codojo

> Le modèle d’édition, la navigation entre vues et les raccourcis décrits ici sont remplacés par [ADR-0004](./0004-integrated-terminal-editor-engine.md). Les décisions API, stockage du token et distinction dry-run/soumission restent applicables.

## Contexte et Décision

Le client terminal est le frontend principal de Codojo. L’implémentation canonique utilise Ink et propose :

1. **Une interface TUI interactive (`codojo`)** intégrant un explorateur d'exercices, les consignes, un éditeur de code et les résultats de tests.
2. **Une navigation clavier par vues Ink** compatible avec les terminaux courants.
3. **Un mode scriptable classique (`codojo <cmd>`)** pour automatiser les flux de travail en ligne de commande.
4. **Une distinction claire entre vérification serveur non persistée (`dryRun: true`) et soumission officielle (`dryRun: false)`**.

## Architecture de l'application TUI

Cette section est historique. L’architecture actuelle des vues terminal et du moteur headless est définie par [ADR-0004](./0004-integrated-terminal-editor-engine.md).

## Raccourcis et actions

Le contrat clavier historique est remplacé intégralement par celui de [l’ADR-0004](./0004-integrated-terminal-editor-engine.md). Cette ADR ne doit pas servir de référence pour l’édition, la navigation ou les raccourcis actuels.

## Stockage local et Sécurité

Le jeton API est stocké dans `${XDG_CONFIG_HOME:-~/.config}/codojo/config.json` avec des permissions `0600`. Les routes API sont protégées par token Bearer et exemptées de la validation CSRF des requêtes Web navigateur.
