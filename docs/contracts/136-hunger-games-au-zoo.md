# Hunger Games au zoo

## Analyse de la consigne
> Une panne de courant au zoo a provoqué l’ouverture de toutes les portes des cages ! Les animaux sont 
sortis  et  ils  commencent  à  se  manger entre eux ! Voici une liste d'animaux du zoo et ce qu’ils peuvent 
manger : 
• L'antilope mange de l'herbe 
• Les  gros  poissons  mangent  des  petits 
poissons 
• Les punaises mangent des feuilles 
• L'ours mange des gros poissons 
• L'ours mange des punaises 
• L'ours mange des poules 
• L'ours mange des vaches 
• L'ours mange des feuilles 
• L'ours mange des moutons 
• Les poules mangent des punaises 
• La vache mange de l'herbe 
• Le renard mange des poules 
• Le renard mange des moutons 
• La girafe mange des feuilles 
• Le lion mange de l'antilope 
• Le lion mange de la vache 
• Le panda mange des feuilles 
• Le mouton mange de l'herbe 
Traduction des différents éléments en anglais : 
['antelope','grass','big-fish','little-fish','bug', 'leaves','bear','chicken','cow', 
'sheep','fox','giraffe','lion','panda'] 
Le but est d’afficher qui mange qui jusqu'à ce que la situation soit stable. 
En entrée vous avez tous les éléments qui sont dans le zoo séparés par des virgules. 
En sortie vous devez obtenir une liste avec : 
• Le premier élément le zoo initial 
• Le dernier élément est une chaîne séparée par des virgules de ce que ressemble le zoo à la fin 
• Tous les autres éléments (du 2
e
 à l’avant dernier) sont de la forme X mange Y décrivant ce qui 
s'est passé 
Remarques : 
• Les animaux ne peuvent manger que des éléments (animaux ou végétaux) à côté d'eux 
• Les animaux mangent toujours à leur GAUCHE avant de manger à leur DROITE 
• L’animal le plus à gauche mange toujours avant les autres 
Les autres choses que vous pouvez trouver dans le zoo (qui ne sont pas listés ci-dessus) ne mangent rien 
et ne sont pas comestibles. Exemples :  
whoEatsWho(\"fox,bug,chicken,grass,sheep\") 
 [\"fox,bug,chicken,grass,sheep\", \"chicken eats bug\", \"fox eats chicken\", \"sheep eats 
grass\", \"fox eats sheep\", \"fox\" ]; 
  58 
whoEatsWho(\"fox,panda,grass,bear,cow,chicken,antelope,little-fish,fox,sheep\") 
 [\"bear eats cow\", \"bear eats chicken\", \"fox eats sheep\", \"fox,panda,grass, bear, 
antelope,little-fish,fox\" ] 
whoEatsWho(\"fox,chicken,tree,chicken,bug,banana,bug,bear\") 
 [\"fox,chicken,tree,chicken,bug,banana,bug,bear\", \"fox eats chicken\", \"chicken eats 
bug\", \"bear eats bug\", \"fox,tree,chicken,banana,bear\"]

## Le Contrat
- **Entrées** : zoo
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { deepStrictEqual } = require('assert');
deepStrictEqual(whoEatsWho("fox,bug,chicken,grass,sheep"), ["fox,bug,chicken,grass,sheep", "chicken eats bug", "fox eats chicken", "sheep eats grass", "fox eats sheep", "fox"]);
```

## Starter Code
```javascript
function whoEatsWho(zoo) {
  // Votre code ici
}
```
