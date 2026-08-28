# 071 - Somme gauche = Somme droite

## Analyse de la consigne
Étant donné une liste d'entiers, trouver un indice `N` où la somme des éléments à gauche de `N` est égale à la somme des éléments à droite de `N`. S'il n'existe aucun indice valide, renvoyer `-1`.

## Le Contrat
- **Entrée** : `arr` (number[]).
- **Sortie** : (number) - l'indice trouvé, ou `-1`.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { findEvenIndex } from './index.js';

assert.strictEqual(findEvenIndex([1, 2, 3, 4, 3, 2, 1]), 3);
assert.strictEqual(findEvenIndex([1, 100, 50, -51, 1, 1]), 1);
assert.strictEqual(findEvenIndex([1, 2, 3, 4, 5, 6]), -1);
assert.strictEqual(findEvenIndex([20, 10, 30, 10, 10, 15, 35]), 3);
```

## Starter Code
```javascript
export function findEvenIndex(arr) {
  // Votre solution ici
}
```
