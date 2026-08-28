# 077 - Discours politique

## Analyse de la consigne
Il faut détecter si un discours est bien celui du président, sachant que ses discours contiennent beaucoup de voyelles répétées. Le score est le nombre de voyelles répétées consécutivement (au-delà de la première occurrence) divisé par le nombre total de voyelles distinctes répétées dans le discours.

## Le Contrat
- **Entrée** : `speech` (string).
- **Sortie** : (number) - le score de "président-itude" du discours.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { trumpDetector } from './index.js';

assert.strictEqual(trumpDetector("I will build a huge wall"), 0); // pas de voyelle répétée
assert.strictEqual(trumpDetector("HUUUUUGEEEE WAAAAAALL"), 4); // 4 U en trop + 3 E + 5 A = 12 / 3 voyelles
assert.strictEqual(trumpDetector("MEXICAAAAAAAANS GOOOO HOOOMEEEE"), 2.5); // 7A+3O+2O+3E=15 / 6 voyelles
```

## Starter Code
```javascript
export function trumpDetector(speech) {
  // Votre solution ici
}
```
