# Nombres binaires négatifs

## Analyse de la consigne
> Dans  les  systèmes  de  base  négative,  les  nombres  positifs  et  négatifs  sont  représentés  sans  l'utilisation 
d'un signe moins (ou, dans la représentation par ordinateur, un bit de signe).  
Pour comprendre le principe, les huit premiers chiffres (en décimale) du système Base (-2) sont: 
[1, -2, 4, -8, 16, -32, 64, -128] 
Exemple de conversion : 
Décimal, négabinaire 
6, '11010' // -2 – 8 + 16 = 6 
-6, '1110' // -2 + 4 -8 = -6 
4, '100' 
18, '10110' // -2 +4 + 16 = 18 
-11, '110101' // 1 + 4 + 16 -32 = -11

## Le Contrat
- **Entrées** : num
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
strictEqual(toNegativeBase(6), '11010');
```

## Starter Code
```javascript
function toNegativeBase(num) {
  // Votre code ici
}
```
