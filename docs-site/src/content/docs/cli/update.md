---
title: Mettre à jour la CLI
description: Installer la dernière version stable ou bêta de Codojo depuis NPM.
---

## Mise à jour disponible aujourd’hui

Pour mettre à jour la CLI publiée vers la dernière version stable, utilisez NPM :

```bash
npm install --global @codojo/cli@latest
```

Pour tester la version bêta publiée :

```bash
npm install --global @codojo/cli@beta
```

Le canal bêta peut contenir des changements encore en préparation. Pour revenir au canal stable, relancez la première commande.

## Commande intégrée

Une commande `codojo update` est en préparation dans le dépôt Codojo. Lorsqu’elle sera incluse dans une version publiée, elle offrira un raccourci vers la même installation globale et prendra en charge un canal explicite :

```bash
codojo update
codojo update --tag beta
```

Utilisez `codojo version` pour vérifier la version installée. La page des [commandes CLI](/cli/commands/) distingue les commandes déjà publiées de cette évolution à venir.

## Vérification automatique

La version intégrée prévoit aussi une vérification opportuniste des nouvelles versions. Elle ne doit pas bloquer votre commande et doit rester silencieuse si le réseau ou le registre NPM est indisponible.

Lorsque cette fonctionnalité sera publiée, vous pourrez désactiver la notification avec :

```bash
CODOJO_NO_UPDATE_CHECK=1 codojo
```

Les environnements CI seront également ignorés afin de ne pas ajouter de requêtes réseau ni de sortie inattendue aux pipelines.

## Permissions

Une installation globale peut nécessiter les permissions adaptées à votre installation Node.js. NPM ne doit pas être exécuté avec des privilèges administrateur par défaut. Préférez un gestionnaire de versions Node.js ou un préfixe NPM utilisateur si le répertoire global n’est pas accessible en écriture.
