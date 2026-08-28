# Déplacement sur une carte

## Analyse de la consigne
Simplifier un chemin en éliminant les paires de directions opposées adjacentes ("NORTH" avec "SOUTH", et "EAST" avec "WEST").
- **Entrée :** `arr` (Array de Strings).
- **Sortie :** `Array` de Strings.

## Le Contrat
La fonction lit les directions et maintient un chemin optimisé (souvent avec une pile/stack). Si la nouvelle direction est l'opposé exact de la dernière du chemin réduit, cette dernière est annulée (dépilée). Sinon, la direction est ajoutée.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.deepEqual(dirReduc(["NORTH", "SOUTH", "SOUTH", "EAST", "WEST", "NORTH", "WEST"]), ["WEST"]);
assert.deepEqual(dirReduc(["NORTH", "WEST", "SOUTH", "EAST"]), ["NORTH", "WEST", "SOUTH", "EAST"]);
assert.deepEqual(dirReduc(["NORTH", "SOUTH", "EAST", "WEST", "EAST", "WEST"]), []);
```

## Starter Code
```javascript
export function dirReduc(arr) {
  // Votre code ici
  return [];
}
```
