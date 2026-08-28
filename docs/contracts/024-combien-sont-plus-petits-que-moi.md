# Combien sont plus petits que moi ?

## Analyse de la consigne
Écrire une fonction smaller(arr) qui donne le nombre de nombres à droite de arr[i] qui lui sont inférieurs.  Par exemple :  smaller([5, 4, 3, 2, 1]) === [4, 3, 2, 1, 0] // 4 nombres plus petits à droite de 5   smaller([1, 2, 0]) === [1, 1, 0] // Un plus petit que 1 (0), un plus petit que 2 (0)

## Le Contrat
- **Entrées** : arr
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { smaller } from './solution';

describe('Combien sont plus petits que moi ?', () => {
  it('should work', () => {
    // expect(smaller(...)).toEqual(...);
  });
});

```

## Starter Code
```javascript
export function smaller(arr) {
  // TODO
}

```
