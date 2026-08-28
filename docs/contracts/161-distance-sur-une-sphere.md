# Distance sur une sphère

## Analyse de la consigne
La consigne demande de calculer la distance géodésique entre deux points à la surface d'une sphère (la Terre, avec R=6371 km). Il faut décoder les coordonnées géographiques données sous forme de chaînes de caractères (degrés, minutes, secondes, direction) puis appliquer une formule mathématique comme celle de Haversine et arrondir le résultat à la dizaine de kilomètres la plus proche.

## Le Contrat
- **Entrée** : `lat1`, `lon1`, `lat2`, `lon2` (strings) - Coordonnées GPS formatées en degrés, minutes, secondes et orientation cardinale.
- **Sortie** : (number) - La distance en kilomètres, arrondie à la dizaine (ex: 6387 -> 6380, 6388 -> 6390 etc, d'après les exemples, l'arrondi a l'air "floor" ou vers le plus proche. "6387 devient 6380, 643 devient 640" et "18299 devient 18290", on dirait Math.floor à la dizaine).

## Test proposé
```javascript
const assert = require('assert');

assert.strictEqual(distance("48° 12' 30\" N", "16° 22' 23\" E", "23° 33' 0\" S", "46° 38' 0\" W"), 10130);
assert.strictEqual(distance("48° 12' 30\" N", "16° 22' 23\" E", "58° 18' 0\" N", "134° 25' 0\" W"), 7870);
```

## Starter Code
```javascript
function distance(lat1, lon1, lat2, lon2) {
  // Votre code ici
  return 0;
}
```
