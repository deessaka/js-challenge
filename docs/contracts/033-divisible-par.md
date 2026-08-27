# Divisible par ?

## Analyse de la consigne
Créez une fonction qui vérifie si le premier argument n est divisible par tous les autres arguments.  IsDivisible (6,1,3)  true // car 6 est divisible par 1 et 3    21  IsDivisible (12,2)  true // car 12 est divisible par 2  IsDivisible (100,5,4,10,25,20)  true  IsDivisible (12,7)  false // parce que 12 n'est pas divisible par 7

## Le Contrat
- **Entrées** : num1, num2, num3
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { IsDivisible } from './solution';

describe('Divisible par ?', () => {
  it('Test case 1', () => {
    expect(IsDivisible (6,1,3)).toEqual(true);
  });
});

```

## Starter Code
```javascript
export function IsDivisible(num1, num2, num3) {
  // TODO
}

```
