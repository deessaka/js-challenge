# 067 - 10 minutes de promenade

## Analyse de la consigne
La ville est organisée en grille parfaite ; chaque déplacement d'un bloc prend une minute. Étant donné une liste de directions (`'n'`, `'s'`, `'e'`, `'w'`), la fonction doit renvoyer `true` si la marche dure exactement dix minutes (dix déplacements) ET ramène au point de départ, `false` sinon.

## Le Contrat
- **Entrée** : `walk` (string[]) - une suite de directions cardinales.
- **Sortie** : (boolean) - `true` si la marche dure 10 minutes et revient au point de départ.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { isValidWalk } from './index.js';

assert.strictEqual(isValidWalk(['n', 's', 'n', 's', 'n', 's', 'n', 's', 'n', 's']), true);
assert.strictEqual(isValidWalk(['w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e', 'w', 'e']), false);
assert.strictEqual(isValidWalk(['w']), false); // ne dure pas 10' et pas de retour
assert.strictEqual(isValidWalk(['n', 'n', 'n', 's', 'n', 's', 'n', 's', 'n', 's']), false); // pas de retour
```

## Starter Code
```javascript
export function isValidWalk(walk) {
  // Votre solution ici
}
```
