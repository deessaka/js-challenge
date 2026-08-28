# 075 - Décodage Morse

## Analyse de la consigne
Il faut décoder une chaîne en code Morse (points `.` et tirets `-`). Un espace sépare les lettres, trois espaces séparent les mots. Certains codes spéciaux (comme `SOS`) sont traités comme des caractères uniques. Le code est insensible à la casse ; le résultat est traditionnellement renvoyé en majuscules.

> Note : l'énoncé source contient une coquille (« la lettre Q est codée comme `-.-` ») — `-.-` est en réalité le code de **K** en Morse international. Le dictionnaire `MORSE_CODE` fourni par l'énoncé confirme que Q vaut `--.-` ; c'est cette table qui fait foi, pas la phrase d'exemple.

## Le Contrat
- **Entrée** : `morseCode` (string) - le message en code Morse.
- **Sortie** : (string) - le message décodé, en majuscules.

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { decodeMorse } from './index.js';

assert.strictEqual(decodeMorse('.-'), 'A');
assert.strictEqual(decodeMorse('-.-'), 'K');
assert.strictEqual(decodeMorse('--.-'), 'Q');
assert.strictEqual(decodeMorse('... --- ...'), 'SOS');
```

## Starter Code
```javascript
export function decodeMorse(morseCode) {
  // Votre solution ici
}
```
