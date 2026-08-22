---
title: Méthodes avancées
description: Formuler des conditions sur un ensemble avec every, some et find — et localiser l’élément qu’il vous faut.
section: Notions
order: 8
---

# Méthodes avancées

`every`, `some` et `find` répondent à trois questions différentes sur un même tableau : « tous ? », « au moins un ? » et « lequel ? ». Elles reçoivent toutes trois un prédicat — une fonction qui renvoie une valeur booléenne — et s’arrêtent dès que le résultat est connu.

## Comparaison

| Méthode | Question posée | Renvoie | S’arrête | Tableau vide |
| --- | --- | --- | --- | --- |
| `every(f)` | Tous les éléments satisfont-ils `f` ? | `true` ou `false` | Au premier échec | `true` |
| `some(f)` | Au moins un élément satisfait-il `f` ? | `true` ou `false` | Au premier succès | `false` |
| `find(f)` | Quel est le premier élément qui satisfait `f` ? | L’élément, sinon `undefined` | Au premier succès | `undefined` |

La dernière colonne mérite un arrêt : sur un tableau vide, `every` renvoie `true` (aucun élément ne contredit la condition) tandis que `some` renvoie `false`. Ce comportement, conforme à la logique mathématique, surprend souvent au début.

## `every` : vérifier une règle universelle

Exercice type du catalogue : *Divisible par ?* (n° 33) — un nombre est-il divisible par tous les diviseurs fournis ?

```js
function divisiblePar(n, diviseurs) {
  return diviseurs.every((d) => n % d === 0)
}

divisiblePar(12, [3, 4]) // true
divisiblePar(12, [3, 5]) // false
```

## `some` : détecter une présence

Exemple inspiré de *Retournement des mots de 5 lettres et plus* (n° 86) — y a-t-il au moins un mot assez long pour être retourné ?

```js
function contientMotLong(mots) {
  return mots.some((mot) => mot.length >= 5)
}
```

## `find` : localiser le premier élément

```js
function premierPair(nombres) {
  return nombres.find((n) => n % 2 === 0)
}

premierPair([7, 3, 8, 4]) // 8
premierPair([1, 3, 5]) // undefined
```

`find` renvoie l’élément lui-même, pas sa position. Si vous avez besoin de l’indice, utilisez `findIndex`, qui renvoie `-1` en cas d’absence.

## Les pièges classiques

**Utiliser le résultat de `find` sans précaution.** En cas d’absence, la valeur est `undefined` ; tout accès à ses propriétés lèvera une erreur. Testez-le avant de l’exploiter :

```js
const trouvé = éléments.find((e) => e.id === cible)
if (!trouvé) return null // ou la valeur attendue par le contrat
```

**Écrire un prédicat à effet de bord.** Ces méthodes s’attendent à une fonction pure : elle doit renvoyer un résultat dépendant uniquement de son entrée, sans modifier le tableau.

**Réinventer la boucle.** Un `for` avec compteur pour compter les éléments qui remplissent une condition cache souvent un `filter(...).length` plus direct.

## Méthodes voisines utiles

| Méthode | Rôle |
| --- | --- |
| `findIndex(f)` | Indice du premier élément qui satisfait `f`, sinon `-1` |
| `includes(v)` | Le tableau contient-il la valeur `v` ? |
| `flatMap(f)` | Transforme puis aplatit d’un niveau |

Ces méthodes se combinent naturellement avec celles de la page [Programmation fonctionnelle](/docs/functional-programming/) : par exemple `filter` pour sélectionner, puis `every` pour valider la sélection.

## Cas limites à tester avant de soumettre

- Le tableau vide : mémorisez `every` → `true`, `some` → `false`, `find` → `undefined`.
- Le cas où aucun élément ne satisfait la condition.
- Le cas où plusieurs éléments la satisfont : seul le premier compte.

## Pour aller plus loin

- [Programmation fonctionnelle](/docs/functional-programming/) — `map`, `filter`, `reduce`.
- [Expressions régulières](/docs/regular-expressions/) — pour les prédicats portant sur du texte.
- [Comprendre les exercices](/docs/challenges/) — états de progression et validation officielle.
