# Fibonnaci

## Analyse de la consigne
Rechercher deux nombres de Fibonacci consécutifs, `F(n)` et `F(n+1)`, dont le produit est égal à `prod`. Si on ne trouve pas d'égalité exacte, on renvoie les deux premiers nombres de Fibonacci dont le produit est strictement supérieur à `prod`.
- **Entrée :** `prod` (Number).
- **Sortie :** `Array` [Number, Number, Boolean].

## Le Contrat
La fonction génère la suite de Fibonacci et évalue le produit de deux termes consécutifs. Dès que ce produit est supérieur ou égal à `prod`, elle s'arrête et retourne le résultat (et `true` ou `false` selon s'il y a égalité).

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.deepEqual(productFib(714), [21, 34, true]);
assert.deepEqual(productFib(800), [34, 55, false]);
```

## Starter Code
```javascript
export function productFib(prod) {
  // Votre code ici
  return [];
}
```
