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
    name: js-challenge
    env: node
    buildCommand: npm ci --include=dev && node ace build && vite build && node ace migration:run --force && node ace db:seed
    startCommand: node build/bin/server.js
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
        value: https://js-challenge.onrender.com
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

Le déploiement est automatiquement déclenché lorsque :
- Un push est effectué sur la branche `main`
- Une Pull Request est fusionnée dans `main`

## Difficultés Rencontrées et Solutions

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
   - Une pour la production (js-challenge.onrender.com)

**Configuration GitHub OAuth pour la Production :**
1. Aller sur https://github.com/settings/applications
2. Créer une nouvelle application OAuth
3. Configurer les URLs :
   - Homepage URL : `https://js-challenge.onrender.com`
   - Authorization callback URL : `https://js-challenge.onrender.com/oauth/github/callback`

**Variables d'Environnement Requises :**
```env
DOMAIN=https://js-challenge.onrender.com
GITHUB_CLIENT_ID=[votre_client_id]
GITHUB_CLIENT_SECRET=[votre_client_secret]
OAUTH_GITHUB_CALLBACK_URL=https://js-challenge.onrender.com/oauth/github/callback
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
DOMAIN=https://js-challenge.onrender.com
SESSION_DRIVER=cookie
```

### Process de Build

Le process de build sur Render suit ces étapes :
1. Installation des dépendances (incluant dev) : `npm ci --include=dev`
2. Build de l'application AdonisJS : `node ace build`
3. Build des assets Vite : `vite build`
4. Migrations de la base de données : `node ace migration:run --force`
5. Seeding des données : `node ace db:seed`

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
