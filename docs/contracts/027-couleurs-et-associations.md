# Couleurs et associations

## Analyse de la consigne
La couleur joue un rôle important dans nos vies. La plupart d\'entre nous aiment une couleur mieux qu’une  autre. Les spécialistes pensent que certaines couleurs ont des significations psychologiques.  Vous  recevez  en  entrée  un  tableau  composé  d\'une  couleur  et  de  son  association.  La  fonction  que  vous  devez écrire doit renvoyer la couleur en tant que « clé » et l\'association comme sa « valeur ».    19  colourAssociation([["white", "goodness"], ["blue", "tranquility"]])    [{white:"goodness"},{blue:"tranquility"}]  colourAssociation([["red", "energy"],["yellow", "creativity"],["brown" ,  "friendly"],["green", "growth"]])   [{red: "energy"},{yellow: "creativity"}, {brown: "friendly"},{green: "growth"}]

## Le Contrat
- **Entrées** : arr1, arr2, arr3, arr4
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { colourAssociation } from './solution';

describe('Couleurs et associations', () => {
  it('Test case 1', () => {
    expect(colourAssociation([["white", "goodness"], ["blue", "tranquility"]])).toEqual([{"white":"goodness"},{"blue":"tranquility"}]);
  });
});

```

## Starter Code
```javascript
export function colourAssociation(arr1, arr2, arr3, arr4) {
  // TODO
}

```
