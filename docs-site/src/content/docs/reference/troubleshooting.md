---
title: Dépannage
description: Résoudre les problèmes courants rencontrés avec Codojo.
---

## La commande `codojo` est introuvable

Vérifiez que le paquet global est installé et que le répertoire des binaires NPM est présent dans votre `PATH` :

```bash
npm install --global @codojo/cli
npm prefix --global
```

Fermez puis rouvrez votre terminal si votre gestionnaire Node.js vient d’être configuré.

## Le token est refusé

Reconnectez-vous avec `codojo login`. Si le problème persiste, vérifiez que le token n’a pas été révoqué depuis votre profil Web et que `CODOJO_API_URL` pointe vers la bonne instance.

## Un challenge est verrouillé

Un challenge verrouillé n’est pas encore disponible dans votre progression. Revenez au catalogue et ouvrez le prochain challenge accessible au lieu de forcer une soumission directe.

## La mise à jour échoue

Relancez la commande avec un registre NPM accessible :

```bash
codojo update
```

Une erreur de permission indique généralement que le préfixe global NPM n’est pas accessible en écriture. Préférez un gestionnaire de versions Node.js ou une configuration de préfixe utilisateur à l’exécution de commandes avec des privilèges administrateur.

## Le réseau est indisponible

Les commandes qui nécessitent l’API Codojo ou NPM peuvent échouer lorsqu’elles doivent récupérer des données distantes. La notification de mise à jour est conçue pour rester silencieuse dans ce cas ; vous pouvez continuer à utiliser les fonctions locales de la CLI.

Si vous trouvez un comportement reproductible, ouvrez une issue dans le [dépôt GitHub](https://github.com/Ekole237/js-challenge) en retirant au préalable tout token, credential ou donnée personnelle.
