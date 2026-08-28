# Exercice 98: Couleurs HTML vers RGB

## Analyse de la consigne
Convertir une chaîne hexadécimale à 6 ou 3 chiffres, ou un nom de couleur prédéfini, en valeurs RGB.

## Le Contrat
- **Entrée(s) :** `color` (chaîne de caractères)
- **Sortie :** (objet) { r, g, b }

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { parseHTMLColor } from './098-couleurs-html-vers-rgb.js';

assert.deepEqual(parseHTMLColor('#80FFA0'), { r: 128, g: 255, b: 160 });
assert.deepEqual(parseHTMLColor('#3B7'), { r: 51, g: 187, b: 119 });
assert.deepEqual(parseHTMLColor('LimeGreen'), { r: 50, g: 205, b: 50 });
```

## Starter Code
```javascript
export function parseHTMLColor(color) {
  // TODO: Implémenter la logique
  return { r: 0, g: 0, b: 0 };
}
```
