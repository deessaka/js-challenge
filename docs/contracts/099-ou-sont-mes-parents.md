# Exercice 99: Où sont mes parents ?

## Analyse de la consigne
Placez toutes les personnes dans l'ordre alphabétique, avec les mères (majuscules) suivies par leurs enfants (minuscules).

## Le Contrat
- **Entrée(s) :** `str` (chaîne de caractères)
- **Sortie :** (chaîne de caractères) La chaîne triée.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { findChildren } from './099-ou-sont-mes-parents.js';

assert.equal(findChildren("aAbaBb"), "AaaBbb");
assert.equal(findChildren("beeeEBb"), "BbbEeee");
assert.equal(findChildren("uwwWUeEe"), "EeeUuuWww");
```

## Starter Code
```javascript
export function findChildren(str) {
  // TODO: Implémenter la logique
  return "";
}
```
