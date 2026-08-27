# Exercice 95: Lièvre et tortue

## Analyse de la consigne
Combien de temps prend-t-il à B pour attraper A avec des vitesses et une avance données.

## Le Contrat
- **Entrée(s) :** `v1` (vitesse de A), `v2` (vitesse de B), `g` (avance)
- **Sortie :** (tableau de 3 nombres) Le temps en [h, mn, s], ou null si v1 >= v2.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { catchUp } from './095-lievre-et-tortue.js';

assert.deepEqual(catchUp(720, 850, 70), [0, 32, 18]);
assert.deepEqual(catchUp(850, 720, 70), null);
```

## Starter Code
```javascript
export function catchUp(v1, v2, g) {
  // TODO: Implémenter la logique
  return [];
}
```
