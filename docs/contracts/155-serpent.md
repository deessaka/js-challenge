# Serpent

## Analyse de la consigne
Le but est de parcourir une matrice carrée 2D en escargot (ou serpent) de l'extérieur vers l'intérieur, dans le sens des aiguilles d'une montre, et d'en extraire les éléments sous forme d'un tableau unidimensionnel (1D).

## Le Contrat
- **Entrée** : `tableau` (Array<Array<number>>) - Une matrice n x n d'entiers.
- **Sortie** : (Array<number>) - Un tableau d'entiers représentant le parcours en escargot.

## Test proposé
```javascript
const assert = require('assert');

const tableau = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
assert.deepStrictEqual(snail(tableau), [1, 2, 3, 6, 9, 8, 7, 4, 5]);
```

## Starter Code
```javascript
function snail(tableau) {
  // Votre code ici
  return [];
}
```
