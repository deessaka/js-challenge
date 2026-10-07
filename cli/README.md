# Codojo CLI

Le client terminal officiel de [Codojo](https://codojo.ekodevs.com), le dojo d’entraînement aux katas JavaScript. Les commandes `codojo` et `dojo` sont équivalentes.

## Prérequis et installation

La CLI nécessite Node.js 22 ou une version ultérieure. L’installation publiée utilise le paquet npm et se connecte à la production par défaut :

```bash
npm install --global @codojo/cli@latest
codojo --version
codojo login
codojo
```

Pour tester la beta :

```bash
npm install --global @codojo/cli@beta
codojo --version
```

La version affichée par `codojo --version`, `codojo -v` et `codojo version` correspond à la version du paquet installé.

## Commandes principales

```text
codojo                           Lance l’interface interactive TUI
codojo login                     Enregistre un token avec une saisie masquée
codojo login --token-stdin        Lit un token fourni par stdin pour les scripts
codojo logout                    Supprime le token du profil actif
codojo list                      Liste les exercices disponibles
codojo next                      Affiche le prochain exercice
codojo start <slug>              Ouvre directement l’éditeur sur l’exercice
codojo submit <slug> [code.js]   Soumet et teste le code
codojo export <slug>             Imprime la solution locale de l’exercice
codojo dashboard                 Indique l’accès au tableau de bord
codojo doctor                   Affiche le contexte actif sans host par défaut
codojo update [--tag latest|beta] Met à jour l’installation globale depuis NPM
codojo --version                 Affiche la version et quitte
codojo --help                   Affiche l’aide et quitte
```

Les options courantes sont `--environment production|development|staging`, `--api-url <url>`, `--no-browser`, `--token-stdin` pour `login` et `--print-url` pour les commandes qui proposent un lien. Les tokens ne doivent pas être passés dans la ligne de commande : ils peuvent rester dans l’historique du shell ou être visibles par d’autres processus. Pour un script, fournissez-les par l’entrée standard avec `printf '%s\\n' "$CODOJO_TOKEN" | codojo login --no-browser --token-stdin`.

La CLI vérifie discrètement les mises à jour hors CI. Utilisez `codojo update` pour installer la version stable ou `codojo update --tag beta` pour le canal bêta. La vérification automatique peut être désactivée avec `CODOJO_NO_UPDATE_CHECK=1`.

## Environnements isolés

La CLI utilise la production lorsqu’aucun environnement n’est précisé. Le démarrage d’une instance locale de Codojo ne modifie jamais ce choix.

| Usage                        | Commande                                       | Endpoint                     | Profil de credentials |
| ---------------------------- | ---------------------------------------------- | ---------------------------- | --------------------- |
| Production live              | `codojo`                                       | `https://codojo.ekodevs.com` | `production`          |
| Développement local          | `CODOJO_ENV=development codojo`                | `http://localhost:3333`      | `development`         |
| Staging                      | `CODOJO_ENV=staging codojo`                    | `CODOJO_STAGING_API_URL`     | `staging`             |
| Source locale sans ambiguïté | `CODOJO_ENV=development node cli/dist/main.js` | `http://localhost:3333`      | `development`         |

Pour utiliser une autre instance locale, indiquez explicitement les deux éléments :

```bash
CODOJO_ENV=development \
CODOJO_DEV_API_URL=http://127.0.0.1:4444 \
codojo
```

Un endpoint staging doit être HTTPS et être déclaré explicitement :

```bash
CODOJO_ENV=staging \
CODOJO_STAGING_API_URL=https://staging.example.test \
codojo
```

Les endpoints production exigent exactement `https://codojo.ekodevs.com`. Les endpoints development sont limités à `localhost`, `127.0.0.1` ou `::1`. Les endpoints personnalisés ne sont pas acceptés implicitement, et un override historique `CODOJO_API_URL` ou `JS_CHALLENGE_API_URL` doit être confirmé avec `CODOJO_ENV`.

## Configuration et tokens

Les credentials ne sont pas partagés entre environnements. Ils sont stockés dans des profils distincts :

```text
${XDG_CONFIG_HOME:-~/.config}/codojo/profiles/production.json
${XDG_CONFIG_HOME:-~/.config}/codojo/profiles/development.json
${XDG_CONFIG_HOME:-~/.config}/codojo/profiles/staging.json
```

Le répertoire est créé avec des permissions restrictives et chaque profil est écrit atomiquement avec des permissions `0600`. `codojo login` valide le token via l’API sélectionnée avant de le sauvegarder dans le profil actif. `codojo logout` ne supprime que le token du profil actif.

Une ancienne configuration `~/.config/codojo/config.json` ou `~/.config/js-challenge/config.json` n’est migrée que si son endpoint correspond sans ambiguïté au profil actif. Un endpoint local n’est jamais copié vers le profil production.

## Vérifier le binaire utilisé

Le même nom de commande peut désigner une installation npm globale, une version beta ou une copie locale liée au dépôt. Avant un test live, vérifiez le chemin résolu :

```bash
which codojo
type -a codojo
npm prefix --global
npm ls --global @codojo/cli
codojo doctor
```

Pour tester le code local, préférez un appel explicite depuis le dépôt :

```bash
npm --prefix cli run build
CODOJO_ENV=development node cli/dist/main.js --version
CODOJO_ENV=development node cli/dist/main.js --help
```

Évitez `npm link` pour le test de production : selon l’ordre du `PATH`, il peut faire pointer `codojo` vers le dossier source au lieu du paquet global. Si un alias de développement est nécessaire, utilisez un nom distinct comme `codojo-dev` ou appelez directement `node cli/dist/main.js`.

## Interface interactive

Lancez `codojo` ou `dojo` sans argument. La TUI conserve ses cinq vues terminal : catalogue, consignes, éditeur, tests et aide. Les raccourcis principaux sont `Ctrl+1` à `Ctrl+4`, `?`, `/` ou `Ctrl+F` pour rechercher, `f` pour filtrer, `Ctrl+T` pour tester, `Ctrl+S` pour sauvegarder, `Ctrl+E` pour soumettre, `Échap` pour revenir et `Ctrl+Q` ou `Ctrl+C` pour quitter.

L’en-tête indique uniquement `PRODUCTION`, `DEVELOPMENT` ou `STAGING`, sans afficher le host ou le port. Une URL n’est montrée que lorsqu’elle est explicitement demandée avec `--print-url` ou lorsqu’elle est indispensable après un échec d’ouverture du navigateur.

## Développement et publication

Depuis le dossier `cli/` :

```bash
npm install
npm test
npm run build
npm pack --dry-run
```

Avant une publication beta, construisez depuis un arbre propre et vérifiez au minimum :

```bash
npm run build
node dist/main.js --version
node dist/main.js --help
npm pack --dry-run
```

Installez ensuite le tarball dans un préfixe temporaire pour vérifier le binaire réellement livré, puis publiez avec le tag beta. La promotion vers `latest` doit intervenir seulement après le smoke test de `codojo --version`, `codojo --help`, `codojo login --no-browser` et un appel authentifié contrôlé.

## Licence

[MIT](LICENSE)
