# Combinaisons téléphoniques

## Analyse de la consigne
> A partir d’une chaine de nombres, retournez toutes les combinaisons possibles de lettres. 
Par exemple : 
letterCombinations("23") 
 Array [ "ad", "bd", "cd", "ae", "be", "ce", "af", "bf", "cf" ] 
  56 
Les chiffres utilisés seront uniquement ceux entre 2 et 9.

## Le Contrat
- **Entrées** : digits
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { deepStrictEqual } = require('assert');
deepStrictEqual(letterCombinations("23"), ["ad", "bd", "cd", "ae", "be", "ce", "af", "bf", "cf"]);
```

## Starter Code
```javascript
function letterCombinations(digits) {
  // Votre code ici
}
```
