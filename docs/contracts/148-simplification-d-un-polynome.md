# Simplification d'un polynôme

## Analyse de la consigne
La consigne demande de simplifier une expression polynomiale passée sous forme de chaîne de caractères. Il faut regrouper les monômes équivalents, ordonner les variables de chaque monôme lexicographiquement, trier les monômes par longueur puis ordre lexicographique, et formater correctement les coefficients.

## Le Contrat
- **Entrée** : `poly` (string) - Une chaîne de caractères représentant le polynôme à simplifier.
- **Sortie** : (string) - Le polynôme simplifié et formaté selon les règles.

## Test proposé
```javascript
const assert = require('assert');

assert.strictEqual(simplify("dc+dcba"), "cd+abcd");
assert.strictEqual(simplify("2xy-yx"), "xy");
assert.strictEqual(simplify("-a+5ab+3a-c-2a"), "-c+5ab");
```

## Starter Code
```javascript
function simplify(poly) {
  // Votre code ici
  return "";
}
```
