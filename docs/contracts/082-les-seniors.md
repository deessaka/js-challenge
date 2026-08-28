# 082 - Les séniors

## Analyse de la consigne
Étant donné une liste de programmeurs (objets avec un champ `age`), renvoyer la liste de ceux qui ont l'âge le plus élevé.

## Le Contrat
- **Entrée** : `list` (Array<{firstName, lastName, country, continent, age, language}>).
- **Sortie** : (Array) - le sous-ensemble de `list` correspondant aux programmeurs les plus âgés.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { findSenior } from './index.js';

const list = [
  { firstName: 'Gabriel', lastName: 'X.', country: 'Monaco', continent: 'Europe', age: 49, language: 'PHP' },
  { firstName: 'Odval', lastName: 'F.', country: 'Mongolia', continent: 'Asia', age: 38, language: 'Python' },
  { firstName: 'Emilija', lastName: 'S.', country: 'Lithuania', continent: 'Europe', age: 19, language: 'Python' },
  { firstName: 'Sou', lastName: 'B.', country: 'Japan', continent: 'Asia', age: 49, language: 'PHP' },
];

assert.deepStrictEqual(findSenior(list), [
  { firstName: 'Gabriel', lastName: 'X.', country: 'Monaco', continent: 'Europe', age: 49, language: 'PHP' },
  { firstName: 'Sou', lastName: 'B.', country: 'Japan', continent: 'Asia', age: 49, language: 'PHP' },
]);
```

## Starter Code
```javascript
export function findSenior(list) {
  // Votre solution ici
}
```
