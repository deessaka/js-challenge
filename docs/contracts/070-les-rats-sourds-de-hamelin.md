# 070 - Les rats sourds de Hamelin

## Analyse de la consigne
Un joueur de flûte (`P`) mène les rats vers la droite. Un rat est noté `O~` s'il se déplace vers la gauche et `~O` s'il se déplace vers la droite. La fonction doit compter les rats sourds, c'est-à-dire ceux qui vont dans la mauvaise direction (vers la gauche, ou situés avant le joueur de flûte).

## Le Contrat
- **Entrée** : `townSquare` (string) - la représentation de la place avec les rats et le joueur de flûte.
- **Sortie** : (number) - le nombre de rats sourds.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { countDeafRats } from './index.js';

assert.strictEqual(countDeafRats("~O~O~O~O P"), 0);
assert.strictEqual(countDeafRats("P O~ O~ ~O O~"), 1);
assert.strictEqual(countDeafRats("~O~O~O~OP~O~OO~"), 2);
```

## Starter Code
```javascript
export function countDeafRats(townSquare) {
  // Votre solution ici
}
```
