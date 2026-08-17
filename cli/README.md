# JS Challenge (js-ch) — Client Terminal & TUI Interactif

JS Challenge fournit un client terminal complet et léger. Il peut être utilisé sous forme de **TUI interactive (style Neovim/Lazygit)** avec la commande `js-ch`, ou sous forme de **sous-commandes CLI scriptables** avec `js-ch <commande>` / `js-challenge <commande>`.

---

## Installation locale

Depuis la racine du projet ou le dossier `cli/` :

```bash
cd cli
npm install
npm run build
npm link
```

---

## 🖥️ Interface Interactive TUI (`js-ch`)

En exécutant simplement `js-ch` sans argument, l'interface interactive plein écran démarre :

```bash
js-ch
```

### Organisation de l'écran

- **Arbre des exercices (Gauche)** : Liste navigable des exercices avec badges de statut (✅ Terminé, ● Disponible, 🔒 Verrouillé) et points.
- **Consignes & Objectif (Centre)** : Énoncé complet, règles, exemples de tests et indices formatés avec défilement fluide.
- **Éditeur de code JavaScript (Haut Droite)** : Éditeur de code intégré avec coloration syntaxique, numérotation des lignes et gestion de l'indentation.
- **Console & Tests (Bas Droite)** : Retour d'exécution en direct, logs d'erreurs et validation des assertions unitaires.
- **Barre d'état (Bas)** : Utilisateur connecté, indicateur du panneau actif, raccourcis et notifications.

---

## ⌨️ Raccourcis Clavier & Souris

### Navigation
- **Souris** : Cliquez sur un exercice, positionnez le curseur dans l'éditeur, ou utilisez la molette de défilement pour naviguer dans l'arbre, les consignes ou la console.
- **`Tab` / `Shift+Tab`** : Bascule le focus entre l'arbre d'exercices, les consignes, l'éditeur et la console de test.
- **`↑` / `↓` ou `j` / `k`** : Déplace la sélection dans la liste des exercices ou fait défiler le panneau actif.
- **`Entrée`** : Charge l'exercice sélectionné et donne le focus à l'éditeur.

### Édition et Exécution
- **`Ctrl + T` ou `F5`** : **▶ Vérifier en console** — Exécute les tests côté serveur sans enregistrer de soumission ni altérer les statistiques (*dry-run non persistant*).
- **`Ctrl + S` ou `F6`** : **✓ Soumettre & Valider** — Enregistre la solution en base de données, accorde les points et débloque le challenge suivant.
- **`Ctrl + R`** : Actualise la liste des exercices et l'état de progression depuis l'API.
- **`q`, `Ctrl + Q` ou `Ctrl + C`** : Quitte proprement l'application et restaure le terminal.
- **`?`** : Affiche l'aide contextuelle des raccourcis.

---

## 💻 Commandes CLI (Mode Scriptable)

Vous pouvez aussi utiliser le CLI en ligne de commande directe :

```bash
# Authentification
js-ch login [token]
js-ch logout

# Exploration
js-ch list
js-ch next

# Préparation de fichier local
js-ch start mon-slug [--no-edit]

# Soumission d'un fichier
js-ch submit mon-slug [fichier.js]

# Liens utiles & Informations
js-ch dashboard
js-ch version
js-ch help
```

---

## 🔐 Authentification et Configuration

Le token API est stocké de manière sécurisée dans :

```text
${XDG_CONFIG_HOME:-~/.config}/js-challenge/config.json
```

Le fichier est généré avec des permissions strictes `0600`.

La TUI nécessite un terminal d’au moins `80x24`, gère le redimensionnement et respecte `NO_COLOR=1` pour un affichage monochrome. Les couleurs renforcent la hiérarchie mais ne portent jamais seules la signification d’un état.

L'URL de l'API peut être surchargée via la variable d'environnement :

```bash
export JS_CHALLENGE_API_URL=http://localhost:3333
```
