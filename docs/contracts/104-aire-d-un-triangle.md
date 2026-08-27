# Exercice 104: Aire d’un triangle

## Analyse de la consigne
Écrivez une fonction qui calcule l’aire d’un triangle à partir de 3 points.

## Le Contrat
- **Entrée(s) :** `triangle` (objet avec propriétés a, b, c qui sont des Point avec x, y)
- **Sortie :** (nombre) L'aire.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { triangleArea, Triangle, Point } from './104-aire-d-un-triangle.js';

assert.equal(triangleArea(new Triangle(new Point(10, 10), new Point(40, 10), new Point(10, 50))), 600);
assert.equal(triangleArea(new Triangle(new Point(15, -10), new Point(40, 20), new Point(20, 50))), 675);
```

## Starter Code
```javascript
export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Triangle {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

export function triangleArea(triangle) {
  // TODO: Implémenter la logique
  return 0;
}
```
