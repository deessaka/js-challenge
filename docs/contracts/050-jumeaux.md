# Exercice 050 : Jumeaux

## Analyse de la consigne
Trouver le premier nombre qui apparait deux fois dans un tableau (un doublon).

## Le Contrat
Entrée : tableau d'entiers. Sortie : l'entier dupliqué, ou null si aucun.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { elimination } from '../src/50-jumeaux';

describe('elimination', () => {
  it('trouve le jumeau', () => {
    expect(elimination([2, 5, 34, 1, 22, 1])).toBe(1);
    expect(elimination([2, 5, 34, 1, 22])).toBeNull();
  });
});
```

## Starter Code
```ts
export function elimination(arr: number[]): number | null {
  // Votre code ici
}
```
