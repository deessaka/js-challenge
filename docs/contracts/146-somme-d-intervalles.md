# Somme d’intervalles

## Analyse de la consigne
> Écrivez une fonction sumIntervals qui accepte en entrée une liste d'intervalles et renvoie la somme de 
toutes les longueurs des intervalles. Les chevauchements ne doivent être comptés qu'une seule fois. 
Les intervalles sont représentés par une paire d'entiers sous la forme d’une liste. La première valeur de 
l'intervalle sera toujours inférieure à la seconde valeur. Exemple d'intervalle : [1, 5] est un intervalle de 1 
à 5. La longueur de cet intervalle est de 4. 
Liste contenant des intervalles se chevauchant : 
[ 
    [1,4] 
    [7, 10], 
    [3, 5] 
] 
La  somme  des  longueurs  de  ces  intervalles  est  de  7.  Puisque  [1,  4]  et  [3,  5]  se  chevauchent,  on  peut 
traiter l'intervalle comme [1, 5], qui a une longueur de 4. 
sumIntervals( [[1,2],[6, 10],[11, 15]] )  9 
sumIntervals( [[1,4],[7, 10],[3, 5]] )  7 
sumIntervals( [[1,5],[10, 20],[1, 6],[16, 19],[5, 11]] )  19 
  64

## Le Contrat
- **Entrées** : intervals
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
strictEqual(sumIntervals([[1,2],[6, 10],[11, 15]]), 9);
```

## Starter Code
```javascript
function sumIntervals(intervals) {
  // Votre code ici
}
```
