# Exercice 047 : Nombre du milieu

## Analyse de la consigne
À partir d'un tableau de 3 nombres, retourner l'index du nombre qui n'est ni le plus grand, ni le plus petit.

## Le Contrat
Entrée : un tableau de 3 nombres (numbers). Sortie : un entier (index).

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { gimme } from '../src/47-nombre-du-milieu';

describe('gimme', () => {
  it('retourne index du milieu', () => {
    expect(gimme([2, 3, 1])).toBe(0);
    expect(gimme([5, 10, 14])).toBe(1);
  });
});
```

## Starter Code
```ts
export function gimme(numbers: number[]): number {
  // Votre code ici
}
```
