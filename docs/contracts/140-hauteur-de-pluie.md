# Hauteur de pluie

## Analyse de la consigne
> Étant donné un tableau de hauteurs qui contient des nombres entiers positifs ou nuls. Il représente une 
carte d'élévation où la largeur de chaque barre est 1. Calculez la quantité d'eau qu'elle peut piéger après 
la pluie.  
Hauteurs = [1,0,2,1,0,1,3,2,1,2,1] 
              H 
      H       H H  H 
 H   H H  H H H H H H 
 1 0 2 1 0 1 3 2 1 2 1 
              H 
      H * * * H H * H 
 H * H H * H H H H H H 
 1 0 2 1 0 1 3 2 1 2 1 
Dans ce cas on doit obtenir 6 
TrapWater ([1,0,2,1,0,1,3,2,1,2,1]) === 6 
TrapWater ([10,0,10]) === 10 
TrapWater ([0,10,0]) === 0

## Le Contrat
- **Entrées** : heights
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
strictEqual(trapWater([1,0,2,1,0,1,3,2,1,2,1]), 6);
```

## Starter Code
```javascript
function trapWater(heights) {
  // Votre code ici
}
```
