# Exercice 052 : Médailles

## Analyse de la consigne
Comparer un temps donné avec les temps limites pour l'or, l'argent et le bronze, et attribuer la meilleure médaille possible.

## Le Contrat
Entrée : time, gold, silver, bronze (chaines HH:MM:SS). Sortie : 'Gold', 'Silver', 'Bronze' ou 'None'.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { evilCodeMedal } from '../src/52-medailles';

describe('evilCodeMedal', () => {
  it('attribue la bonne médaille', () => {
    expect(evilCodeMedal('00:30:00', '00:15:00', '00:45:00', '01:15:00')).toBe('Silver');
    expect(evilCodeMedal('01:15:00', '00:15:00', '00:45:00', '01:15:00')).toBe('None');
    expect(evilCodeMedal('00:00:01', '00:00:10', '00:01:40', '01:00:00')).toBe('Gold');
  });
});
```

## Starter Code
```ts
export function evilCodeMedal(time: string, gold: string, silver: string, bronze: string): string {
  // Votre code ici
}
```
