# Exercice 055 : Ordre des mots

## Analyse de la consigne
Trier les mots d'une phrase en fonction du nombre (1-9) contenu dans chaque mot.

## Le Contrat
Entrée : chaine de mots. Sortie : chaine triée.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { order } from '../src/55-ordre-des-mots';

describe('order', () => {
  it('trie par numéro', () => {
    expect(order('is2 Thi1s T4est 3a')).toBe('Thi1s is2 3a T4est');
    expect(order('')).toBe('');
  });
});
```

## Starter Code
```ts
export function order(words: string): string {
  // Votre code ici
}
```
