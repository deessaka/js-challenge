# ADR — Client terminal et TUI interactif pour JS Challenge

## Contexte et Décision

Remplacer l'extension VS Code par un client terminal polyvalent proposant :
1. **Une interface TUI interactive plein écran (`js-ch`)** intégrant un explorateur d'exercices, les consignes complètes, un éditeur de code JavaScript avec coloration syntaxique et une console de tests en temps réel.
2. **Un support complet de la souris (SGR Extended Mouse Tracking)** pour naviguer, cliquer et faire défiler chaque panneau.
3. **Un mode scriptable classique (`js-ch <cmd>`)** pour automatiser les flux de travail en ligne de commande.
4. **Une distinction claire entre vérification locale (`dryRun: true`) et soumission officielle (`dryRun: false`)**.

## Architecture de l'application TUI

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

- **`Ctrl + T` ou `F5`** : Test d'évaluation en console (*Dry-run*, sans impacter la base de données).
- **`Ctrl + S` ou `F6`** : Validation et enregistrement officiel en base.
- **`Tab` / `Shift + Tab`** : Navigation circulaire de focus entre panneaux.
- **`j` / `k` ou `↑` / `↓`** : Navigation clavier dans l'arbre d'exercices.

## Stockage local et Sécurité

Le jeton API est stocké dans `${XDG_CONFIG_HOME:-~/.config}/js-challenge/config.json` avec des permissions `0600`. Les routes API sont protégées par token Bearer et exemptées de la validation CSRF des requêtes Web navigateur.
