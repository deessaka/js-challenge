# 083 - Diversité des langages

## Analyse de la consigne
Trois langages sont représentés dans une liste de programmeurs : Python, Ruby et JavaScript. La fonction doit renvoyer `true` si aucun langage n'est représenté plus de 2 fois par rapport à un autre, `false` sinon (ex : 6 Python contre 2 Ruby → Python est 3x plus représenté → `false`).

## Le Contrat
- **Entrée** : `list` (Array<{firstName, lastName, country, continent, age, language}>).
- **Sortie** : (boolean) - `true` si la répartition des langages est équilibrée (ratio max de 2x entre deux langages).

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { isLanguageDiverse } from './index.js';

assert.strictEqual(
  isLanguageDiverse([
    { firstName: 'Daniel', lastName: 'J.', country: 'Aruba', continent: 'Americas', age: 42, language: 'Python' },
    { firstName: 'Kseniya', lastName: 'T.', country: 'Belarus', continent: 'Europe', age: 22, language: 'Ruby' },
    { firstName: 'Jayden', lastName: 'P.', country: 'Jamaica', continent: 'Americas', age: 18, language: 'JavaScript' },
    { firstName: 'Joao', lastName: 'D.', country: 'Portugal', continent: 'Europe', age: 25, language: 'JavaScript' },
  ]),
  true
);

// 6 programmeurs Python contre 2 Ruby : Python est 3x plus représenté que Ruby => false
const unbalanced = [
  ...Array.from({ length: 6 }, (_, i) => ({ firstName: `P${i}`, lastName: 'X.', country: 'X', continent: 'X', age: 30, language: 'Python' })),
  ...Array.from({ length: 2 }, (_, i) => ({ firstName: `R${i}`, lastName: 'X.', country: 'X', continent: 'X', age: 30, language: 'Ruby' })),
];
assert.strictEqual(isLanguageDiverse(unbalanced), false);
```

## Starter Code
```javascript
export function isLanguageDiverse(list) {
  // Votre solution ici
}
```
