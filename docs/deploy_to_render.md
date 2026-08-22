# Déployer une Application AdonisJS + Inertia sur Render

Ce guide détaille les étapes et les solutions pour déployer une application AdonisJS avec Inertia sur la plateforme Render.

## Prérequis

- Une application AdonisJS avec Inertia
- Un compte Render
- Un compte GitHub (si vous utilisez l'authentification OAuth)

## Configuration Initiale

### 1. Configuration du fichier render.yaml

Créez un fichier `render.yaml` à la racine de votre projet :

```yaml
services:
  - type: web
    name: codojo
    runtime: node
    buildCommand: npm ci --include=dev && npm run build && npx vite build
    # Render Free: pas de preDeployCommand. Les migrations idempotentes tournent au démarrage.
    # Seed manuel initial depuis le Shell Render : cd build && node bin/console.js db:seed
    startCommand: cd build && node bin/console.js migration:run --force && exec node bin/server.js
    healthCheckPath: /health
    envVars:
      - key: TZ
        value: UTC
      - key: HOST
        value: 0.0.0.0
      - key: PORT
        value: 10000
      - key: LOG_LEVEL
        value: info
      - key: DOMAIN
        value: https://codojo.ekodevs.com
      - key: PUBLIC_APP_URL
        value: https://codojo.ekodevs.com
      - key: NODE_ENV
        value: production
      - key: SESSION_DRIVER
        value: cookie
      # Variables sensibles synchronisées depuis le dashboard Render
      - key: APP_KEY
        sync: false
      - key: DB_HOST
        sync: false
      - key: DB_PORT
        sync: false
      - key: DB_USER
        sync: false
      - key: DB_PASSWORD
        sync: false
      - key: DB_DATABASE
        sync: false
      - key: GITHUB_CLIENT_ID
        sync: false
      - key: GITHUB_CLIENT_SECRET
        sync: false
```

## Configuration du Déploiement Automatique

### 1. Configuration du Webhook Render

1. Dans le dashboard Render, allez dans votre service
2. Cliquez sur "Settings"
3. Faites défiler jusqu'à "Deploy Hook"
4. Cliquez sur "Add Deploy Hook" pour générer une URL
5. Copiez l'URL générée

### 2. Configuration des Secrets GitHub

1. Dans votre dépôt GitHub, allez dans "Settings" > "Secrets and variables" > "Actions"
2. Ajoutez un nouveau secret :
   - Nom : `RENDER_DEPLOY_HOOK_URL`
   - Valeur : L'URL du webhook Render copiée précédemment

### 3. Workflow GitHub Actions

Le workflow `.github/workflows/production.yml` est configuré pour :

1. Exécuter les tests et la vérification de types
2. Construire l'application
3. Déclencher un déploiement sur Render via webhook

La CI est déclenchée lorsque :

- Une Pull Request cible `develop` ou `main`
- Un push est effectué sur `develop` ou `main`

Le déploiement de production est déclenché uniquement après un push validé sur `main`. La staging doit être reliée séparément à `develop` avec son propre service et son propre Deploy Hook.

## Limites du Free Tier

Le Web Service Free est adapté à un pilote ou à une staging publique, mais il peut se mettre en veille après une période d’inactivité et le premier accès peut donc être plus lent. Le quota d’heures gratuites doit également être surveillé. Il ne faut pas le présenter comme une disponibilité de production garantie.

Le contournement utilisé ici est volontairement simple : les migrations Lucid sont idempotentes et sont vérifiées au démarrage avant le serveur. Le seed reste manuel et unique. Lorsque Codojo aura une audience stable, passer à une instance payante permettra d’utiliser `preDeployCommand` et d’éviter cette étape au démarrage.

## Variables runtime obligatoires

`start/env.ts` valide les variables au démarrage du processus Adonis. Les variables suivantes doivent donc exister dans l’onglet **Environment** du Web Service Render, et pas uniquement dans `buildCommand` :

```env
APP_KEY=<généré ou saisi comme secret Render>
GITHUB_CLIENT_ID=<secret OAuth GitHub>
GITHUB_CLIENT_SECRET=<secret OAuth GitHub>
REDIS_HOST=<host interne du service Redis>
REDIS_PORT=<port interne du service Redis>
DB_HOST=<host PostgreSQL>
DB_PORT=<port PostgreSQL>
DB_USER=<utilisateur PostgreSQL>
DB_PASSWORD=<mot de passe PostgreSQL>
DB_DATABASE=<nom de la base>
```

Les valeurs factices injectées dans `buildCommand` servent uniquement à permettre la compilation de `node ace build` et de Vite. Elles ne remplacent jamais les variables runtime. Si Render affiche `EnvValidationException` après un build réussi, ouvrir le service Web, vérifier ces noms exactement et sauvegarder les secrets manquants avant de relancer le déploiement.

`APP_KEY` doit être stable entre les déploiements : utiliser `generateValue: true` lors de la création par Blueprint ou saisir une valeur secrète persistante dans Render. Il ne faut jamais générer une nouvelle clé à chaque démarrage.

Pour un service Redis déclaré dans le Blueprint, utiliser les propriétés Render du service (`property: host` et `property: port`, ou `property: connectionString` si le type de service l’impose). Le service Redis et le Web Service doivent appartenir au même Blueprint/environnement.

## Difficultés Rencontrées et Solutions

### 0. EnvValidationException après un build réussi

**Symptôme** : le build produit `build/ssr/*.js`, puis Adonis échoue avec `Missing environment variable "APP_KEY"`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `REDIS_HOST` ou `REDIS_PORT`.

**Cause** : les variables présentes dans la commande de build ne sont pas automatiquement des variables runtime du Web Service. Les secrets `sync: false` doivent être renseignés dans le Dashboard Render. Un Blueprint mis à jour ne remplit pas les secrets manuels à la place de l’utilisateur.

**Solution** : renseigner toutes les variables obligatoires dans **Environment**, vérifier que le Blueprint est bien synchronisé avec le bon service, puis relancer le déploiement. Ne pas affaiblir `start/env.ts` pour masquer une configuration de production incomplète.

### 1. Erreur de Build Vite

**Problème** : Le manifest Vite manquant en production

```
ENOENT: no such file or directory, open 'public/assets/vite/manifest.json'
```

**Solution** :

- Ajouter `vite build` dans la commande de build
- S'assurer que les dépendances de développement sont installées avec `--include=dev`

### 2. Mode Production

**Problème** : Erreur avec le flag `--production`

```
Unknown flag '--production'. The mentioned flag is not accepted by the command
```

**Solution** :

- Retirer le flag `--production` de la commande `node ace build`
- Utiliser la variable d'environnement `NODE_ENV=production` à la place

### 3. Configuration OAuth GitHub

**Problème** : URLs de callback différentes entre développement et production

**Solution** :

1. Créer deux applications OAuth GitHub :
   - Une pour le développement (localhost:3333)
   - Une pour la production (codojo.ekodevs.com)

**Configuration GitHub OAuth pour la Production :**

1. Aller sur https://github.com/settings/applications
2. Créer une nouvelle application OAuth
3. Configurer les URLs :
   - Homepage URL : `https://codojo.ekodevs.com`
   - Authorization callback URL : `https://codojo.ekodevs.com/oauth/github/callback`

**Variables d'Environnement Requises :**

```env
DOMAIN=https://codojo.ekodevs.com
GITHUB_CLIENT_ID=[votre_client_id]
GITHUB_CLIENT_SECRET=[votre_client_secret]
OAUTH_GITHUB_CALLBACK_URL=https://codojo.ekodevs.com/oauth/github/callback
```

**Important :**

- Les URLs doivent correspondre exactement entre GitHub OAuth et vos variables d'environnement
- Assurez-vous que le protocole (https) est correct
- Vérifiez qu'il n'y a pas de slash trailing à la fin des URLs

## Configuration Finale

### Variables d'Environnement Essentielles

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=10000
DOMAIN=https://codojo.ekodevs.com
PUBLIC_APP_URL=https://codojo.ekodevs.com
SESSION_DRIVER=cookie
```

### Process de Build

Le process de build sur Render Free suit ces étapes :

1. Installation des dépendances (incluant dev) : `npm ci --include=dev`
2. Build de l'application AdonisJS : `npm run build`
3. Build des assets Vite : `npx vite build`
4. Au démarrage, exécution des migrations idempotentes : `cd build && node bin/console.js migration:run --force`
5. Démarrage du serveur compilé depuis `build/` avec `exec node bin/server.js`

Le Free Tier ne fournit pas `preDeployCommand`. Le seed ne doit pas être placé dans `startCommand`, car Render peut redémarrer le service plusieurs fois. Exécute-le une seule fois depuis le Shell Render :

```bash
cd build && node bin/console.js db:seed
```

Le démarrage peut être plus lent après une mise en veille, puisque la migration est vérifiée à chaque réveil. Cette stratégie convient à un pilote étudiant à faible trafic ; une instance payante pourra ensuite déplacer la migration dans `preDeployCommand`.

### Health Check

Un endpoint `/health` est configuré pour permettre à Render de vérifier l'état de l'application.

## Bonnes Pratiques

1. **Sécurité** :
   - Ne jamais commiter les variables sensibles
   - Utiliser `sync: false` dans render.yaml pour les variables sensibles
   - Configurer les variables sensibles via le dashboard Render

2. **Performance** :
   - Optimiser le build en production
   - Utiliser le mode production pour Vite et AdonisJS

3. **Maintenance** :
   - Garder les dépendances à jour
   - Surveiller les logs sur Render pour détecter les problèmes
   - Configurer des alertes sur Render

## Conclusion

Le déploiement d'une application AdonisJS + Inertia sur Render nécessite une attention particulière à la configuration du build et des variables d'environnement. Les principales difficultés concernent la génération des assets Vite et la configuration OAuth, mais une fois correctement configuré, le déploiement devient automatique et fiable.

## Déploiement de la documentation Starlight

La documentation Codojo est un site statique indépendant situé dans `docs-site/`. Elle ne doit pas être servie par le serveur AdonisJS ni déployée avec le même hook que l’application principale.

Dans Render, créez un **Static Site** séparé relié au même dépôt GitHub. Utilisez les paramètres suivants :

| Paramètre Render      | Valeur                    |
| --------------------- | ------------------------- |
| Root Directory        | `docs-site`               |
| Build Command         | `npm ci && npm run build` |
| Publish Directory     | `dist`                    |
| Branche de production | `main`                    |
| Domaine personnalisé  | `docs.codojo.ekodevs.com` |

Le workflow `.github/workflows/docs.yml` construit la documentation sur les Pull Requests et les pushes vers `develop` ou `main` lorsque `docs-site/`, la navbar ou le workflow documentaire change. Le Static Site Render peut ensuite être relié à `main` pour publier automatiquement la version validée.

Dans la zone DNS du domaine `ekodevs.com`, ajoutez l’enregistrement demandé par Render pour `docs.codojo.ekodevs.com`. La valeur exacte dépend de la cible affichée par Render ; elle ne doit pas être inventée dans le dépôt. Vérifiez ensuite le certificat TLS, puis ouvrez directement `https://docs.codojo.ekodevs.com` et plusieurs chemins internes de la documentation.

Le domaine de l’application principale reste `https://codojo.ekodev.com`. Aucun secret de l’application, aucune variable de base de données et aucun hook `RENDER_DEPLOY_HOOK_URL` ne sont nécessaires au build statique de la documentation.
