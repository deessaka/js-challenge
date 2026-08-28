# Exercice 057 : Distribution d’électrons

## Analyse de la consigne
Remplir des couches d'électrons avec la formule 2*n², où n commence à 1, jusqu'à épuisement du nombre d'électrons.

## Le Contrat
Entrée : entier (atomicNumber). Sortie : tableau d'entiers (couches).

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { atomicNumber } from '../src/57-distribution-d-electrons';

describe('atomicNumber', () => {
  it('répartit les électrons', () => {
    expect(atomicNumber(1)).toEqual([1]);
    expect(atomicNumber(10)).toEqual([2, 8]);
    expect(atomicNumber(47)).toEqual([2, 8, 18, 19]);
  });
});
```

## Starter Code
```ts
export function atomicNumber(num: number): number[] {
  // Votre code ici
}
```
