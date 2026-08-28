# Exercice 85: Superposition d’intervalles

## Analyse de la consigne
On vous donne les extrémités (début et fin) d’intervalles fermés et on vous demande combien vont se superposer.

## Le Contrat
- **Entrée(s) :** `start` (tableau de nombres), `end` (tableau de nombres)
- **Sortie :** (nombre) Le nombre d'intervalles qui se superposent.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { countOverlappingIntervals } from './085-superposition-d-intervalles.js';

assert.equal(countOverlappingIntervals([8, 4, 6, 1], [10, 9, 7, 2]), 2);
assert.equal(countOverlappingIntervals([1, 2], [3, 4]), 1);
assert.equal(countOverlappingIntervals([1, 2], [2, 4]), 1);
```

## Starter Code
```javascript
export function countOverlappingIntervals(start, end) {
  // TODO: Implémenter la logique
  return 0;
}
```
