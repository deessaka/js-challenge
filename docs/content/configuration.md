---
title: Configurer la CLI
description: Emplacement du fichier de configuration, priorité des sources d’URL et cycle de vie du token CLI.
section: Outils
order: 21
---

# Configurer la CLI

La CLI stocke sa configuration dans un fichier local unique. Vous n’avez normalement rien à éditer à la main : `codojo login` et les variables d’environnement couvrent tous les cas courants.

## Emplacement du fichier

```
~/.config/codojo/config.json
```

Le chemin respecte la variable `XDG_CONFIG_HOME` si elle est définie. Le fichier contient l’URL de l’API (`apiBaseUrl`) et, après connexion, votre token. Ses permissions sont restreintes à votre utilisateur.

Si un ancien fichier `~/.config/js-challenge/config.json` existe encore (configuration du nom de projet précédent), la CLI le migre automatiquement vers le nouvel emplacement à la première utilisation.

## Priorité des sources d’URL

L’URL de l’API utilisée par une commande est résolue dans cet ordre — la première valeur définie gagne :

| Priorité | Source | Exemple |
| --- | --- | --- |
| 1 | Option `--api-url` | `codojo list --api-url https://…` |
| 2 | Variable `CODOJO_API_URL` | `CODOJO_API_URL=http://localhost:3333 codojo` |
| 3 | Variable `JS_CHALLENGE_API_URL` | Ancien nom, conservé pour compatibilité |
| 4 | Fichier de configuration | `apiBaseUrl` dans `config.json` |
| 5 | Valeur par défaut | `https://codojo.ekodevs.com` |

Pour travailler sur une instance locale pendant le développement :

```bash
CODOJO_API_URL=http://localhost:3333 codojo
```

## Cycle de vie du token

1. **Création** : `codojo login` ouvre votre profil Codojo dans le navigateur. Générez le token dans la section **Utiliser Codojo dans le terminal**.
2. **Affichage unique** : le token n’est montré qu’une seule fois, au moment de sa création. Copiez-le immédiatement.
3. **Stockage** : il est enregistré localement dans `config.json`. Il n’est transmis qu’à l’API Codojo.
4. **Révocation** : si vous suspectez une fuite, révoquez-le depuis votre profil puis relancez `codojo login`.

> Ne placez jamais le token dans un dépôt Git, une capture d’écran ou un script partagé. Voir [Sécurité et bonnes pratiques](/docs/security/).

## Dépannage

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| Erreur 401 sur chaque commande | Token absent, expiré ou révoqué | Relancer `codojo login` |
| Commande `codojo` introuvable | Paquet global hors `PATH` | Vérifier `npm config get prefix` et le `PATH` |
| Version trop ancienne refusée | Node.js < 22 | Mettre à jour Node.js puis `codojo version` |
| Connexion refusée en local | Instance non démarrée | Démarrer le serveur et vérifier `CODOJO_API_URL` |

## Pour aller plus loin

- [Utiliser la CLI](/docs/cli/) — commandes et flux de travail.
- [Sécurité et bonnes pratiques](/docs/security/) — protéger compte et token.
- [Commencer avec Codojo](/docs/getting-started/) — prérequis et premier exercice.
