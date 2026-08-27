# Exercice 059 : Touches d’un piano

## Analyse de la consigne
Déterminer la couleur ou la note d'une touche de piano sur un clavier cyclique de 88 touches.

## Le Contrat
Entrée : entier (index). Sortie : chaine de caractères ('white' / 'black', ou nom de la note).

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { blackOrWhiteKey, whichNote } from '../src/59-touches-d-un-piano';

describe('Piano keys', () => {
  it('retourne la couleur', () => {
    expect(blackOrWhiteKey(1)).toBe('white');
    expect(blackOrWhiteKey(12)).toBe('black');
  });
  
  it('retourne la note', () => {
    expect(whichNote(1)).toBe('A');
    expect(whichNote(12)).toBe('G#');
  });
});
```

## Starter Code
```ts
export function blackOrWhiteKey(keyIndex: number): string {
  // Votre code ici
}

export function whichNote(keyIndex: number): string {
  // Votre code ici
}
```
