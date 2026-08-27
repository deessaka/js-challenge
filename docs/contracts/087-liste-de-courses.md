# Exercice 87: Liste de courses

## Analyse de la consigne
Calculez le coût d'une liste d'achats à l’aide d’une fonction. Retournez le coût avec 2 décimales.

## Le Contrat
- **Entrée(s) :** `list` (tableau de tableaux contenant un nom d'article et une quantité)
- **Sortie :** (nombre) Le coût total calculé.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { shoppingListCost } from './087-liste-de-courses.js';

assert.equal(shoppingListCost([["Chocolate", 3], ["Apples", 8], ["Orange Juice", 15], ["Pears", 1]]), 73.25);
assert.equal(shoppingListCost([["Sweetcorn", 12], ["Pears", 6], ["Apples", 5]]), 55.20);
```

## Starter Code
```javascript
export function shoppingListCost(list) {
  // TODO: Implémenter la logique
  return 0.00;
}
```
