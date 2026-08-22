---
title: Comprendre les exercices
description: Lire une consigne, tester une solution et interpréter le résultat de validation.
section: Exercices
order: 10
---

# Comprendre les exercices

Chaque exercice Codojo cible une compétence JavaScript précise. Le catalogue indique le titre, la difficulté (Facile, Moyen, Difficile), les points et l’état de progression.

## Les états principaux

| État       | Signification                                                   |
| ---------- | --------------------------------------------------------------- |
| Disponible | L’exercice peut être ouvert et travaillé.                        |
| Verrouillé | Un exercice précédent doit être terminé avant de l’ouvrir.       |
| En cours   | Un espace de travail local ou distant est associé à l’exercice.  |
| Terminé    | Une soumission acceptée a validé l’exercice.                     |

Le parcours est séquentiel : terminer un exercice débloque le suivant. Cette progression vous fait rencontrer chaque notion au moment où elle devient utile — voir [les notions au programme](/docs/notions/).

## Tests locaux et validation officielle

Les tests locaux servent à obtenir un feedback rapide pendant le développement. Ils ne remplacent pas la validation officielle : le serveur recharge l’exercice, applique son contrat et évalue la soumission dans son propre environnement.

Une solution qui réussit un seul exemple peut encore échouer sur un tableau vide, une chaîne vide, des doublons, des valeurs négatives ou une entrée volumineuse. Ajoutez votre propre raisonnement autour de ces cas avant de soumettre.

## Écrire une solution robuste

Commencez par clarifier le résultat attendu, puis choisissez une transformation simple. Évitez les effets de bord inutiles et vérifiez vos hypothèses sur les types d’entrée. Le code doit rester lisible pour qu’une erreur soit facile à isoler.

Les pages de notions listent les pièges classiques de chaque famille de méthodes — par exemple [l’oubli du `return` dans un `map`](/docs/functional-programming/#les-pieges-classiques) ou [la sémantique d’un tableau vide avec `every`](/docs/advanced-methods/#comparaison).

## Soumettre une solution

La soumission officielle est une action distincte de l’enregistrement de votre travail. Consultez [le guide de soumission](/docs/submitting/) pour comprendre ce qui est envoyé et comment lire le résultat.

## Pour aller plus loin

- [Soumettre une solution](/docs/submitting/) — cycle de validation complet.
- [Les notions au programme](/docs/notions/) — les compétences visées par le catalogue.
- [Utiliser la CLI](/docs/cli/) — travailler depuis le terminal.
