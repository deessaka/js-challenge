---
title: Intégration VS Code
description: État actuel de l’intégration VS Code dans l’écosystème Codojo.
---

Le dépôt Codojo actuel centralise le parcours d’apprentissage dans l’application Web et la CLI terminal. Une extension VS Code complète n’est pas présente dans ce dépôt au moment de la rédaction de cette documentation.

## Ce qui est disponible aujourd’hui

Vous pouvez utiliser l’application Web pour consulter votre progression et la [CLI Codojo](/cli/installation/) pour travailler dans le terminal avec un éditeur intégré. Les deux interfaces s’appuient sur le même compte et les mêmes challenges publiés.

## Préparer une future intégration

Une extension VS Code pourra reprendre les mêmes étapes : authentification, catalogue, ouverture d’un challenge, exécution des tests et soumission. Elle devra respecter le contrat API v1 et les règles d’authentification du projet.

Cette page sera enrichie lorsque l’extension sera intégrée au dépôt ou publiée comme un paquet versionné. En attendant, ne suivez pas de procédure d’installation d’extension présentée comme officielle ici.
