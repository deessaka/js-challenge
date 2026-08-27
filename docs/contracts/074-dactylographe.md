# 074 - Dactylographe

## Analyse de la consigne
John tape au clavier sans jamais utiliser la touche Shift, uniquement Caps Lock, pour changer de casse. À partir d'une chaîne de caractères, la fonction doit compter le nombre total de touches pressées (lettres plus bascules de Caps Lock), en supposant que Caps Lock est éteint au départ.

## Le Contrat
- **Entrée** : `s` (string) - le texte tapé par John.
- **Sortie** : (number) - le nombre de touches pressées.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { typist } from './index.js';

assert.strictEqual(typist("a"), 1);
assert.strictEqual(typist("aa"), 2);
assert.strictEqual(typist("A"), 2); // Caps Lock + « a »
assert.strictEqual(typist("AA"), 3);
assert.strictEqual(typist("aA"), 3); // « a » + Caps Lock + « a »
assert.strictEqual(typist("Aa"), 4);
assert.strictEqual(typist("BeiJingDaXueDongMen"), 31);
assert.strictEqual(typist("AAAaaaBBBbbbABAB"), 21);
assert.strictEqual(typist("AmericanRAILWAY"), 18);
assert.strictEqual(typist("AaAaAa"), 12);
assert.strictEqual(typist("DFjfkdaB"), 11);
```

## Starter Code
```javascript
export function typist(s) {
  // Votre solution ici
}
```
