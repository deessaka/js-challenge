# 078 - Nombre apparaissant un nombre impair de fois

## Analyse de la consigne
À partir d'un tableau d'entiers, trouver le nombre qui apparaît un nombre impair de fois. Il n'y a toujours qu'un seul entier concerné.

## Le Contrat
- **Entrée** : `arr` (number[]).
- **Sortie** : (number) - l'entier apparaissant un nombre impair de fois.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { findOdd } from './index.js';

assert.strictEqual(findOdd([20, 1, -1, 2, -2, 3, 3, 5, 5, 1, 2, 4, 20, 4, -1, -2, 5]), 5);
assert.strictEqual(findOdd([1, 1, 2, -2, 5, 2, 4, 4, -1, -2, 5]), -1);
assert.strictEqual(findOdd([20, 1, 1, 2, 2, 3, 3, 5, 5, 4, 20, 4, 5]), 5);
assert.strictEqual(findOdd([10]), 10);
```

## Starter Code
```javascript
export function findOdd(arr) {
  // Votre solution ici
}
```
