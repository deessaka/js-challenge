# 080 - Encodeur de lettres dupliquées

## Analyse de la consigne
Convertir une chaîne en une nouvelle chaîne où chaque caractère devient `(` s'il apparaît une seule fois dans la chaîne d'origine, ou `)` s'il apparaît plusieurs fois. La casse est ignorée.

## Le Contrat
- **Entrée** : `word` (string).
- **Sortie** : (string) - une chaîne de `(` et `)` de même longueur que `word`.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { duplicateEncode } from './index.js';

assert.strictEqual(duplicateEncode("din"), "(((");
assert.strictEqual(duplicateEncode("recede"), "()()()");
assert.strictEqual(duplicateEncode("Success"), ")())())");
assert.strictEqual(duplicateEncode("(( @"), "))((");
```

## Starter Code
```javascript
export function duplicateEncode(word) {
  // Votre solution ici
}
```
