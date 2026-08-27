# Exercice 063 : Notation Polonaise Inverse

## Analyse de la consigne
Évaluer une expression mathématique sous forme de notation polonaise inverse (NPI/RPN).

## Le Contrat
Entrée : chaine de caractères (expression). Sortie : nombre.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { solvePostfix } from '../src/63-notation-polonaise-inverse';

describe('solvePostfix', () => {
  it('évalue RPN', () => {
    expect(solvePostfix('2 3 +')).toBe(5);
    expect(solvePostfix('10 5 / 7 + 3 ^ 10 -')).toBe(719);
  });
});
```

## Starter Code
```ts
export function solvePostfix(expr: string): number {
  // Votre code ici
}
```
