# Trous entre des nombres premiers

## Analyse de la consigne
> Les nombres premiers ne sont pas régulièrement espacés. Par exemple de 2 à 3, l'écart est égal à 1. De 3 
à 5, l'écart est égal à 2. De 7 à 11, il est 4. Entre 2 et 50, nous avons les paires suivantes de premiers : 
3-5, 5-7, 11-13, 17-19, 29-31, 41-43 
G (entier> = 2) qui indique l'écart que nous recherchons 
M (entier> 2) qui donne le début de la recherche (m inclus) 
N (entier> = m) qui donne la fin de la recherche (n inclus) 
Dans l'exemple ci-dessus, l'intervalle (2, 3, 50) renverra [3, 5] qui est la première paire entre 3 et 50 avec 
un écart 2. 
Donc, cette fonction devra renvoyer la première paire de deux nombres premiers espacés d'un écart de G 
entre les M et N. Si ces nombres n’existent pas, renvoyez null. 
Intervalle (4, 130, 200)  [163, 167]

## Le Contrat
- **Entrées** : g, m, n
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { deepStrictEqual } = require('assert');
deepStrictEqual(step(4, 130, 200), [163, 167]);
```

## Starter Code
```javascript
function step(g, m, n) {
  // Votre code ici
}
```
