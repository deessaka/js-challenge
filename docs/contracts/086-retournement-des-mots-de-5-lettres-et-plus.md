# Exercice 86: Retournement des mots de 5 lettres et plus

## Analyse de la consigne
Écrivez une fonction qui prend une chaîne d'un ou plusieurs mots, et renvoie la même chaîne, mais avec les mots de 5 lettres ou plus inversés.

## Le Contrat
- **Entrée(s) :** `sentence` (chaîne de caractères)
- **Sortie :** (chaîne de caractères) La chaîne modifiée.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { spinWords } from './086-retournement-des-mots-de-5-lettres-et-plus.js';

assert.equal(spinWords("Hey fellow warriors"), "Hey wollef sroirraw");
assert.equal(spinWords("This is a test"), "This is a test");
assert.equal(spinWords("This is another test"), "This is rehtona test");
```

## Starter Code
```javascript
export function spinWords(sentence) {
  // TODO: Implémenter la logique
  return "";
}
```
