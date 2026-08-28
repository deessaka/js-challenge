# Heures à partir de secondes

## Analyse de la consigne
La fonction prend un nombre de secondes (jusqu'à 359999) et le convertit en format texte HH:MM:SS (chaque composante formatée sur deux chiffres).
- **Entrée :** `seconds` (Number).
- **Sortie :** `String`.

## Le Contrat
La fonction calcule le nombre entier d'heures, de minutes et de secondes restantes. Puis elle formate chaque résultat avec un zéro initial si nécessaire pour obtenir HH:MM:SS.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(humanReadable(0), '00:00:00');
assert.equal(humanReadable(5), '00:00:05');
assert.equal(humanReadable(60), '00:01:00');
assert.equal(humanReadable(86399), '23:59:59');
```

## Starter Code
```javascript
export function humanReadable(seconds) {
  // Votre code ici
  return "";
}
```
