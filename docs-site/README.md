# Codojo Docs

Documentation publique de l’écosystème Codojo, construite avec [Astro Starlight](https://starlight.astro.build/).

Le site de documentation sera publié sur [docs.codojo.ekodevs.com](https://docs.codojo.ekodevs.com). L’application principale reste disponible sur [codojo.ekodev.com](https://codojo.ekodev.com).

## Développement local

Depuis ce répertoire :

```bash
npm install
npm run dev
```

La preview est disponible sur `http://localhost:4321`. Les pages sont écrites en Markdown ou MDX dans `src/content/docs/`. La navigation se configure dans `astro.config.mjs`.

## Validation

Avant une Pull Request, exécutez :

```bash
npm run build
```

Le build produit un site statique dans `dist/`. Le pipeline GitHub Actions exécute cette même commande avec Node.js 24 et `npm ci`.

## Déploiement Render

Le site doit être configuré comme un **Static Site Render** séparé de l’application AdonisJS. Utilisez `docs-site` comme répertoire racine, `npm ci` comme installation, `npm run build` comme commande de build et `dist` comme répertoire de publication. Ajoutez ensuite `docs.codojo.ekodevs.com` comme domaine personnalisé et créez l’enregistrement DNS demandé par Render.

Les changements de contenu sont construits et contrôlés par `.github/workflows/docs.yml`. Le déploiement de production doit suivre le flux de la branche `main` du service Render documentaire ; il ne réutilise pas le hook de déploiement de l’application principale.

## Organisation du contenu

La documentation distingue le parcours de découverte, les challenges, la CLI, l’état de l’intégration VS Code, la progression et la référence. Les pages CLI doivent rester synchronisées avec `cli/README.md` et les commandes présentes dans le code. Toute fonctionnalité future doit être présentée comme telle et non comme une capacité déjà disponible.
