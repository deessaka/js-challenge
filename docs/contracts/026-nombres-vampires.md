# Nombres vampires

## Analyse de la consigne
Notre définition d’un nombre vampire peut être décrite comme suit :  6 * 21 = 126  Les chiffres 6, 1 et 2 sont présents dans le produit et le résultat, c’est un nombre vampire.  10 * 11 = 110  110 n'est pas un numéro vampire car il y a trois 1 dans le terme de gauche mais seulement deux 1 dans  le produit  vampire_test (21,6)  true  vampire_test (204,615)  true  (204 * 615 = 125460)  vampire_test (30, -51)  true ( 30 * -51 = -1530)  vampire_test (-246, -510)  false  (-246 * -510 = 125460)  vampire_test (2947050,8469153)  true

## Le Contrat
- **Entrées** : num1, num2
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { vampire_test } from './solution';

describe('Nombres vampires', () => {
  it('Test case 1', () => {
    expect(vampire_test (21,6)).toEqual(true);
  });
});

```

## Starter Code
```javascript
export function vampire_test(num1, num2) {
  // TODO
}

```
