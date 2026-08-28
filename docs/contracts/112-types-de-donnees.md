# Types de données

## Analyse de la consigne
La fonction sépare une chaîne contiguë (sans espaces) de lettres et/ou chiffres en types JavaScript logiques : un nombre si la séquence ne contient que des chiffres, un booléen si c'est "true" ou "false", et une chaîne sinon.
- **Entrée :** `str` (String).
- **Sortie :** `Array` de chaînes de caractères ('string', 'number', 'boolean').

## Le Contrat
La fonction doit analyser les mots (séparés par espaces) ou sous-parties de la chaîne pour les classifier. Note : Si la chaîne contient un mélange sans espaces comme "truestring1", elle doit identifier "true" comme boolean, "string" comme string, et "1" comme number.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.deepEqual(dataTypes("You are number 1"), ['string', 'string', 'string', 'number']);
assert.deepEqual(dataTypes("truestring1"), ['boolean', 'string', 'number']);
```

## Starter Code
```javascript
export function dataTypes(str) {
  // Votre code ici
  return [];
}
```
