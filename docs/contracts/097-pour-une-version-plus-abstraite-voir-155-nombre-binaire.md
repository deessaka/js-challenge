# Exercice 97: Détection de cycles

## Analyse de la consigne
Construire une fonction qui renverra [μ, λ] (position du premier élément du cycle, longueur du cycle) à partir d’une séquence.

## Le Contrat
- **Entrée(s) :** `arr` (tableau de nombres)
- **Sortie :** (tableau de nombres) [μ, λ] ou [] si pas de cycle.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { cycle } from './097-pour-une-version-plus-abstraite-voir-155-nombre-binaire.js';

assert.deepEqual(cycle([2, 3, 4, 2, 3, 4]), [0, 3]);
assert.deepEqual(cycle([1, 2, 3, 4]), []);
```

## Starter Code
```javascript
export function cycle(arr) {
  // TODO: Implémenter la logique
  return [];
}
```
