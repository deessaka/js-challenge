# Codojo — Client Terminal & TUI Interactif

Codojo fournit un client terminal complet et léger. Il peut être utilisé sous forme de **TUI interactive** avec la commande `codojo`, ou sous forme de **sous-commandes CLI scriptables** avec `codojo <commande>`. Les anciennes commandes `js-ch` et `js-challenge` restent disponibles comme aliases de transition.

---

## Installation locale

Pour utiliser la version publiée :

```bash
npm install --global @codojo/cli
codojo
```

Pour développer localement depuis la racine du projet ou le dossier `cli/` :

```bash
cd cli
npm install
npm run build
npm link
```

---

## 🖥️ Interface Interactive TUI (`codojo`)

En exécutant simplement `codojo` sans argument, l'interface interactive plein écran démarre :

```bash
codojo
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

- **`Ctrl + T` ou `F5`** : **▶ Vérifier en console** — Exécute les tests côté serveur sans enregistrer de soumission ni altérer les statistiques (_dry-run non persistant_).
- **`Ctrl + S` ou `F6`** : **✓ Soumettre & Valider** — Enregistre la solution en base de données, accorde les points et débloque l’exercice suivant.
- **`Ctrl + R`** : Actualise la liste des exercices et l'état de progression depuis l'API.
- **`q`, `Ctrl + Q` ou `Ctrl + C`** : Quitte proprement l'application et restaure le terminal.
- **`?`** : Affiche l'aide contextuelle des raccourcis.

---

## 💻 Commandes CLI (Mode Scriptable)

Vous pouvez aussi utiliser le CLI en ligne de commande directe :

```bash
# Authentification — ouvre le profil dans le navigateur si aucun token n'est fourni
codojo login [token]
codojo login --no-browser
codojo logout

# Exploration
codojo list
codojo next

# Préparation de fichier local
codojo start mon-slug [--no-edit]

# Soumission d'un fichier
codojo submit mon-slug [fichier.js]

# Liens utiles & Informations
codojo dashboard
codojo version
codojo help
```

---

## 🔐 Authentification et Configuration

Pour connecter le terminal, exécutez simplement :

```bash
codojo login
```

La commande ouvre le profil Web dans le navigateur. Connectez-vous si nécessaire, ouvrez la section **Utiliser Codojo dans le terminal**, cliquez sur **Générer un token**, copiez le secret affiché une seule fois, puis collez-le dans le terminal. Si l'ouverture automatique du navigateur n'est pas disponible, utilisez l'URL imprimée par la commande. Le mode `codojo login --no-browser` désactive explicitement l'ouverture automatique.

La TUI affiche le même parcours lorsqu'elle démarre sans token. Le token API est ensuite stocké de manière sécurisée dans :

```text
${XDG_CONFIG_HOME:-~/.config}/codojo/config.json (migration automatique depuis l’ancien chemin `js-challenge`)
```

Le fichier est généré avec des permissions strictes `0600`.

La TUI nécessite un terminal d’au moins `80x24`, gère le redimensionnement et respecte `NO_COLOR=1` pour un affichage monochrome. Les couleurs renforcent la hiérarchie mais ne portent jamais seules la signification d’un état. Après une vérification ou une soumission, **SORTIE CONSOLE** affiche les `console.log()` du code exécuté, tandis que **RÉSULTATS DE VALIDATION** affiche uniquement les assertions passées ou échouées.

L'URL de l'API peut être surchargée via la variable d'environnement :

```bash
export CODOJO_API_URL=http://localhost:3333
```
