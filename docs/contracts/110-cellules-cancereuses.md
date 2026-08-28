# Cellules cancéreuses

## Analyse de la consigne
La fonction nettoie une chaîne représentant un corps en supprimant les cellules cancéreuses. 'C' (avancé) supprime aussi les cellules adjacentes (sauf les importantes 'A'-'Z'). 'c' (initiale) se supprime lui-même. Les cellules normales ('a'-'z') adjacentes à un 'C' sont supprimées.
- **Entrée :** `body` (String).
- **Sortie :** `String`.

## Le Contrat
La fonction doit parcourir la chaîne et supprimer tous les 'c' et les 'C' ainsi que les lettres minuscules adjacentes à 'C'. Les lettres majuscules (sauf 'C') doivent toujours être conservées.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(cutCancerCells('acb'), 'ab');
assert.equal(cutCancerCells('aCb'), '');
assert.equal(cutCancerCells('acCcb'), 'ab');
assert.equal(cutCancerCells('aCZ'), 'Z');
```

## Starter Code
```javascript
export function cutCancerCells(body) {
  // Votre code ici
  return "";
}
```
