# banana

## Analyse de la consigne
> A partir d’une chaîne de lettres  a,  b  et  n,  énumérez  les  différentes façons  de  faire le  mot  «banana»  en 
traversant les lettres de gauche à droite. (Utilisez « –«  pour indiquer une lettre non utilisée) 
Entrée : bbananana 
Sortie : 
b-anana-- 
b-anan--a 
b-ana--na 
b-an--ana 
b-a--nana 
b---anana 
-banana-- 
-banan--a 
-bana--na 
-ban--ana 
-ba--nana 
-b--anana

## Le Contrat
- **Entrées** : s
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { deepStrictEqual } = require('assert');
deepStrictEqual(bananas("bbananana"), ["b-anana--", "b-anan--a", "b-ana--na", "b-an--ana", "b-a--nana", "b---anana", "-banana--", "-banan--a", "-bana--na", "-ban--ana", "-ba--nana", "-b--anana"]);
```

## Starter Code
```javascript
function bananas(s) {
  // Votre code ici
}
```
