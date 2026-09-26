# Contribuer à Codojo

Merci de l'intérêt que tu portes à Codojo ! Ce guide explique comment contribuer, que ce soit pour corriger un bug, ajouter un exercice ou améliorer une fonctionnalité.

## Table des matières

- [Code de conduite](#code-de-conduite)
- [Prérequis](#prérequis)
- [Installation locale](#installation-locale)
- [Types de contributions](#types-de-contributions)
- [Ajouter un exercice](#ajouter-un-exercice)
- [Conventions de code](#conventions-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signaler un bug](#signaler-un-bug)

## Code de conduite

Ce projet respecte le [Contributor Covenant](./CODE_OF_CONDUCT.md). En participant, tu t'engages à respecter ces règles.

## Prérequis

- Node.js >= 20 (voir `.nvmrc`)
- PostgreSQL >= 14
- Redis >= 7
- npm >= 10

## Installation locale

```bash
# 1. Forker puis cloner le repo
git clone https://github.com/<ton-username>/js-challenge.git
cd js-challenge

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec tes valeurs (DB, Redis, clés...)

# 4. Lancer les migrations et le seed
node ace migration:run
SEED_TEST_USER_PASSWORD='choisir-un-mot-de-passe-local' node ace db:seed

# 5. Démarrer le serveur de développement
npm run dev
```

Le compte de test `codojo_test_user` n'est créé que si `SEED_TEST_USER_PASSWORD` est défini et n'est jamais créé lorsque `NODE_ENV=production`. Ne mettez pas ce mot de passe dans Git.

Pour le CLI :

```bash
cd cli
npm install
npm run build
```

## Types de contributions

| Type | Description |
|------|-------------|
| 🐛 Bug fix | Correction d'un comportement incorrect |
| ✨ Feature | Nouvelle fonctionnalité discutée en issue |
| 📝 Documentation | Amélioration des docs ou des contrats d'exercices |
| 🧩 Exercice | Ajout d'un nouvel exercice JavaScript |
| 🌐 Traduction | Traduction d'un exercice en anglais |

## Ajouter un exercice

Un exercice Codojo est composé de trois parties :

### 1. Le contrat (`docs/contracts/`)

Créer un fichier `docs/contracts/<numero>-<slug>.md` qui décrit :
- L'analyse de la consigne
- Le contrat (ce qu'on teste)
- Des exemples d'entrée/sortie
- Le starter code

Consulter `docs/contracts/001-nombre-de-personnes-dans-le-bus.md` comme référence.

### 2. Le test (`tests/exercises/`)

Créer `tests/exercises/Exercice<numero>.test.js` avec des cas Jest couvrant :
- Le cas nominal
- Les cas limites (tableau vide, valeurs nulles, grands nombres...)

### 3. Le seeder

Ajouter l'exercice dans `database/seeders/exercice_seeder.ts` avec ses métadonnées (titre, description, difficulté, points, catégorie, starterCode).

### Numérotation

Utiliser le prochain numéro disponible dans la séquence. Vérifier les exercices existants dans `database/seeders/exercice_seeder.ts`.

## Conventions de code

### Branches

```
feat/<description>        # nouvelle fonctionnalité
fix/<description>         # correction de bug
docs/<description>        # documentation uniquement
exercise/<numero>-<slug>  # nouvel exercice
```

### Commits (Conventional Commits)

```
feat(api): add locale resolution service
fix(cli): correct fallback display on missing translation
docs(contracts): add exercise 162 contract
exercise(162): add "tri par insertion" exercise
```

### Style

- TypeScript strict pour le serveur et le CLI
- ESLint + Prettier configurés (`.eslintrc`, `.prettierrc`)
- Lancer `npm run lint` avant de soumettre

## Processus de Pull Request

1. Forker le repo et créer une branche depuis `main`
2. Implémenter le changement avec des tests
3. S'assurer que tous les tests passent : `npm test`
4. Pour le CLI : `cd cli && npm test`
5. Soumettre la PR sur `main` en remplissant le template
6. Attendre la revue — les mainteneurs répondent sous 5 jours ouvrés

Les PRs sans tests associés ou qui cassent les tests existants ne seront pas mergées.

## Signaler un bug

Utiliser le [template de bug report](.github/ISSUE_TEMPLATE/bug_report.yml) sur GitHub Issues.

Pour les vulnérabilités de sécurité, **ne pas ouvrir une issue publique** — voir [SECURITY.md](./SECURITY.md).
