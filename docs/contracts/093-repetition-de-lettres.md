# Exercice 93: Répétition de lettres

## Analyse de la consigne
Compte le nombre de lettres ou chiffres distincts qui apparaissent plus d’une fois.

## Le Contrat
- **Entrée(s) :** `text` (chaîne de caractères)
- **Sortie :** (nombre) Nombre de caractères répétés.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { duplicateCount } from './093-repetition-de-lettres.js';

assert.equal(duplicateCount("abcde"), 0);
assert.equal(duplicateCount("aabbcde"), 2);
assert.equal(duplicateCount("aabBcde"), 2);
```

## Starter Code
```javascript
export function duplicateCount(text) {
  // TODO: Implémenter la logique
  return 0;
}
```
