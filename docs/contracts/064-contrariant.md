# 064 - Contrariant

## Analyse de la consigne
L'enfant d'Alan ne le croit jamais quand il raconte ce qu'il a fait dans la journée. L'entrée est une phrase de la forme `"Today I " + [verbe_d_action] + [complément] + "."` (ex : `"Today I played football."`). La fonction doit renvoyer la réplique contrariante de l'enfant, de la forme `"I don't think you " + [ce qu'a dit Alan] + " today, I think you " + ["did"/"didn't"] + " " + [verbe au présent] + [" it!"/" at all!"]`.

## Le Contrat
- **Entrée** : `sentence` (string) - une phrase au format "Today I ...".
- **Sortie** : (string) - la réplique contrariante correspondante.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { contrariant } from './index.js';

assert.strictEqual(
  contrariant("Today I played football."),
  "I don't think you played football today, I think you didn't play at all!"
);
assert.strictEqual(
  contrariant("Today I didn't attempt to hardcode this Kata."),
  "I don't think you didn't attempt to hardcode this Kata today, I think you did attempt it!"
);
assert.strictEqual(
  contrariant("Today I didn't play football."),
  "I don't think you didn't play football today, I think you did play it!"
);
assert.strictEqual(
  contrariant("Today I cleaned the kitchen."),
  "I don't think you cleaned the kitchen today, I think you didn't clean at all!"
);
```

## Starter Code
```javascript
export function contrariant(sentence) {
  // Votre solution ici
}
```
