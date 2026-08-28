# Conversion du temps

## Analyse de la consigne
L'objectif est de convertir une durée exprimée en secondes en un format textuel lisible par les humains. Les unités à prendre en compte sont les années, jours, heures, minutes et secondes, en gérant le pluriel et la virgule/le "and" pour séparer les éléments.

## Le Contrat
- **Entrée** : `seconds` (number) - Un entier positif ou nul représentant une durée en secondes.
- **Sortie** : (string) - La durée formatée selon les règles (ex: "1 hour, 1 minute and 2 seconds"). Si `seconds` vaut 0, retourne "now".

## Test proposé
```javascript
const assert = require('assert');

assert.strictEqual(formatDuration(62), "1 minute and 2 seconds");
assert.strictEqual(formatDuration(3662), "1 hour, 1 minute and 2 seconds");
assert.strictEqual(formatDuration(0), "now");
```

## Starter Code
```javascript
function formatDuration(seconds) {
  // Votre code ici
  return "";
}
```
