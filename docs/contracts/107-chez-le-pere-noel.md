# Chez le père Noël

## Analyse de la consigne
On doit trouver le nombre de sous-chaînes de 3 caractères consécutifs (triplets) dans un mot donné qui peuvent rester identiques après un mélange de leurs lettres (où au moins une lettre est déplacée). Un tel mélange ne laisse le triplet inchangé que s'il contient des lettres identiques permettant un brassage produisant le même mot (ex: au moins deux lettres identiques).
- **Entrée :** `gift` (String).
- **Sortie :** `Number` représentant le nombre de triplets répondant au critère.

## Le Contrat
La fonction parcourt la chaîne pour extraire tous les triplets consécutifs. Pour chaque triplet, si les caractères permettent un brassage (au moins deux caractères identiques) donnant le même triplet, on incrémente un compteur.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(countTriplets("doll"), 1);
assert.equal(countTriplets("aaaaaaa"), 5);
assert.equal(countTriplets("cat"), 0);
```

## Starter Code
```javascript
export function countTriplets(gift) {
  // Votre code ici
}
```
