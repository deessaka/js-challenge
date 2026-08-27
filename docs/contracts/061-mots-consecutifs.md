# Exercice 061 : Mots consécutifs

## Analyse de la consigne
Concaténer k chaînes consécutives d'un tableau et renvoyer la première ayant la plus grande longueur totale.

## Le Contrat
Entrée : tableau de chaînes (strarr), entier (k). Sortie : chaine de caractères.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { longestConsec } from '../src/61-mots-consecutifs';

describe('longestConsec', () => {
  it('trouve la plus longue', () => {
    expect(longestConsec(["zone", "abigail", "theta", "forme", "libe", "zas", "theta", "abigail"], 2)).toBe('abigailtheta');
  });
});
```

## Starter Code
```ts
export function longestConsec(strarr: string[], k: number): string {
  // Votre code ici
}
```
