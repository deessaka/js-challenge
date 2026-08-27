# Chiffres romains

## Analyse de la consigne
Il s'agit de convertir un nombre entier positif en sa représentation en chiffres romains. Le processus requiert de décomposer le nombre avec les symboles romains dans l'ordre décroissant.

## Le Contrat
- **Entrée** : `number` (number) - Un entier positif à convertir.
- **Sortie** : (string) - La représentation de ce nombre en chiffres romains.

## Test proposé
```javascript
const assert = require('assert');

assert.strictEqual(solution(1000), "M");
assert.strictEqual(solution(1990), "MCMXC");
assert.strictEqual(solution(2008), "MMVIII");
assert.strictEqual(solution(1666), "MDCLXVI");
```

## Starter Code
```javascript
function solution(number) {
  // Votre code ici
  return "";
}
```
