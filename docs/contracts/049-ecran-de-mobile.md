# Exercice 049 : Écran de mobile

## Analyse de la consigne
Simuler la saisie sur un clavier T9 d'ancien mobile. Additionner le nombre de pressions pour chaque caractère.

## Le Contrat
Entrée : chaine de caractères (word). Sortie : entier représentant le total de pressions.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { mobileKeyboard } from '../src/49-ecran-de-mobile';

describe('mobileKeyboard', () => {
  it('calcule le nombre de frappes', () => {
    expect(mobileKeyboard('123')).toBe(3);
    expect(mobileKeyboard('abc')).toBe(9);
    expect(mobileKeyboard('codewars')).toBe(26);
  });
});
```

## Starter Code
```ts
export function mobileKeyboard(word: string): number {
  // Votre code ici
}
```
