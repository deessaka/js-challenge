# 076 - Position des lettres dans l'alphabet

## Analyse de la consigne
À partir d'une chaîne, remplacer chaque lettre par sa position dans l'alphabet (`a` = 1, `b` = 2, ...), en ignorant tout caractère qui n'est pas une lettre. Le résultat est une chaîne de nombres séparés par des espaces.

## Le Contrat
- **Entrée** : `text` (string).
- **Sortie** : (string) - les positions des lettres, séparées par des espaces.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { alphabet_position } from './index.js';

assert.strictEqual(
  alphabet_position("The sunset sets at twelve o' clock."),
  "20 8 5 19 21 14 19 5 20 19 5 20 19 1 20 20 23 5 12 22 5 15 3 12 15 3 11"
);
```

## Starter Code
```javascript
export function alphabet_position(text) {
  // Votre solution ici
}
```
