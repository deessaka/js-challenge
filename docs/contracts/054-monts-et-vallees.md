# Exercice 054 : Monts et vallées

## Analyse de la consigne
Trouver les éléments strictement plus grands (mont) ou plus petits (vallée) que leurs 3 voisins à gauche et à droite.

## Le Contrat
Entrée : tableau d'entiers. Sortie : tableau d'entiers contenant les monts et vallées dans l'ordre d'apparition.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { peakAndValley } from '../src/54-monts-et-vallees';

describe('peakAndValley', () => {
  it('trouve les monts et vallées', () => {
    expect(peakAndValley([10,20,30,40,30,20,10,11,12,13,14,15,16,15,14,13])).toEqual([40, 10, 16]);
  });
});
```

## Starter Code
```ts
export function peakAndValley(arr: number[]): number[] {
  // Votre code ici
}
```
