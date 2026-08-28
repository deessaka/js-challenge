# PowerSet

## Analyse de la consigne
> Compte tenu d'un ensemble nums de nombres entiers, votre tâche est de renvoyer l'ensemble de tous les 
sous-ensembles possibles de nums. 
Pour chaque nombre entier, nous pouvons choisir de le prendre ou de ne pas le prendre. L’idée ici et dans 
un premier temps de ne pas le prendre, puis ensuite de le prendre. Exemple : 
Pour nums = [1, 2], la sortie devra être [[], [2], [1], [1, 2]], en effet : 
Ne pas prendre l'élément 1 
---- ne pas prendre l'élément 2 
--------  ajouter [] 
---- prendre l'élément 2 
--------  ajouter [2] 
Prendre l'élément 1 
---- ne pas prendre l'élément 2 
--------  ajouter [1] 
---- prendre l'élément 2 
--------  ajouter [1, 2] 
Pour nums = [1, 2, 3], la sortie devrait être :  
[[], [3], [2], [2, 3], [1], [1, 3], [1, 2], [1, 2, 3]]

## Le Contrat
- **Entrées** : nums
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { deepStrictEqual } = require('assert');
deepStrictEqual(powerSet([1, 2]), [[], [2], [1], [1, 2]]);
```

## Starter Code
```javascript
function powerSet(nums) {
  // Votre code ici
}
```
