# Gendarmes et voleurs

## Analyse de la consigne
Dans une file d'attente (chaîne de caractères), on a des gens ('#'), des voleurs ('X') et des gendarmes (chiffres '1'-'9'). Un gendarme capture tous les voleurs situés à une distance inférieure ou égale à sa valeur numérique, devant et derrière lui.
- **Entrée :** `queue` (String).
- **Sortie :** `Number` (nombre de voleurs capturés).

## Le Contrat
La fonction doit identifier la position de chaque voleur et de chaque gendarme. Un voleur est capturé s'il existe au moins un gendarme dont la distance au voleur est inférieure ou égale à sa portée (sa valeur numérique).

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(catchThief("X1X#2X#XX"), 3);
assert.equal(catchThief("X5X#3X###XXXX##1#X1X"), 5);
assert.equal(catchThief("X#X1#X9XX"), 5);
```

## Starter Code
```javascript
export function catchThief(queue) {
  // Votre code ici
  return 0;
}
```
