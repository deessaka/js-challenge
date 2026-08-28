# Exercice 91: Tribonnacci

## Analyse de la consigne
Générer la séquence Tribonacci (addition des 3 derniers nombres).

## Le Contrat
- **Entrée(s) :** `signature` (tableau de 3 nombres), `n` (nombre entier)
- **Sortie :** (tableau de nombres) La séquence de longueur n.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { tribonacci } from './091-tribonnacci.js';

assert.deepEqual(tribonacci([1, 1, 1], 10), [1, 1, 1, 3, 5, 9, 17, 31, 57, 105]);
assert.deepEqual(tribonacci([0, 0, 1], 10), [0, 0, 1, 1, 2, 4, 7, 13, 24, 44]);
```

## Starter Code
```javascript
export function tribonacci(signature, n) {
  // TODO: Implémenter la logique
  return [];
}
```
