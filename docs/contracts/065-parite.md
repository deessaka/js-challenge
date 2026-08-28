# 065 - Parité

## Analyse de la consigne
Étant donné une liste de nombres (sous forme de chaîne séparée par des espaces), il faut trouver le seul nombre qui n'a pas la même parité que tous les autres.

## Le Contrat
- **Entrée** : `numbers` (string) - une liste de nombres séparés par des espaces.
- **Sortie** : (number) - le nombre dont la parité diffère des autres.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { iqTest } from './index.js';

assert.strictEqual(iqTest("2 4 7 8 10"), 3);
assert.strictEqual(iqTest("1 2 1 1"), 2);
```

## Starter Code
```javascript
export function iqTest(numbers) {
  // Votre solution ici
}
```
