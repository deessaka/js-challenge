# Exercice 053 : Shushis

## Analyse de la consigne
Calculer la facture de sushis. 2$ l'assiette rouge ('r'), la 5ème est gratuite. L'espace ' ' est ignoré.

## Le Contrat
Entrée : chaine de caractères (plates). Sortie : entier (montant total).

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { totalBill } from '../src/53-shushis';

describe('totalBill', () => {
  it('calcule la facture', () => {
    expect(totalBill('rr')).toBe(4);
    expect(totalBill('rr rrr')).toBe(8);
    expect(totalBill('rr rrr rrr rr')).toBe(16);
  });
});
```

## Starter Code
```ts
export function totalBill(plates: string): number {
  // Votre code ici
}
```
