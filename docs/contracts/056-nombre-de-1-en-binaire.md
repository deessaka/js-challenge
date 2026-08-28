# Exercice 056 : Nombre de 1 en binaire

## Analyse de la consigne
Convertir un entier en base 2 et compter le nombre de caractères '1'.

## Le Contrat
Entrée : nombre entier positif (n). Sortie : entier (nombre de bits à 1).

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { countBits } from '../src/56-nombre-de-1-en-binaire';

describe('countBits', () => {
  it('compte les bits 1', () => {
    expect(countBits(0)).toBe(0);
    expect(countBits(4)).toBe(1);
    expect(countBits(7)).toBe(3);
    expect(countBits(1234)).toBe(5);
  });
});
```

## Starter Code
```ts
export function countBits(n: number): number {
  // Votre code ici
}
```
