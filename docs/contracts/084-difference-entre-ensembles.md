# 084 - Différence entre ensembles

## Analyse de la consigne
Garder les éléments du tableau `a` qui ne sont pas présents dans le tableau `b`.

## Le Contrat
- **Entrées** : `a` (number[]), `b` (number[]).
- **Sortie** : (number[]) - les éléments de `a` absents de `b`, dans l'ordre d'origine.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { difference } from './index.js';

assert.deepStrictEqual(difference([1, 2], [1]), [2]);
assert.deepStrictEqual(difference([1, 2, 2, 2, 3], [2]), [1, 3]);
```

## Starter Code
```javascript
export function difference(a, b) {
  // Votre solution ici
}
```
