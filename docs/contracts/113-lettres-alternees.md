# Lettres alternées ?

## Analyse de la consigne
La fonction vérifie si un mot est composé d'une alternance stricte de voyelles (a, e, i, o, u) et de consonnes.
- **Entrée :** `word` (String).
- **Sortie :** `Boolean`.

## Le Contrat
La fonction parcourt les lettres du mot et vérifie qu'aucune voyelle n'est adjacente à une autre voyelle, et qu'aucune consonne n'est adjacente à une autre consonne.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(isAlt("amazon"), true);
assert.equal(isAlt("apple"), false);
assert.equal(isAlt("banana"), true);
assert.equal(isAlt("a"), true);
```

## Starter Code
```javascript
export function isAlt(word) {
  // Votre code ici
  return false;
}
```
