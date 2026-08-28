# Écriture d’intervalles

## Analyse de la consigne
> On veut formater une liste ordonnée d'entiers en les séparant par des virgules telles que l’on ait : 
- des nombres entiers seuls 
- des plages d’entiers séparés par un tiret '-'. Cette plage comprend tous les entiers dans l'intervalle, y 
compris les extrémités et doit s’étendre sur au moins 3 nombres. Par exemple (\"12, 13, 15-17\") 
Écrire  une  fonction  qui  prend  en  entrée  une  liste  d'entiers  en  ordre  croissant  et  renvoie  une  chaîne 
correctement formatée. Exemple : 
solution([-6, -3, -2, -1, 0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20]) 
 \"-6,-3-1,3-5,7-11,14,15,17-20\"

## Le Contrat
- **Entrées** : list
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
strictEqual(solution([-6, -3, -2, -1, 0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20]), "-6,-3-1,3-5,7-11,14,15,17-20");
```

## Starter Code
```javascript
function solution(list) {
  // Votre code ici
}
```
