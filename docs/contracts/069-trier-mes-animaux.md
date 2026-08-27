# 069 - Trier mes animaux

## Analyse de la consigne
Étant donné une liste d'objets `{ name, numberOfLegs }`, la fonction doit renvoyer une nouvelle liste triée par nombre de pattes croissant puis, à égalité, par ordre alphabétique du nom. Si `null` est passé, elle doit renvoyer `null`. Si la liste est vide, elle doit renvoyer une liste vide.

## Le Contrat
- **Entrée** : `animals` (Array<{name: string, numberOfLegs: number}> | null).
- **Sortie** : (Array | null) - la liste triée, `null`, ou `[]` selon le cas.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { sortAnimal } from './index.js';

assert.deepStrictEqual(
  sortAnimal([
    { name: 'Cat', numberOfLegs: 4 },
    { name: 'Snake', numberOfLegs: 0 },
    { name: 'Dog', numberOfLegs: 4 },
    { name: 'Pig', numberOfLegs: 4 },
    { name: 'Human', numberOfLegs: 2 },
    { name: 'Bird', numberOfLegs: 2 },
  ]),
  [
    { name: 'Snake', numberOfLegs: 0 },
    { name: 'Bird', numberOfLegs: 2 },
    { name: 'Human', numberOfLegs: 2 },
    { name: 'Cat', numberOfLegs: 4 },
    { name: 'Dog', numberOfLegs: 4 },
    { name: 'Pig', numberOfLegs: 4 },
  ]
);
assert.strictEqual(sortAnimal(null), null);
assert.deepStrictEqual(sortAnimal([]), []);
```

## Starter Code
```javascript
export function sortAnimal(animals) {
  // Votre solution ici
}
```
