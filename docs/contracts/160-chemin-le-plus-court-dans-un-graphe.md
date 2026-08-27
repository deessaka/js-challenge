# Chemin le plus court dans un graphe

## Analyse de la consigne
Le but est de trouver le chemin le plus court (en termes de temps de parcours total) dans un graphe dirigé et pondéré, représentant une carte routière avec des intersections. Il s'agit d'une application classique de l'algorithme de Dijkstra.

## Le Contrat
- **Entrée** : `numberOfIntersections` (number), `roads` (Array<{from: number, to: number, drivingTime: number}>), `start` (number), `finish` (number).
- **Sortie** : (Array<number> | null) - Un tableau contenant les numéros des intersections formant le chemin le plus rapide de `start` à `finish`. Retourne `null` si la destination est inaccessible.

## Test proposé
```javascript
const assert = require('assert');

const roads = [
  {from: 0, to: 1, drivingTime: 5},
  {from: 0, to: 2, drivingTime: 10},
  {from: 1, to: 2, drivingTime: 10},
  {from: 1, to: 3, drivingTime: 2},
  {from: 2, to: 3, drivingTime: 2},
  {from: 2, to: 4, drivingTime: 5},
  {from: 3, to: 2, drivingTime: 2},
  {from: 3, to: 4, drivingTime: 10}
];

assert.deepStrictEqual(navigate(5, roads, 0, 4), [0, 1, 3, 2, 4]);
```

## Starter Code
```javascript
function navigate(numberOfIntersections, roads, start, finish) {
  // Votre code ici
  return [];
}
```
