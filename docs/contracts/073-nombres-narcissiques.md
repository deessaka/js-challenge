# 073 - Nombres narcissiques

## Analyse de la consigne
Un nombre narcissique est égal à la somme de ses propres chiffres, chacun élevé à la puissance du nombre de chiffres qu'il possède (ex : 153 a 3 chiffres et 1³+5³+3³ = 153). La fonction doit renvoyer `true` ou `false` selon que le nombre donné est narcissique.

## Le Contrat
- **Entrée** : `value` (number).
- **Sortie** : (boolean) - `true` si `value` est un nombre narcissique.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { narcissistic } from './index.js';

assert.strictEqual(narcissistic(153), true);
assert.strictEqual(narcissistic(1634), true);
assert.strictEqual(narcissistic(1994), false);
```

## Starter Code
```javascript
export function narcissistic(value) {
  // Votre solution ici
}
```
