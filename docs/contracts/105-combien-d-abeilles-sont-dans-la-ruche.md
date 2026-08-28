# Exercice 105: Combien d'abeilles sont dans la ruche ?

## Analyse de la consigne
Les abeilles peuvent être orientées vers le HAUT, BAS, GAUCHE ou DROIT. Trouver le nombre d'abeilles (bee) dans une ruche.

## Le Contrat
- **Entrée(s) :** `hive` (tableau de tableaux de caractères ou chaîne)
- **Sortie :** (nombre) Le nombre d'abeilles.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { countBees } from './105-combien-d-abeilles-sont-dans-la-ruche.js';

assert.equal(countBees(null), 0);
assert.equal(countBees([]), 0);
// tests additionnels basés sur la ruche.
```

## Starter Code
```javascript
export function countBees(hive) {
  // TODO: Implémenter la logique
  return 0;
}
```
