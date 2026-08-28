# Exercices sur les nœuds

## Analyse de la consigne
Il s'agit d'implémenter plusieurs fonctions classiques sur une structure de liste chaînée (nœuds). Les nœuds ont une propriété `data` et `next`.
- **Entrées :** `head` (Nœud ou null), éventuellement une valeur ou fonction (`val`, `fn`), une valeur initiale (`init`), ou deux nœuds (`l1`, `l2`).
- **Sorties :** Diverses selon la fonction (Nombre, Nœud, etc.).

## Le Contrat
- `length` : retourne le nombre de nœuds.
- `indexOf` : retourne l'index 0-basé de la première occurrence de la valeur, ou -1.
- `lastIndexOf` : retourne le dernier index, ou -1.
- `countIf` : compte les nœuds validant un prédicat.
- `filter` : retourne une nouvelle liste filtrée.
- `map` : retourne une nouvelle liste transformée.
- `reduce` : réduit la liste à une valeur.
- `mergeTwoLists` : fusionne deux listes triées en une seule liste triée.

## Test proposé
```javascript
import { strict as assert } from 'assert';

function Node(data, next = null) {
  this.data = data;
  this.next = next;
}
var head = new Node(1, new Node(2, new Node(3)));

assert.equal(length(head), 3);
assert.equal(indexOf(head, 2), 1);
assert.equal(countIf(head, x => x >= 2), 2);
assert.equal(reduce(head, (a, b) => a + b, 0), 6);
```

## Starter Code
```javascript
export function length(head) {
  // Votre code ici
}
export function indexOf(head, val) {
  // Votre code ici
}
export function lastIndexOf(head, val) {
  // Votre code ici
}
export function countIf(head, fn) {
  // Votre code ici
}
export function filter(head, fn) {
  // Votre code ici
}
export function map(head, fn) {
  // Votre code ici
}
export function reduce(head, fn, init) {
  // Votre code ici
}
export function mergeTwoLists(l1, l2) {
  // Votre code ici
}
```
