# Nouvelle guerre des lettres

## Analyse de la consigne
La guerre continue entre les lettres ! Aidez-nous à déterminer quel groupe est plus puissant. Pour cela,  créez une fonction qui accepte 2 paramètres et renvoyez celle qui est plus forte. Chaque lettre a son propre  pouvoir :  A = 1, B = 2, ... Y = 25, Z = 26  a = 0,5, b = 1, ... y = 12,5, z = 13  Seuls les lettres alphabétiques peuvent participer à une bataille.  Le mot dont la puissance totale (a + b + c + ...) est la plus grande gagne.  Si les puissances sont égales, renvoyer « Tie ! »  Exemples  battle("One", "Two")  "Two"  battle("One", "Neo")  "One"  battle("One", "neO")  "Tie!"  battle("Foo", "BAR")  "Tie!"  battle("Four", "Five")  "Four"

## Le Contrat
- **Entrées** : abc
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { totale } from './solution';

describe('Nouvelle guerre des lettres', () => {
  it('should work', () => {
    // expect(totale(...)).toEqual(...);
  });
});

```

## Starter Code
```javascript
export function totale(abc) {
  // TODO
}

```
