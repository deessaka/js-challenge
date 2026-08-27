# Jason

## Analyse de la consigne
C'est vendredi 13 et Jason est prêt pour son premier meurtre !  Créez  une  fonction killcount, qui accepte deux arguments : un tableau de couples d’éléments (le nom  d’une personne et son intelligence, par exemple [\"Tchad\", 2]) et un entier représentant l'intelligence de  Jason.  var counselers = [[\"Tchad\", 2], [\"Tommy\", 9]]  var jason = 7  Votre fonction doit renvoyer les noms de toutes les personnes qui ont une intelligence inférieure à Jason  et donc qui peuvent être tuées par lui.  killcount([['Tiffany',4],['Jack',6],['Megan',7],['Tyler',3]],6)   ['Tiffany', 'Tyler']

## Le Contrat
- **Entrées** : lenomdunepersonneetsonintelligence, parexempleTchad, arr3
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { ments } from './solution';

describe('Jason', () => {
  it('should work', () => {
    // expect(ments(...)).toEqual(...);
  });
});

```

## Starter Code
```javascript
export function ments(lenomdunepersonneetsonintelligence, parexempleTchad, arr3) {
  // TODO
}

```
