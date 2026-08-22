---
title: Authentification CLI
description: Connecter la CLI Codojo à votre compte avec un token API.
---

La CLI utilise un token API pour accéder au catalogue, charger les challenges et envoyer les soumissions associées à votre compte.

## Générer un token

Lancez :

```bash
codojo login
```

La commande ouvre votre profil Codojo. Générez un token dans la section dédiée, copiez-le immédiatement, puis collez-le dans le terminal. Le secret est affiché une seule fois lors de sa création.

Pour fournir le token directement, utilisez un argument positionnel :

```bash
codojo login <token>
```

Dans un environnement sans navigateur, utilisez :

```bash
codojo login --no-browser
```

## Stockage local

La configuration est enregistrée dans :

```text
${XDG_CONFIG_HOME:-~/.config}/codojo/config.json
```

Le fichier contient le token et l’URL de l’API avec des permissions strictes. Ne le commitez jamais et ne copiez pas son contenu dans un ticket ou une capture d’écran.

## Se déconnecter

Pour supprimer le token local :

```bash
codojo logout
```

Cette commande ne révoque pas le token côté serveur. Pour empêcher toute utilisation future, révoquez-le également depuis votre profil Web.
