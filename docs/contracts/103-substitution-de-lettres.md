# Exercice 103: Substitution de lettres

## Analyse de la consigne
Renvoie un objet dont les clés sont l'alphabet et les valeurs sont des lettres au hasard.

## Le Contrat
- **Entrée(s) :** Aucune
- **Sortie :** (objet) Dictionnaire de substitution.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { randomSub } from './103-substitution-de-lettres.js';

const sub = randomSub();
assert.equal(Object.keys(sub).length, 26);
assert.equal(typeof sub['a'], 'string');
```

## Starter Code
```javascript
export function randomSub() {
  // TODO: Implémenter la logique
  return {};
}
```
