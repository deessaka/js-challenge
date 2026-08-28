# Nombres les plus grands et plus petits d’une liste

## Analyse de la consigne
Vous recevez une chaîne de nombres séparés par des espaces et vous devez renvoyer le nombre le plus  grand et le plus petit.  highAndLow("1 2 3 4 5")  "5 1"  highAndLow("1 2 -3 4 5")  "5 -3"  highAndLow("1 9 3 4 -5")  "9 -5"

## Le Contrat
- **Entrées** : arg12345
- **Sortie** : Résultat attendu

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { highAndLow } from './solution';

describe('Nombres les plus grands et plus petits d’une liste', () => {
  it('Test case 1', () => {
    expect(highAndLow("1 2 3 4 5")).toEqual("5 1");
  });
  it('Test case 2', () => {
    expect(highAndLow("1 2 -3 4 5")).toEqual("5 -3");
  });
  it('Test case 3', () => {
    expect(highAndLow("1 9 3 4 -5")).toEqual("9 -5");
  });
});

```

## Starter Code
```javascript
export function highAndLow(arg12345) {
  // TODO
}

```
