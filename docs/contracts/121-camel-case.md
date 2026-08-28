# Camel Case

## Analyse de la consigne
Convertir une chaîne de mots séparés par des tirets (`-`) ou des underscores (`_`) en "camelCase". Le premier mot conserve sa casse initiale, les mots suivants commencent par une majuscule.
- **Entrée :** `str` (String).
- **Sortie :** `String`.

## Le Contrat
La fonction divise la chaîne selon les séparateurs `-` ou `_`. Le premier élément est gardé tel quel. Les suivants ont leur première lettre mise en majuscule. Tous les éléments sont ensuite joints.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(toCamelCase(""), "");
assert.equal(toCamelCase("the_stealth_warrior"), "theStealthWarrior");
assert.equal(toCamelCase("The-Stealth-Warrior"), "TheStealthWarrior");
```

## Starter Code
```javascript
export function toCamelCase(str) {
  // Votre code ici
  return "";
}
```
