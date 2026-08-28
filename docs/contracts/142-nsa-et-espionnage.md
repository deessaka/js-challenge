# NSA et espionnage

## Analyse de la consigne
> L’agence NSA veut espionner les conversations téléphoniques (appels ou SMS) et fait appel à vos services 
de programmeur. Pour ce faire, nous aurons besoin de définir des personnes (Person) ayant au moins les 
propriétés ou méthodes suivantes : name (pour le nom), call (appel) et text (SMS). La méthode call a 2 
paramètres, un objet téléphone contenant le propriétaire (owner) et le numéro (number) et la personne 
appelée. 
Par exemple 
var dan = new Person(\"Dan\"); 
var alex = new Person(\"Alex\"); 
var phone = {owner : dan, number: \"202-555-0199\"}; 
dan.call(phone, alex); 
Ici  2  personnes,  Dan  et  Alex,  un  téléphone  appartenant  à  Dan  et  Dan  appelle  Alex  avec  son  propre 
téléphone. 
La méthode text est très similaire à la méthode call, mais au lieu d’avoir un unique destinataire, il peut y 
en avoir un nombre quelconque (tous étant des personnes). 
Exemple 
var mark = new Person (\"Mark\"); 
dan.text (phone, alex, mark); 
Dan envoie un SMS à Alex et Mark avec son propre téléphone. 
La NSA vous oblige à enregistrer chaque appel téléphonique et chaque SMS que chaque personne a émis. 
L'objet  NSA  aura  une  méthode log.  Cette  méthode  prend  un  paramètre  :  une  instance  de Person.  Il 
renverra le journal conservé sur cette personne dans le format suivant : 
[CALLER] called/texted [CALLEE] from [PHONE OWNER]'s phone([PHONE NUMBER]) 
Chaque enregistrement sera séparé par \
.  
Dan called Erin from Dan's phone(202-555-0149) 
Dan texted Anthony from Anthony's phone(202-555-0199) 
Dan texted Alex from Dan's phone(202-555-0149) 
S'il n'y a pas d'entrées pour la personne, la méthode renverra simplement « No Entries ». 
La NSA ayant peur d’être accusée d'avoir espionné des civils, assurez-vous d'effacer chaque enregistrement 
individuel après l’avoir lu dans le journal.  
Exemple complet 
  62 
var dan = new Person(\"Dan\"); 
var mark = new Person(\"Mark\"); 
var phone = {owner: dan, number: '202-555-0199'}; 
dan.call(phone, mark);  
NSA.log(dan)  'Dan called Mark from Dan\\'s phone(202-555-0199)' 
var anthony = new Person(\"Anthony\"); 
anthony.call(phone,dan) 
NSA.log(anthony)  'Anthony called Dan from Dan\\'s phone(202-555-0199)' 
var mobile = {owner: mark, number: '202-555-0166'}; 
mark.text(mobile,dan,anthony) 
mark.call(phone,anthony) 
NSA.log(mark)   
'Mark texted Dan from Mark\\'s phone(202-555-0166) 
 Mark texted Anthony from Mark\\'s phone(202-555-0166) 
 Mark called Anthony from Dan\\'s phone(202-555-0166) 
' 
var erin = new Person(\"Erin\"); 
NSA.log(erin)  'No Entries' 
Structure de votre programme 
// Objet NSA  
var NSA = {}; 
// Constructeur de personnes 
var Person = function() {  
  this.name; 
  this.call = function(cellphone, callee) { 
  } 
  this.text = function(cellphone) {  
  } 
}

## Le Contrat
- **Entrées** : name
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
var dan = new Person("Dan");
var phone = {owner: dan, number: '202-555-0199'};
var mark = new Person("Mark");
dan.call(phone, mark);
strictEqual(NSA.log(dan), "Dan called Mark from Dan's phone(202-555-0199)");
```

## Starter Code
```javascript
function Person(name) {
  // Votre code ici
}
```
