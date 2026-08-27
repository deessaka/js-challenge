# Exercice 89: Lettre manquante

## Analyse de la consigne
Écrivez une fonction qui prend une série de lettres consécutives et renvoie la lettre manquante.

## Le Contrat
- **Entrée(s) :** `chars` (tableau de caractères)
- **Sortie :** (caractère) La lettre manquante.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { findMissingLetter } from './089-lettre-manquante.js';

assert.equal(findMissingLetter(['a', 'b', 'c', 'd', 'f']), 'e');
assert.equal(findMissingLetter(['O', 'Q', 'R', 'S']), 'P');
```

## Starter Code
```javascript
export function findMissingLetter(chars) {
  // TODO: Implémenter la logique
  return '';
}
```
