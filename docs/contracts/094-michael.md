# Exercice 94: Michaël

## Analyse de la consigne
Obtenez tous les noms de famille des Michaël dans un texte.

## Le Contrat
- **Entrée(s) :** `inputText` (chaîne de caractères)
- **Sortie :** (tableau de chaînes de caractères) Les noms de famille.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { getMichaelLastName } from './094-michael.js';

const inputText = "Michael, how are you? - Cool, how is John Williamns and Michael Jordan? I don't know but Michael Johnson is fine. Michael do you still score points with LeBron James, Michael Green AKA Star and Michael Wood?";
assert.deepEqual(getMichaelLastName(inputText), ["Jordan", "Johnson", "Green", "Wood"]);
```

## Starter Code
```javascript
export function getMichaelLastName(inputText) {
  // TODO: Implémenter la logique
  return [];
}
```
