# Grandes factorielles

## Analyse de la consigne
Il s'agit de calculer la factorielle d'un entier `n` potentiellement très grand. La précision doit être conservée pour de grands nombres, ce qui implique de ne pas utiliser le type `Number` classique (limité en précision) mais plutôt `BigInt` ou de retourner le résultat sous forme de chaîne de caractères.

## Le Contrat
- **Entrée** : `n` (number ou entier) - Le nombre dont on veut calculer la factorielle.
- **Sortie** : (string) - La factorielle de `n` représentée sous forme de chaîne de caractères.

## Test proposé
```javascript
const assert = require('assert');

assert.strictEqual(factorial(5), "120");
assert.strictEqual(factorial(1), "1");
```

## Starter Code
```javascript
function factorial(n) {
  // Votre code ici
  return "";
}
```
