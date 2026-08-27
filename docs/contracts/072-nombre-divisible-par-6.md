# 072 - Nombre divisible par 6

## Analyse de la consigne
Une chaîne de chiffres contient un astérisque (`*`) qui doit être remplacé par un unique chiffre. La fonction doit renvoyer, sous forme de tableau de chaînes, toutes les valeurs possibles pour lesquelles le nombre résultant est divisible par 6.

## Le Contrat
- **Entrée** : `str` (string) - une chaîne de chiffres contenant un `*`.
- **Sortie** : (string[]) - toutes les chaînes valides où `*` est remplacé par un chiffre rendant le nombre divisible par 6.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { divisibleBySix } from './index.js';

assert.deepStrictEqual(divisibleBySix("1*0"), ["120", "150", "180"]);
assert.deepStrictEqual(divisibleBySix("*1"), []);
```

## Starter Code
```javascript
export function divisibleBySix(str) {
  // Votre solution ici
}
```
