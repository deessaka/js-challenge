# Longueur d’une boucle

## Analyse de la consigne
On donne le nœud de départ d'une liste chaînée (linked list) qui aboutit invariablement sur une boucle. L'objectif est de trouver la longueur de cette boucle, c'est-à-dire le nombre de nœuds impliqués dans le cycle.

## Le Contrat
- **Entrée** : `node` (Object) - Le premier nœud de la liste chaînée. Ce nœud possède une méthode `getNext()` (ou propriété `next`) pour passer au nœud suivant.
- **Sortie** : (number) - La longueur de la boucle.

## Test proposé
```javascript
const assert = require('assert');

// Création d'une boucle fictive pour le test
function createChain(tailSize, loopSize) {
  let startNode = { next: null };
  let currentNode = startNode;
  for (let i = 0; i < tailSize; i++) {
    currentNode.next = { next: null };
    currentNode = currentNode.next;
  }
  let loopStartNode = currentNode;
  for (let i = 0; i < loopSize - 1; i++) {
    currentNode.next = { next: null };
    currentNode = currentNode.next;
  }
  currentNode.next = loopStartNode;
  return startNode;
}

const node = createChain(3, 11);
assert.strictEqual(loopSize(node), 11);
```

## Starter Code
```javascript
function loopSize(node) {
  // Votre code ici
  return 0;
}
```
