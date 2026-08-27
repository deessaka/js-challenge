# Exercice 045 : Taco Bell

## Analyse de la consigne
Convertir un mot en tableau d'ingrédients selon une table de correspondance. Les consonnes spécifiques ont des correspondances, toutes les voyelles (sauf 'y') donnent 'beef'. Les autres lettres sont ignorées. Le résultat doit toujours commencer et finir par 'shell'.

## Le Contrat
Entrée : mot (string). Sortie : tableau de chaines (string[]).

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { tacofy } from '../src/45-taco-bell';

describe('tacofy', () => {
  it('convertit les mots en ingrédients', () => {
    expect(tacofy('')).toEqual(['shell', 'shell']);
    expect(tacofy('a')).toEqual(['shell', 'beef', 'shell']);
    expect(tacofy('ggg')).toEqual(['shell', 'guacamole', 'guacamole', 'guacamole', 'shell']);
  });
});
```

## Starter Code
```ts
export function tacofy(word: string): string[] {
  // Votre code ici
}
```
