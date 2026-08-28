# 081 - File d'attente cinéma

## Analyse de la consigne
Un billet coûte 25$. Chaque personne dans la file a un unique billet de 25, 50 ou 100$. En vendant les billets strictement dans l'ordre de la file et en partant sans monnaie, la fonction doit déterminer s'il est possible de vendre un billet à chaque personne en lui rendant la monnaie exacte.

## Le Contrat
- **Entrée** : `peopleInLine` (number[]) - les billets (25, 50 ou 100) de chaque personne, dans l'ordre.
- **Sortie** : (string) - `"YES"` si on peut toujours rendre la monnaie, `"NO"` sinon.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { tickets } from './index.js';

assert.strictEqual(tickets([25, 25, 50, 50]), "YES"); // on récupère 25+25$, rend 25$ puis 25$
assert.strictEqual(tickets([25, 100]), "NO"); // on récupère 25$ mais impossible de rendre 75$
```

## Starter Code
```javascript
export function tickets(peopleInLine) {
  // Votre solution ici
}
```
