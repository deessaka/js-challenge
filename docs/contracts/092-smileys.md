# Exercice 92: Smileys

## Analyse de la consigne
Écrire une fonction qui renverra le nombre total de visages souriants valides.

## Le Contrat
- **Entrée(s) :** `arr` (tableau de chaînes de caractères)
- **Sortie :** (nombre) Le nombre de smileys.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { countSmileys } from './092-smileys.js';

assert.equal(countSmileys([':)', ';(', ';}', ':-D']), 2);
assert.equal(countSmileys([';D', ':-(', ':-)', ';~)']), 3);
```

## Starter Code
```javascript
export function countSmileys(arr) {
  // TODO: Implémenter la logique
  return 0;
}
```
