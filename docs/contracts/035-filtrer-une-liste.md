# Filtrer une liste

## Analyse de la consigne
Créez une fonction qui prend une liste d'entiers ou de chaînes de caractères et renvoie une nouvelle liste  en ayant filtré uniquement les nombres.  Filter_list ([1,2, 'a', 'b'])  [1,2]  Filter_list ([1, 'a', 'b', 0,15])  [1,0,15]  Filter_list ([1,2, 'aasf', '3', '124', 123])  [1,2,123]

## Le Contrat
- **Entrées** : arr1, num2, str3, arr4
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { Filter_list } from './solution';

describe('Filtrer une liste', () => {
  it('Test case 1', () => {
    expect(Filter_list ([1,2, 'a', 'b'])).toEqual([1,2]);
  });
});

```

## Starter Code
```javascript
export function Filter_list(arr1, num2, str3, arr4) {
  // TODO
}

```
