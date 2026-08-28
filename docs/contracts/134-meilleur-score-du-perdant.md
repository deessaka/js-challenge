# Meilleur score du perdant

## Analyse de la consigne
> "AL-AHLY" et "Zamalek" sont les meilleures équipes en Egypte, mais "AL-AHLY" gagne toujours les matchs. 
Les responsables de "Zamalek" veulent savoir quel est le meilleur match qu\'ils ont joué jusqu\'ici. 
Le  meilleur  match  est le  match  qu\'ils  ont  perdu  avec  la  différence  minimale  de  buts.  S\'il  y  a  plus  d\'une 
correspondance avec la même différence, choisissez celle où "Zamalek" a marqué plus de buts. 
Compte  tenu  de  l\'information  sur  tous  les  matchs  qu\'ils  ont  joués,  retournez  l\'index  de  la  meilleure 
correspondance. S’il y a plus d\'un résultat valide, renvoyez le plus petit indice. 
Pour ALAHLYGoals = [6,4] et zamalekGoals = [1,2], la sortie devrait être de 1. 
Parce que 4 - 2 est inférieur à 6 - 1 
Pour ALAHLYGoals = [1,2,3,4,5] et zamalekGoals = [0,1,2,3,4], la sortie devrait être 4.

## Le Contrat
- **Entrées** : alAhlyGoals, zamalekGoals
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
strictEqual(bestMatch([6,4], [1,2]), 1);
```

## Starter Code
```javascript
function bestMatch(alAhlyGoals, zamalekGoals) {
  // Votre code ici
}
```
