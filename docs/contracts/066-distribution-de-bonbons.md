# 066 - Distribution de bonbons

## Analyse de la consigne
Des enfants disposés en cercle possèdent chacun un nombre de bonbons (`candies`). À chaque tour, chaque enfant donne la moitié de ses bonbons à son voisin de droite (simultanément) ; si son nombre de bonbons est impair, l'instituteur lui en donne un supplémentaire avant le partage. On répète jusqu'à ce que tous les enfants aient le même nombre de bonbons. La fonction doit renvoyer le nombre de tours effectués et le nombre de bonbons final par enfant.

## Le Contrat
- **Entrée** : `candies` (number[]) - le nombre de bonbons de chaque enfant, dans l'ordre du cercle.
- **Sortie** : (number[]) - `[nombreDeTours, bonbonsParEnfantALaFin]`.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { distributionOfCandy } from './index.js';

assert.deepStrictEqual(distributionOfCandy([1, 2, 3, 4, 5]), [6, 6]);
```

## Starter Code
```javascript
export function distributionOfCandy(candies) {
  // Votre solution ici
}
```
