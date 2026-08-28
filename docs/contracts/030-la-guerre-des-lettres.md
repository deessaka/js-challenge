# La guerre des lettres

## Analyse de la consigne
Il y a deux groupes de lettres hostiles que nous appelerons les lettres de gauche (par exemple « w ») et  les lettres de droite (par exemple « m »).  Vous devez écrire une fonction qui accepte une chaîne de combat et donne en retour le gagnant. Lorsque  le  côté  gauche  gagne,  retournez Left  side  wins! (Le  côté  gauche  gagne !), lorsque c’est le côté droit  Right  side  wins! (Le  côté  droit  gagne !), en cas d’égalité retournez Let\'s  fight  again! (battons-nous  encore !)  Voici les lettres et leurs pouvoirs     20  Côté gauche Côté droit  w - 4  p - 3  b - 2  s - 1  m - 4  q - 3  d - 2  z - 1  Les autres lettres n’ont aucun pouvoir.  Exemples de combats  alphabetWar("z");         Right side wins!  alphabetWar("zdqmwpbs");  Let\'s fight again!  alphabetWar("zzzzs");     Right side wins!  alphabetWar("wwwwwwz");   Left side wins!

## Le Contrat
- **Entrées** : parexemplew
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { gauche } from './solution';

describe('La guerre des lettres', () => {
  it('should work', () => {
    // expect(gauche(...)).toEqual(...);
  });
});

```

## Starter Code
```javascript
export function gauche(parexemplew) {
  // TODO
}

```
