# Exercice 046 : Différence entre 2 collections

## Analyse de la consigne
Trouver les éléments uniques exclusifs à chaque tableau, puis les fusionner, supprimer les doublons et les trier par ordre alphabétique.

## Le Contrat
Entrée : deux tableaux de chaînes (a, b). Sortie : un tableau de chaînes trié.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { diff } from '../src/46-difference-entre-2-collections';

describe('diff', () => {
  it('trouve la différence et trie', () => {
    const a = ['a', 'b', 'z', 'd', 'e', 'd'];
    const b = ['a', 'b', 'j', 'j'];
    expect(diff(a, b)).toEqual(['d', 'e', 'j', 'z']);
  });
});
```

## Starter Code
```ts
export function diff(a: string[], b: string[]): string[] {
  // Votre code ici
}
```
