# Exercice 058 : Numéros de téléphone

## Analyse de la consigne
Transformer un tableau de 10 chiffres en une chaine formatée '(xxx) xxx-xxxx'.

## Le Contrat
Entrée : tableau de 10 entiers. Sortie : chaine de caractères.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { createPhoneNumber } from '../src/58-numeros-de-telephone';

describe('createPhoneNumber', () => {
  it('formate le numéro', () => {
    expect(createPhoneNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])).toBe('(123) 456-7890');
  });
});
```

## Starter Code
```ts
export function createPhoneNumber(numbers: number[]): string {
  // Votre code ici
}
```
