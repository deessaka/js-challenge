# Vecteurs

## Analyse de la consigne
> Déclarez et définissez une classe Vector qui représente un vecteur dans un espace tridimensionnel. Cette 
classe devrait avoir trois propriétés i, j et k. 
La classe Vector doit avoir un constructeur de classe qui accepte exactement trois arguments, tous requis, 
dans  l'ordre  suivant:  i,  j,  k,  et  attribuer  les  valeurs  des  arguments  aux  propriétés  publiques  i,  j  et  k 
respectivement.  Les  trois  arguments  sont  des  nombres  valides  (entiers  et    ou  décimaux)  mais  aucune 
vérification n'est requise de votre part. 
Définissez  une  méthode  publique getMagnitude qui  n'accepte  aucun  argument  et  renvoie la  norme  du  
vecteur. 
Les vecteurs unitaires dans les directions x, y et z sont communément désignés par i, j et k respectivement. 
Définissez trois méthodes publiques, statiques (c'est-à-dire directement appelées à partir de la classe elle-
  60 
même), getI, getJ et getK,  chacune sans    argument  et  renvoyant  des  vecteurs représentant  i,  j  et  k 
respectivement. 
Définissez également (voir exemples après) :  
• add(that) : addition de 2 vecteurs 
• multiplyByScalar(n) : multiplication par un scalaire 
• dot(that) : produit scalaire 
• cross(that) : produit vectoriel 
• isParallelTo(that) : est parallèle à... 
• isPerpendicularTo(that) : est perpendiculaire à... 
• normalize() : normalise le vecteur  
• isNormalized() : true ou false suivant que le vecteur est normalisé ou non. 
Exemples 
var v = new Vector(6, 10, -3); 
v.getMagnitude()  12.041594578792296 
var i = Vector.getI(); 
var j = Vector.getJ(); 
var k = Vector.getK(); 
console.log(i.i,i.j,i.k) 
 1 0 0 
console.log(j.i,j.j,j.k) 
 0 1 0 
console.log(k.i,k.j,k.k) 
 0 0 1 
var v = new Vector(3, 7 / 2, -3 / 2); 
var s = v.add(new Vector(-27, 3, 4)); 
console.log(s.i,s.j,s.k) 
 -24 6.5 2.5  
var v = new Vector(1 / 3, 177 / 27, -99); 
var e = v.multiplyByScalar(-3 / 7); 
console.log(e.i,e.j,e.k) 
 -0.14285714285714285 -2.8095238095238093 42.42857142857142 
var v = new Vector(-99 / 71, 22 / 23, 45) 
v.dot(new Vector(-5, 4, 7)  325.7979179 
var a = new Vector(2, 1, 3); 
var b = new Vector(4, 6, 5); 
var aCrossB = a.cross(b); 
console.log(aCrossB.i,aCrossB.j,aCrossB.k) 
 -13 2 8 
var a = new Vector(1045 / 23, -666 / 37, 15); 
var b = new Vector(161.3385037, -59124 / 925, 9854 / 185); 
a.isParallelTo(b)  true 
b.isParallelTo(a)  true 
var c = new Vector(-3, 0, 5); 
var d = new Vector(-12, 1, 20); 
c.isParallelTo(d)  false 
var a = new Vector(3, 4, 7); 
var b = new Vector(1 / 3, 2, -9 / 7); 
a.isPerpendicularTo(b)  true 
var c = new Vector(1, 3, 5); 
var d = new Vector(-2, -7, 4.4); 
c.isPerpendicularTo(d)  false 
var v = new Vector(-1, -1, 1); 
  61 
var u = v.normalize(); 
console.log(u.i,u.j,u.k) 
 -0.5773502691896258 -0.5773502691896258 0.5773502691896258 
var a = new Vector(-1 / Math.sqrt(2), 0, 1 / Math.sqrt(2)); 
var b = new Vector(1, 1, 1); 
a.isNormalized()  true 
b.isNormalized()  false

## Le Contrat
- **Entrées** : i, j, k
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
var v = new Vector(6, 10, -3);
strictEqual(Math.round(v.getMagnitude()), 12);
```

## Starter Code
```javascript
function Vector(i, j, k) {
  // Votre code ici
}
```
