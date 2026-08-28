# Deviner un mot

## Analyse de la consigne
Un joueur doit deviner un mot dont il connait la longueur. Écrire une fonction qui, à partir du mot secret  et de la proposition du joueur, retourne le nombre de lettres bien placées.   CountCorrectCharacters("dog", "car")  0 (Aucune lettre)  CountCorrectCharacters("dog", "god")  1 (Le "o" est bien placé)  CountCorrectCharacters("dog", "cog")  2 ("o" et "g" bien placés)  CountCorrectCharacters("dog", "cod")  1 ("o")  CountCorrectCharacters("dog", "bog")  2 ("o" et "g")  CountCorrectCharacters("dog", "dog")  3  Vous devrez vous s\'assurer que le mot proposé a bien la même longueur que le mot secret, dans le cas  contraire vous devrez générer une exception avec le texte « Mauvaise longueur ».

## Le Contrat
- **Entrées** : str1, str2
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { CountCorrectCharacters } from './solution';

describe('Deviner un mot', () => {
  it('Test case 1', () => {
    expect(CountCorrectCharacters("dog", "car")).toEqual(0);
  });
});

```

## Starter Code
```javascript
export function CountCorrectCharacters(str1, str2) {
  // TODO
}

```
