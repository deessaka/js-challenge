# ADR — Client terminal et TUI interactif pour Codojo

> Le modèle d’édition, la navigation entre vues et les raccourcis décrits ici sont remplacés par [ADR-0004](./0004-integrated-terminal-editor-engine.md). Les décisions API, stockage du token et distinction dry-run/soumission restent applicables.

## Contexte et Décision

Le client terminal est le frontend principal de Codojo. L’implémentation canonique utilise Ink et propose :

1. **Une interface TUI interactive (`codojo`)** intégrant un explorateur d'exercices, les consignes, un éditeur de code et les résultats de tests.
2. **Une navigation clavier par vues Ink** compatible avec les terminaux courants.
3. **Un mode scriptable classique (`codojo <cmd>`)** pour automatiser les flux de travail en ligne de commande.
4. **Une distinction claire entre vérification serveur non persistée (`dryRun: true`) et soumission officielle (`dryRun: false)`**.

## Architecture de l'application TUI

L’ancienne implémentation ANSI parallèle a été retirée afin de conserver un seul frontend testable et maintenable.

```text
┌─────────────────────────────────┬──────────────────────────────────┬─────────────────────────────────┐
│ 📂 EXERCICES (Arbre)            │ 📖 CONSIGNES & OBJECTIFS         │ 💻 ÉDITEUR DE CODE JS           │
│  ● 1. Personnes dans le bus     │  Énoncé détaillé, règles,        │   Code avec coloration          │
│  🔒 2. Nombre de moutons        │  exemples et indices             │   et auto-indentation           │
│  🔒 3. Premier et dernier car   │                                  ├─────────────────────────────────┤
│                                 │                                  │ 🧪 CONSOLE & VALIDATION         │
│                                 │                                  │   [Ctrl+T: Test │ Ctrl+S: Submit]│
└─────────────────────────────────┴──────────────────────────────────┴─────────────────────────────────┘
```

## Raccourcis et Actions

- **`Ctrl + T` ou `F5`** : Vérification serveur non persistée (_dry-run_, sans impacter la base de données).
- **`Ctrl + S` ou `F6`** : Validation et enregistrement officiel en base.
- **`Tab` / `Shift + Tab`** : Navigation circulaire de focus entre panneaux.
- **`j` / `k` ou `↑` / `↓`** : Navigation clavier dans l'arbre d'exercices.

## Stockage local et Sécurité

Le jeton API est stocké dans `${XDG_CONFIG_HOME:-~/.config}/codojo/config.json` avec des permissions `0600`. Les routes API sont protégées par token Bearer et exemptées de la validation CSRF des requêtes Web navigateur.
