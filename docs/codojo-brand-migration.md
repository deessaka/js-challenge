# Migration de marque vers Codojo

## Identité publique

L’application s’appelle désormais **Codojo**. Le produit est présenté comme un dojo d’apprentissage et de pratique du code, avec des exercices guidés, une progression visible et un client terminal.

L’URL de production prévue est :

```text
https://codojo.ekodevs.com
```

Le backend Web, le dashboard Inertia et l’API v1 restent servis par la même application. Les routes `/api/v1/*` et les slugs historiques des exercices sont conservés pour éviter de casser les clients existants.

## Configuration Web et OAuth

Les variables publiques recommandées sont :

```env
DOMAIN=https://codojo.ekodevs.com
PUBLIC_APP_URL=https://codojo.ekodevs.com
```

Le callback GitHub OAuth de production doit être exactement :

```text
https://codojo.ekodevs.com/oauth/github/callback
```

La staging doit utiliser un domaine et une application OAuth séparés.

## Installation du CLI

Le package CLI est désormais préparé sous le nom `@codojo/cli` :

```bash
npm install --global @codojo/cli
codojo login
codojo
```

Le package expose les binaires `codojo` et `dojo`. Les commandes `js-ch` et `js-challenge` sont conservées temporairement comme aliases de compatibilité.

Le CLI utilise par défaut :

```text
https://codojo.ekodevs.com
```

Pour un environnement local ou de staging :

```bash
CODOJO_API_URL=http://localhost:3333 codojo
```

Les tokens sont stockés dans :

```text
${XDG_CONFIG_HOME:-~/.config}/codojo/config.json
```

Le CLI lit encore l’ancien chemin `${XDG_CONFIG_HOME:-~/.config}/js-challenge/config.json` et migre automatiquement son contenu vers le nouveau chemin avec les permissions `0600`.

## Publication npm

La publication n’est pas déclenchée à chaque commit. Le workflow `.github/workflows/cli-release.yml` peut publier le package lorsqu’un tag `cli-v*` est créé ou depuis une exécution manuelle. Avant la première publication, le scope npm `@codojo` doit être contrôlé et le Trusted Publishing npm doit être configuré pour le dépôt GitHub.

## Compatibilité

Les identifiants internes historiques comme le nom du dépôt, les routes API, les tables et les slugs ne sont pas renommés automatiquement. Cette conservation permet d’introduire Codojo sans migration destructive ni rupture des installations existantes.
