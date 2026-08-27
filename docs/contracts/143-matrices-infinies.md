# Matrices infinies

## Analyse de la consigne
> Grace au code ci-dessous (à copier-coller), nous pouvons construire des matrices à 2 dimensions infinies 
où chaque élément est false sauf celui aux coordonnées n, m. Écrivez une fonction qui prend une telle 
matrice et renvoie la paire d'indices où la matrice est true. 
const generate = (m,n)=>{ 
  var hithandler = { 
    get: (_,col)=>col==n?true:false, 
    set: ()=>false 
  } 
  var misshandler = { 
    get: ()=>false, set: ()=>false 
  } 
  var hit = new Proxy({}, hithandler); 
  var miss = new Proxy({}, misshandler); 
  var rowhandler = { 
    get: (_,row)=>row==m?hit:miss, 
    set: ()=>false 
  }; 
  var p = new Proxy({}, rowhandler); 
  return p; 
} 
  63 
Vous pouvez utiliser mat[j][i] normalement pour accéder aux éléments  qui seront tous faux, sauf lorsque 
j = m et i = n. Cependant, les proxies se comportent tout à fait différemment des tableaux, de sorte que 
les méthodes standards ne fonctionneront pas. 
var mat = generate(0,10) 
findTrue(mat)  [0,10]

## Le Contrat
- **Entrées** : matrix
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { deepStrictEqual } = require('assert');
// deepStrictEqual(findTrue(mat), [0, 10])
```

## Starter Code
```javascript
function findTrue(matrix) {
  // Votre code ici
}
```
