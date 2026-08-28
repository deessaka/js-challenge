# Ascenseur ou pas ?

## Analyse de la consigne
John vit  au  nième  étage d'un immeuble. Chaque matin, il descend le plus rapidement possible pour aller  à son travail qu’il adore. Il a deux manières de descendre : marcher ou prendre l'ascenseur.  Lorsque John utilise l'ascenseur, il suit les étapes suivantes  1. Attendre l'ascenseur qui va aller de l’étage m à l’étage n où il habite  2. Attendre que la porte de l’ascenseur s’ouvre et entrer  3. Attendre qu’elle se referme  4. Attendre que l’ascenseur descende à l’étage 1  5. Attendre que la porte s’ouvre et sortir  (Les temps d'entrée / sortie de l'ascenseur seront ignorés)  On vous donne les éléments suivants  n : nombre entier. Le niveau où habite de John  m : nombre entier. Le niveau où est l'ascenseur   Vitesses : un ensemble d'entiers. Il contient quatre entiers [a, b, c, d]  a: Les secondes requises lorsque l'ascenseur monte ou descend d’un étage  b: Les secondes nécessaires pour que la porte s’ouvre  c: Les secondes nécessaires pour que la porte se ferme  d: Les secondes nécessaires pour que John descende un étage à pied  Aidez John à calculer le temps le plus court arriver au niveau 1.  Exemples  - Pour n = 5, m = 6 et vitesses = [1,2,3,10], la sortie devrait être 12.  En  effet, avec l’ascenseur il  faudra : 1  +  2  +  3  +  4  +  2  =  12 (1s pour que l’ascenseur arrive,  2s  pour  l’ouverture, 3s pour la fermeture, 4s pour descendre et 2s pour l’ouverture). A pieds il lui faudrait 4 x 10  = 40s.  - Pour n = 1, m = 6 et vitesses = [1,2,3,10], la sortie devrait être 0.  John est déjà à 1 étage, donc il part directement de chez lui...  - Pour n = 5, m = 4 et vitesses = [2,3,4,5], la sortie devrait être de 20.  John descend en marchant : 5 x 4 = 20    24

## Le Contrat
- **Entrées** : Lestempsdentresortiedelascenseurserontignors
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { sortir } from './solution';

describe('Ascenseur ou pas ?', () => {
  it('should work', () => {
    // expect(sortir(...)).toEqual(...);
  });
});

```

## Starter Code
```javascript
export function sortir(Lestempsdentresortiedelascenseurserontignors) {
  // TODO
}

```
