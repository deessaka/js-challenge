# Énumération des permutations

## Analyse de la consigne
La consigne demande de générer toutes les permutations possibles d'une chaîne de caractères donnée, en s'assurant qu'il n'y ait aucun doublon dans la liste finale retournée.

## Le Contrat
- **Entrée** : `str` (string) - Une chaîne de caractères à permuter.
- **Sortie** : (Array<string>) - Un tableau contenant toutes les permutations uniques de `str`.

## Test proposé
```javascript
const assert = require('assert');

assert.deepStrictEqual(permutations('a').sort(), ['a']);
assert.deepStrictEqual(permutations('ab').sort(), ['ab', 'ba'].sort());
assert.deepStrictEqual(permutations('aabb').sort(), ['aabb', 'abab', 'abba', 'baab', 'baba', 'bbaa'].sort());
```

## Starter Code
```javascript
function permutations(str) {
  // Votre code ici
  return [];
}
```
