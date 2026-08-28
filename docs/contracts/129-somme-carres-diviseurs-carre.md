# Somme carrés diviseurs = carré ?

## Analyse de la consigne
> Les diviseurs de 42 sont : 1, 2, 3, 6, 7, 14, 21, 42. Ces diviseurs au carré sont : 1, 4, 9, 36, 49, 196, 441, 
1764. La somme des diviseurs carrés est de 2500 qui est 50 * 50, un carré ! 
A partir de deux entiers m, n (1 <= m <= n), nous voulons trouver tous les nombres entiers entre m et n 
dont la somme des diviseurs au carré est elle-même un carré. 42 est un tel nombre. 
Le résultat sera un tableau de tableaux, chaque élément ayant deux éléments, d'abord le nombre dont les 
diviseurs au carré sont un carré puis la somme des diviseurs au carré. 
  55 
List_squared (1, 250)  [[1, 1], [42, 2500], [246, 84100]] 
List_squared (42, 250)  [[42, 2500], [246, 84100]]

## Le Contrat
- **Entrées** : m, n
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { deepStrictEqual } = require('assert');
deepStrictEqual(listSquared(42, 250), [[42, 2500], [246, 84100]]);
```

## Starter Code
```javascript
function listSquared(m, n) {
  // Votre code ici
}
```
