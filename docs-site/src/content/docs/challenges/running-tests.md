---
title: Exécuter les tests
description: Utiliser les résultats de test pour corriger une solution avant sa soumission.
---

Les tests sont votre boucle de feedback principale. Ils vérifient le comportement de votre code sur plusieurs cas et affichent les résultats attendus, les résultats obtenus et les éventuels logs d’exécution.

## Lire un résultat

| Résultat           | Signification                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Réussi             | Votre code produit le résultat attendu pour ce cas.                                        |
| Échoué             | Le résultat obtenu diffère de la valeur attendue ou une erreur s’est produite.             |
| Verrouillé         | Le challenge n’est pas encore disponible dans votre progression.                           |
| Erreur d’exécution | Le code n’a pas pu être exécuté comme prévu. Vérifiez la syntaxe et les valeurs utilisées. |

Un message d’erreur est un point de départ pour l’investigation. Reproduisez le cas avec une entrée simple, vérifiez les types et examinez les branches qui ne sont pas couvertes par votre premier exemple.

## Dans la CLI

Dans l’interface terminal, `Ctrl+T` lance un dry-run depuis l’éditeur. Le résultat peut afficher la durée, les logs et le premier problème rencontré. `Ctrl+S` sauvegarde le code sans le soumettre.

## Avant de soumettre

Corrigez les tests échoués, relancez un dry-run et vérifiez que le code enregistré correspond bien à la version que vous souhaitez envoyer. La validation officielle est décrite dans [Soumettre une solution](/challenges/submitting/).
