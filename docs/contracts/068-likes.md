# 068 - Likes

## Analyse de la consigne
Comme le système de "like" de Facebook, la fonction doit générer le texte affiché à côté d'un élément à partir de la liste des noms des personnes qui l'aiment.

## Le Contrat
- **Entrée** : `names` (string[]) - les noms des personnes qui aiment l'élément.
- **Sortie** : (string) - le texte d'affichage correspondant.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { likes } from './index.js';

assert.strictEqual(likes([]), 'no one likes this');
assert.strictEqual(likes(['Peter']), 'Peter likes this');
assert.strictEqual(likes(['Jacob', 'Alex']), 'Jacob and Alex like this');
assert.strictEqual(likes(['Max', 'John', 'Mark']), 'Max, John and Mark like this');
assert.strictEqual(likes(['Alex', 'Jacob', 'Mark', 'Max']), 'Alex, Jacob and 2 others like this');
```

## Starter Code
```javascript
export function likes(names) {
  // Votre solution ici
}
```
