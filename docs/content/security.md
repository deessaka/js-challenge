---
title: Sécurité et bonnes pratiques
description: Les règles essentielles pour protéger votre compte, vos tokens et vos solutions.
section: Référence
order: 30
---

# Sécurité et bonnes pratiques

Codojo traite les solutions et les tokens comme des données sensibles. Même si les exercices sont pédagogiques, votre compte et vos identifiants doivent être protégés avec les mêmes réflexes que dans un projet réel.

## Protéger son token

Ne partagez jamais votre token CLI. Ne le placez pas dans un fichier suivi par Git, une capture d’écran, un message de commit ou une variable publique côté navigateur. Le token n’est affiché qu’une seule fois, lors de sa création ; si vous pensez qu’il a fuité, révoquez-le depuis votre profil puis générez-en un nouveau (voir [Configurer la CLI](/docs/configuration/)).

## Écrire du code d’exercice sûr

N’utilisez pas d’identifiants, de clés privées ou d’URLs internes dans une solution. Les tests doivent fonctionner avec les entrées prévues par le contrat de l’exercice et ne doivent pas tenter d’accéder au système de fichiers, au réseau ou à des processus externes.

## Signaler un problème

Si vous découvrez un comportement inattendu ou une faille, ne publiez pas de détails exploitables dans une issue publique. Préparez une description minimale, indiquez la page ou la commande concernée et transmettez le signalement au mainteneur par un canal privé.

## Règle éditoriale

Les pages de cette documentation sont versionnées dans le dépôt. Le contenu Markdown est converti en HTML avec une allowlist stricte et les routes `/docs` restent en lecture seule. Les URLs, attributs HTML, chemins de fichiers et slugs sont validés avant rendu.

## Pour aller plus loin

- [Configurer la CLI](/docs/configuration/) — stockage et révocation du token.
- [Soumettre une solution](/docs/submitting/) — ce qui est envoyé lors d’une validation.
- [Utiliser la CLI](/docs/cli/) — commandes et authentification.
