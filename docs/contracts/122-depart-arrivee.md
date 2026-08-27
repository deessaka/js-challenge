# Départ – Arrivée

## Analyse de la consigne
Simuler un panneau d'affichage mécanique à clapets (flaps). Le rotor de chaque lettre possède un ordre de caractères fixe. Chaque nombre dans l'instruction de rotation indique combien de fois faire tourner le rotor à une certaine position. Cette rotation affecte le rotor ciblé ET tous les rotors à sa droite (effet domino mécanique cumulatif).
- **Entrées :** `lines` (Array de Strings) et `rotors` (Array d'Array de Nombres).
- **Sortie :** `Array` de Strings.

## Le Contrat
Pour chaque ligne, la fonction maintient le décalage cumulé (qui s'additionne de la gauche vers la droite pour chaque position). Ce décalage total indique de combien de positions avancer dans l'alphabet (qui compte 54 caractères). Le résultat est la nouvelle chaîne.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.deepEqual(flapDisplay(["CODE"], [[20,20,28,0]]), ["WARS"]);
assert.deepEqual(flapDisplay(["HELLO "], [[15,49,50,48,43,13]]), ["WORLD!"]);
```

## Starter Code
```javascript
export function flapDisplay(lines, rotors) {
  // Votre code ici
  return [];
}
```
