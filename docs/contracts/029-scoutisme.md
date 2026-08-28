# Scoutisme

## Analyse de la consigne
Le GA-DE-RY-PO-LU-KI est un codage de substitution utilisé dans le scoutisme pour chiffrer les messages.  Le cryptage est basé sur une clé courte et facile à retenir. La clé la plus fréquemment utilisée est "GA-DE- RY-PO-LU-KI".  G => A  g => a  a => g  A => G  D => E  etc.  Les lettres qui ne figurent pas sur la liste restent dans le texte chiffré sans modifications.  encode("Ala has a cat")  \'Gug hgs g cgt\'  encode("Ala has a cat")  "Gug hgs g cgt"  decode("Gug hgs g cgt")  "Ala has a cat"  encode("ABCD")  "GBCE"  encode("gaderypoluki")  "agedyropulik"

## Le Contrat
- **Entrées** : str1
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { encode } from './solution';

describe('Scoutisme', () => {
  it('Test case 1', () => {
    expect(encode("Ala has a cat")).toEqual(\'Gug hgs g cgt\'  encode);
  });
});

```

## Starter Code
```javascript
export function encode(str1) {
  // TODO
}

```
