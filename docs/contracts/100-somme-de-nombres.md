# Exercice 100: Somme de nombres

## Analyse de la consigne
A partir d'un tableau a, construire b tel que b[i] = somme(a[i]...a[n-1]).

## Le Contrat
- **Entrée(s) :** `a` (tableau de nombres)
- **Sortie :** (tableau de nombres) Les sommes des suffixes.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { suffixSums } from './100-somme-de-nombres.js';

assert.deepEqual(suffixSums([1, 2, 3]), [6, 5, 3]);
assert.deepEqual(suffixSums([1, 2, 3, -6]), [0, -1, -3, -6]);
assert.deepEqual(suffixSums([0, 0, 0]), [0, 0, 0]);
```

## Starter Code
```javascript
export function suffixSums(a) {
  // TODO: Implémenter la logique
  return [];
}
```
