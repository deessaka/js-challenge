---
title: Soumettre une solution
description: Ce qui distingue l’enregistrement local de la soumission officielle, et comment exploiter le résultat d’une validation.
section: Exercices
order: 11
---

# Soumettre une solution

Deux actions distinctes coexistent dans Codojo : **enregistrer** votre travail, qui conserve votre solution en cours sans l’évaluer, et **soumettre**, qui déclenche la validation officielle. Seule une soumission acceptée fait progresser votre parcours.

## Ce que fait la validation officielle

La soumission envoie votre code au serveur, qui recharge l’exercice dans son propre environnement et évalue votre solution contre son contrat complet — pas seulement contre les exemples visibles de l’énoncé. Une solution qui réussit un exemple peut donc encore échouer sur un tableau vide, une chaîne vide, des doublons, des valeurs négatives ou une entrée volumineuse.

## Lire le résultat

Un échec de test indique le résultat obtenu et le résultat attendu. Cette comparaison est votre principal outil : elle localise précisément le comportement à corriger. Un succès valide l’exercice, crédite vos points et débloque la suite du parcours.

## Corriger efficacement

1. **Reproduisez d’abord localement.** Depuis l’éditeur intégré, la console de debug (`Ctrl+T`) exécute votre solution sans les tests d’exercice et affiche vos journaux : idéal pour inspecter une valeur intermédiaire.
2. **Corrigez une seule chose à la fois.** Une modification par itération rend chaque résultat de test interprétable.
3. **Re-soumettez après chaque correction** pour confirmer ou infirmer votre hypothèse.

## Checklist avant de soumettre

- [ ] Les cas vides sont traités (tableau vide, chaîne vide).
- [ ] Les doublons et les valeurs négatives ne cassent rien.
- [ ] Le comportement reste correct sur une entrée volumineuse.
- [ ] La fonction respecte le contrat : mêmes paramètres, même type de retour que l’énoncé.
- [ ] Aucun secret ni donnée personnelle dans le code (voir [Sécurité](/docs/security/)).

> La validation officielle est votre juge final, mais vos tests locaux restent votre boucle de feedback quotidienne. Multipliez les allers-retours courts plutôt que les soumissions à l’aveugle.

## Pour aller plus loin

- [Comprendre les exercices](/docs/challenges/) — états de progression et stratégie de résolution.
- [Utiliser la CLI](/docs/cli/) — soumettre depuis le terminal avec `codojo submit`.
- [Les notions au programme](/docs/notions/) — consolider les méthodes ciblées par l’exercice.
