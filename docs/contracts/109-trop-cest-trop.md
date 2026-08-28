# Trop c’est trop

## Analyse de la consigne
Il s'agit de filtrer une liste de nombres en supprimant les occurrences d'un même nombre qui dépassent une limite `n`, tout en préservant l'ordre original des éléments.
- **Entrées :** `arr` (Array de Nombres), `n` (Nombre entier).
- **Sortie :** `Array` de Nombres.

## Le Contrat
La fonction parcourt le tableau d'entrée et conserve chaque nombre seulement si son nombre d'occurrences déjà rencontrées est strictement inférieur à `n`.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.deepEqual(deleteNth([20, 37, 20, 21], 1), [20, 37, 21]);
assert.deepEqual(deleteNth([1, 1, 3, 3, 7, 2, 2, 2, 2], 3), [1, 1, 3, 3, 7, 2, 2, 2]);
```

## Starter Code
```javascript
export function deleteNth(arr, n) {
  // Votre code ici
  return [];
}
```
