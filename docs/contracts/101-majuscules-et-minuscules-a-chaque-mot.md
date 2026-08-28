# Exercice 101: Majuscules et minuscules à chaque mot

## Analyse de la consigne
Renvoyer la chaîne avec les positions paires en majuscules et les impaires en minuscules pour chaque mot.

## Le Contrat
- **Entrée(s) :** `str` (chaîne de caractères)
- **Sortie :** (chaîne de caractères) La chaîne modifiée.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { toWeirdCase } from './101-majuscules-et-minuscules-a-chaque-mot.js';

assert.equal(toWeirdCase("String"), "StRiNg");
assert.equal(toWeirdCase("Weird string case"), "WeIrD StRiNg CaSe");
```

## Starter Code
```javascript
export function toWeirdCase(str) {
  // TODO: Implémenter la logique
  return "";
}
```
