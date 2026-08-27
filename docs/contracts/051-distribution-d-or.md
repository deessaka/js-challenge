# Exercice 051 : Distribution d’or

## Analyse de la consigne
Deux joueurs prennent tour à tour la plus grande valeur aux extrémités d'un tableau jusqu'à épuisement. A commence. En cas d'égalité, prendre à gauche.

## Le Contrat
Entrée : tableau d'entiers (golds). Sortie : un tableau contenant [scoreA, scoreB].

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { distributionOf } from '../src/51-distribution-d-or';

describe('distributionOf', () => {
  it('calcule les scores', () => {
    expect(distributionOf([4, 2, 9, 5, 2, 7])).toEqual([14, 15]);
    expect(distributionOf([10, 1000, 2, 1])).toEqual([12, 1001]);
  });
});
```

## Starter Code
```ts
export function distributionOf(golds: number[]): [number, number] {
  // Votre code ici
}
```
