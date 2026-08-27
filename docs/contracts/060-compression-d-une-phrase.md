# Exercice 060 : Compression d’une phrase

## Analyse de la consigne
Supprimer les espaces, nombres et ponctuation d'une chaine pour ne garder que les lettres (majuscules/minuscules).

## Le Contrat
Entrée : chaine de caractères. Sortie : chaine modifiée.

## Test proposé
```ts
import { describe, it, expect } from 'vitest';
import { compressSentence } from '../src/60-compression-d-une-phrase';

describe('compressSentence', () => {
  it('compresse', () => {
    expect(compressSentence('Hello World 2017 !')).toBe('HelloWorld');
  });
});
```

## Starter Code
```ts
export function compressSentence(sentence: string): string {
  // Votre code ici
}
```
