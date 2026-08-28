# Nombre suivant avec les mêmes chiffres

## Analyse de la consigne
Il s'agit de trouver le plus petit nombre entier strictement supérieur au nombre donné, formé exactement des mêmes chiffres. Si un tel nombre n'existe pas, la fonction doit renvoyer -1.

## Le Contrat
- **Entrée** : `n` (number) - Un entier positif.
- **Sortie** : (number) - Le nombre entier positif suivant possédant les mêmes chiffres, ou `-1` s'il n'y en a pas.

## Test proposé
```javascript
const assert = require('assert');

assert.strictEqual(nextBigger(12), 21);
assert.strictEqual(nextBigger(513), 531);
assert.strictEqual(nextBigger(2017), 2071);
assert.strictEqual(nextBigger(9), -1);
assert.strictEqual(nextBigger(111), -1);
assert.strictEqual(nextBigger(531), -1);
```

## Starter Code
```javascript
function nextBigger(n) {
  // Votre code ici
  return -1;
}
```
