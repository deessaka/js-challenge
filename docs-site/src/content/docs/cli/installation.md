---
title: Installer la CLI
description: Installer Codojo dans un terminal avec le paquet officiel NPM.
---

La CLI Codojo permet de parcourir les challenges et de travailler dans un éditeur terminal intégré. Elle expose les commandes `codojo` et `dojo`.

## Prérequis

Installez Node.js 22 ou une version ultérieure, puis vérifiez votre environnement :

```bash
node --version
npm --version
```

## Installation

Installez le paquet globalement avec NPM :

```bash
npm install --global @codojo/cli
```

Vérifiez ensuite que la commande est disponible :

```bash
codojo version
```

## Démarrer

Connectez-vous une première fois, puis lancez l’interface interactive :

```bash
codojo login
codojo
```

La CLI ouvre le profil Codojo pour vous permettre de générer un token. La procédure complète est décrite dans [Authentification](/cli/authentication/).
