---
title: Programmation fonctionnelle
description: Transformer des collections avec map, filter et reduce — des méthodes déclaratives qui préservent vos données sources.
section: Notions
order: 6
---

# Programmation fonctionnelle

La programmation fonctionnelle consiste à décrire **ce que vous voulez obtenir** plutôt que comment parcourir les données pas à pas. En JavaScript, trois méthodes de tableau couvrent l’essentiel des besoins : `map`, `filter` et `reduce`. Elles partagent deux propriétés essentielles : elles renvoient un **nouveau tableau** (ou une nouvelle valeur) et ne modifient jamais le tableau d’origine.

## Les trois méthodes

| Méthode | Rôle | Renvoie |
| --- | --- | --- |
| `map(f)` | Transforme chaque élément | Un tableau de même longueur |
| `filter(f)` | Garde les éléments qui satisfont une condition | Un tableau plus court ou égal |
| `reduce(f, init)` | Accumule les éléments en une seule valeur | La valeur accumulée |

## `map` : transformer chaque élément

Exercice type du catalogue : *Carré des nombres* (n° 20) — élever chaque nombre d’une liste au carré.

```js
function carres(nombres) {
  return nombres.map((n) => n * n)
}

carres([1, 2, 3]) // [1, 4, 9]
```

La fonction reçue par `map` est appliquée à chaque élément ; le résultat occupe la même position dans le nouveau tableau.

## `filter` : sélectionner

Exercice type : *Filtrer une liste* (n° 35) — ne garder que les éléments qui remplissent une condition.

```js
function nombresPairs(valeurs) {
  return valeurs.filter((n) => n % 2 === 0)
}

nombresPairs([1, 2, 3, 4, 5, 6]) // [2, 4, 6]
```

Le prédicat doit renvoyer une valeur considérée comme booléenne : `true` conserve l’élément, `false` l’écarte. Pour supprimer les doublons (*Supprimer les doublons*, n° 6), la combinaison `Set` + spread est idiomatique :

```js
const uniques = [...new Set(valeurs)]
```

## `reduce` : accumuler

Exercice type : *Somme de nombres* (n° 100) — réduire une liste à une seule valeur.

```js
function somme(nombres) {
  return nombres.reduce((total, n) => total + n, 0)
}

somme([1, 2, 3, 4]) // 10
```

Le second argument de `reduce` est la valeur initiale de l’accumulateur. Elle sert de point de départ et de résultat pour un tableau vide.

## Les pièges classiques

**Oublier le `return` dès qu’on ouvre un bloc.** Une fonction fléchée sur une ligne renvoie implicitement son expression ; ce n’est plus le cas avec des accolades :

```js
// Incorrect : chaque élément devient undefined
nombres.map((n) => {
  n * n
})

// Correct
nombres.map((n) => {
  return n * n
})
```

**Muter le tableau source.** Certaines méthodes modifient le tableau sur place (`sort`, `reverse`, `splice`). Si vous devez trier une entrée, travaillez sur une copie :

```js
const triée = [...valeurs].sort((a, b) => a - b)
```

**Appeler `reduce` sans valeur initiale sur un tableau vide.** Sans valeur initiale, `reduce` prend le premier élément comme accumulateur ; sur un tableau vide, cela lève une `TypeError`. Passez toujours une valeur initiale explicite.

## Cas limites à tester avant de soumettre

- Le tableau vide : `[].map(...)` renvoie `[]`, `[].filter(...)` aussi, `[].reduce(f, init)` renvoie `init`.
- Un seul élément.
- Des valeurs négatives, nulles ou en double.
- Une entrée volumineuse : ces méthodes restent linéaires, mais évitez d’imbriquer des parcours inutiles.

## Pour aller plus loin

- [Méthodes avancées](/docs/advanced-methods/) — `every`, `some`, `find` complètent cette boîte à outils.
- [Expressions régulières](/docs/regular-expressions/) — pour les exercices où la donnée à transformer est du texte.
- [Comprendre les exercices](/docs/challenges/) — états de progression et validation officielle.
