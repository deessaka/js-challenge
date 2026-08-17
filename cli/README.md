# JS Challenge CLI

Le CLI est le client local léger de JS Challenge. Il fonctionne dans un terminal, consomme l’API `/api/v1` et utilise l’éditeur de texte déjà installé sur la machine. Il ne contient pas d’interface IDE et n’installe pas Vim ou Neovim automatiquement.

## Installation locale

```bash
cd cli
npm install
npm run build
npm link
```

Une fois le package lié, la commande suivante est disponible :

```bash
js-challenge help
```

## Parcours principal

```bash
js-challenge login
js-challenge list
js-challenge next
js-challenge start mon-slug
js-challenge submit mon-slug
js-challenge dashboard
```

`start` crée le fichier JavaScript du challenge dans le dossier courant puis ouvre l’éditeur. Le CLI cherche l’éditeur dans l’ordre `JSC_EDITOR`, `VISUAL`, `EDITOR`, `nvim`, `vim`, puis `vi`. Il est donc possible d’utiliser Neovim sans configuration supplémentaire :

```bash
export EDITOR=nvim
```

Le CLI ne remplace jamais un fichier existant et ne décide pas de la réussite d’un exercice. `submit` envoie le contenu au serveur, qui exécute les tests et synchronise la progression.

## Authentification et configuration

Le MVP demande un token API au login et le stocke dans :

```text
${XDG_CONFIG_HOME:-~/.config}/js-challenge/config.json
```

Le fichier est créé avec des permissions `0600`. Le token ne doit pas être placé dans un workspace, un `.env` ou un fichier challenge.

L’URL API peut être configurée avec :

```bash
export JS_CHALLENGE_API_URL=https://challenge.example.com
```

## Limites du MVP

Le login utilise encore un token saisi dans le terminal. Une future version pourra ouvrir le navigateur et utiliser OAuth 2.0 + PKCE. La validation reste synchrone côté API dans cette première version ; l’exécution devra évoluer vers un worker isolé lorsque le volume augmentera.
