# Carte crédit – date d’expiration

## Analyse de la consigne
Vous recevrez  une  chaîne  de  caractères  comme  entrée.  Il  aura  le  mois  (2  chiffres)  et  l\'année  (2  ou  4  chiffres). Ceux-ci sont séparés par un caractère ("-", "/" ou peut-être plusieurs espaces). Par exemple :  02/21  02/21  02 / 2021  02-2021  Votre tâche consiste à écrire une fonction qui renvoie true ou false suivant que la carte est encore valide  ou non.   Remarque : si la carte le mois courant, renvoyez true.    18

## Le Contrat
- **Entrées** : arg2chiffres
- **Sortie** : Résultat attendu

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { mois } from './solution';

describe('Carte crédit – date d’expiration', () => {
  it('should work', () => {
    // expect(mois(...)).toEqual(...);
  });
});

```

## Starter Code
```javascript
export function mois(arg2chiffres) {
  // TODO
}

```
