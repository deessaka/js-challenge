# Parcours d'un labyrinthe

## Analyse de la consigne
L'objectif est de simuler le déplacement dans un labyrinthe 2D (tableau de tableaux d'entiers) en suivant une liste de directions cardinales ("N", "S", "E", "W").
- **Entrées :** `maze` (Array d'Array de nombres), `directions` (Array de chaînes de caractères).
- **Sortie :** Chaîne de caractères (`"Finish"`, `"Dead"`, ou `"Lost"`).

## Le Contrat
La fonction doit parcourir la grille pas à pas. Si la position sort de la grille ou atteint un mur (1), elle renvoie "Dead". Si la position atteint le point d'arrivée (3), elle renvoie "Finish". Si après avoir suivi toutes les directions la position n'est ni un mur ni l'arrivée, elle renvoie "Lost".

## Test proposé
```javascript
import { strict as assert } from 'assert';

const maze = [
  [1,1,1,1,1,1,1],
  [1,0,0,0,0,0,3],
  [1,0,1,0,1,0,1],
  [0,0,1,0,0,0,1],
  [1,0,1,0,1,0,1],
  [1,0,0,0,0,0,1],
  [1,2,1,0,1,0,1]
];

assert.equal(mazeRunner(maze, ["N","N","N","N","N","E","E","E","E","E"]), "Finish");
assert.equal(mazeRunner(maze, ["N","N","N","W","W"]), "Dead");
assert.equal(mazeRunner(maze, ["N","E","E","E","E"]), "Lost");
```

## Starter Code
```javascript
export function mazeRunner(maze, directions) {
  // Votre code ici
}
```
