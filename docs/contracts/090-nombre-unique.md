# Exercice 90: Nombre unique

## Analyse de la consigne
Retrouvez le seul nombre unique dans une liste d'au moins 3 nombres.

## Le Contrat
- **Entrée(s) :** `arr` (tableau de nombres)
- **Sortie :** (nombre) Le nombre unique.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { findUniq } from './090-nombre-unique.js';

assert.equal(findUniq([1, 1, 1, 2, 1, 1]), 2);
assert.equal(findUniq([0, 0, 0.55, 0, 0]), 0.55);
```

## Starter Code
```javascript
export function findUniq(arr) {
  // TODO: Implémenter la logique
  return 0;
}
```
