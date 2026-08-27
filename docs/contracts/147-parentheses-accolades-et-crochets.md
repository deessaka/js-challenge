# Parenthèses, accolades et crochets

## Analyse de la consigne
> Écrivez une fonction appelée valideBraces qui prend une chaîne de caractères et détermine si l'ordre des 
accolades est valide. ValidBraces doit renvoyer true si la chaîne est valide et false si elle n'est pas valide. 
Toutes  les  chaînes  d'entrée  seront  non  vides  et  ne  comporteront  que  des  parenthèses  ouvertes  '(', 
parenthèses fermées ') ', des crochets ouverts '[', des crochets fermés ']', des accolades '{' et des accolades 
fermées '}'. 
'()  {}  []'  Et  '([{}])'  sont  considérés  comme  valides,  tandis  que  '(}',  '[(])'  et  '[({})]  (]'  sont  considérés 
comme non valides . 
ValidBraces (\"() {} []\")  true 
ValidBraces (\"(}\")  false 
ValidBraces (\"[(])\")  faux 
ValidBraces (\"([{}])\")  true

## Le Contrat
- **Entrées** : braces
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
strictEqual(validBraces("(){}[]"), true);
```

## Starter Code
```javascript
function validBraces(braces) {
  // Votre code ici
}
```
