# Somme maxi dans un tableau

## Analyse de la consigne
Trouver la somme maximale qu'il est possible d'obtenir en additionnant une sous-séquence d'éléments contigus au sein d'un tableau d'entiers.
- **Entrée :** `arr` (Array de Nombres).
- **Sortie :** `Number`.

## Le Contrat
La fonction cherche la sous-séquence ayant la plus grande somme (ex. avec l'algorithme de Kadane). Si le tableau est vide ou ne contient que des nombres négatifs, la fonction doit renvoyer 0.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(maxSequence([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
assert.equal(maxSequence([-2, -1, -3]), 0);
assert.equal(maxSequence([]), 0);
```

## Starter Code
```javascript
export function maxSequence(arr) {
  // Votre code ici
  return 0;
}
```
