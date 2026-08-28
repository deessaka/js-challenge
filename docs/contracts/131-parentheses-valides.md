# Parenthèses valides

## Analyse de la consigne
> Écrivez  une  fonction  appelée validParentheses qui  prend  une  chaîne  de  parenthèses  et  détermine  si 
l\'ordre des parenthèses est valide. ValidParentheses doit renvoyer true si la chaîne est valide et false 
si elle n\'est pas valide. Exemples : 
validParentheses( "()" )  true 
validParentheses( ")(()))" )  false 
validParentheses( "(" )  false 
validParentheses( "(())((()())())" )  true 
Toutes  les  chaînes  seront  non  vides  et  ne  comporteront  que  des  parenthèses  ouvertes  \'(\'  et/ou  des 
parenthèses fermées \')\'.

## Le Contrat
- **Entrées** : parens
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
strictEqual(validParentheses("()"), true);
```

## Starter Code
```javascript
function validParentheses(parens) {
  // Votre code ici
}
```
