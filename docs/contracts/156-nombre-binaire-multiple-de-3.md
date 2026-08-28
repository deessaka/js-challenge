# Nombre binaire multiple de 3

## Analyse de la consigne
La tâche est de créer une expression régulière (`multipleOf3Regex`) capable de déterminer si une chaîne de caractères, composée uniquement de "0" et de "1" (un nombre binaire), est un multiple de 3. Cette Regex doit fonctionner de la même manière qu'un automate fini déterministe décidant la divisibilité par 3 en base 2.

## Le Contrat
- **Entrée** : Aucune (c'est une constante Expression Régulière). Elle sera testée avec des chaînes de caractères binaires via `multipleOf3Regex.test(string)`.
- **Sortie** : `true` si le nombre est un multiple de 3, `false` sinon.

## Test proposé
```javascript
const assert = require('assert');

assert.strictEqual(multipleOf3Regex.test('11'), true);
assert.strictEqual(multipleOf3Regex.test((372).toString(2)), true);
assert.strictEqual(multipleOf3Regex.test((7).toString(2)), false);
```

## Starter Code
```javascript
const multipleOf3Regex = /^(VotreRegexIci)$/;
```
