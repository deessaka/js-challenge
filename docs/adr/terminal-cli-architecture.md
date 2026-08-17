# ADR — Client terminal léger pour JS Challenge

## Décision

Remplacer l’extension VS Code par un CLI terminal indépendant. Le CLI orchestre l’authentification, la sélection des challenges, la création des fichiers, l’ouverture de l’éditeur configuré et la soumission serveur. Il ne fournit pas lui-même un éditeur complet.

Le choix d’éditeur suit cet ordre : `JSC_EDITOR`, puis `$VISUAL`, puis `$EDITOR`, puis détection de `nvim`, `vim` et `vi`. Le CLI ne doit pas installer Vim automatiquement. Il doit détecter l’absence d’éditeur et afficher une instruction d’installation claire.

## Raisons

Un CLI reste utilisable sur SSH, dans un conteneur, sur une machine peu puissante et dans n’importe quel terminal. Il respecte les habitudes de développement existantes et évite de reconstruire une interface d’IDE. Vim et Neovim deviennent des dépendances optionnelles de l’utilisateur, non des composants embarqués dans JS Challenge.

## Parcours cible

```text
js-challenge login
        ↓
js-challenge list
        ↓
js-challenge start <slug>
        ↓
éditeur configuré ($EDITOR ou Neovim/Vim)
        ↓
js-challenge submit <slug ou fichier>
        ↓
résultat serveur et progression synchronisée
```

## Stockage local

Le token est conservé dans `${XDG_CONFIG_HOME:-~/.config}/js-challenge/config.json` avec des permissions `0600`. Sur les plateformes disposant d’un keychain natif, une implémentation ultérieure pourra utiliser le trousseau système. Le CLI ne doit jamais écrire le token dans le workspace, dans `.env` ou dans un fichier challenge.

## Contrat API

Le CLI consomme exclusivement les endpoints `/api/v1`. Le client est identifié comme `terminal` dans les soumissions. La validation officielle reste serveur ; une vérification locale de syntaxe peut être ajoutée comme confort, mais ne doit jamais marquer un challenge comme réussi.

## Migration

Le dossier `vscode-extension` est retiré du produit actif. Le nouveau dossier `cli` reprend uniquement la logique HTTP et le workflow métier utiles. Les routes API restent inchangées à l’exception de l’acceptation de `client: terminal` dans les soumissions.
