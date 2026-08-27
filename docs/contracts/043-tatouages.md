# Exercice 043 : Tatouages

## Analyse de la consigne
L'objectif est de parcourir un tableau et de remplacer toutes les occurrences du caractère 'X' par '*'. Les autres éléments doivent rester intacts.

## Le Contrat
Entrée : un tableau (skinScan). Sortie : un tableau modifié.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { removeTattoos } from '../src/43-tatouages';

describe('removeTattoos', () => {
  it('remplace les X par des *', () => {
    expect(removeTattoos(['X', 'a', 'X', 'b'])).toEqual(['*', 'a', '*', 'b']);
    expect(removeTattoos(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });
});
```

## Starter Code
```ts
export function removeTattoos(skinScan: string[]): string[] {
  // Votre code ici
}
```
