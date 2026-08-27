# Exercice 062 : Construction d’une tour

## Analyse de la consigne
Construire un tableau de chaines représentant une tour de n étages centrée, formée de '*'.

## Le Contrat
Entrée : entier (n). Sortie : tableau de chaines de caractères.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { towerBuilder } from '../src/62-construction-d-une-tour';

describe('towerBuilder', () => {
  it('construit la tour', () => {
    expect(towerBuilder(3)).toEqual([
      '  *  ',
      ' *** ',
      '*****'
    ]);
  });
});
```

## Starter Code
```ts
export function towerBuilder(nFloors: number): string[] {
  // Votre code ici
}
```
