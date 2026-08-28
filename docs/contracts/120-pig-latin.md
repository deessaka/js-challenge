# Pig Latin

## Analyse de la consigne
La fonction transforme chaque mot d'une phrase selon les règles du Pig Latin : la première lettre du mot est déplacée à la fin de celui-ci, suivie de "ay".
- **Entrée :** `str` (String).
- **Sortie :** `String`.

## Le Contrat
La fonction sépare la phrase en mots, applique la transformation de déplacement et d'ajout du suffixe "ay" uniquement sur les mots (les ponctuations isolées ne sont généralement pas transformées ou selon des règles simples que l'on omettra si non précisé, mais ici la phrase est simple), et recombine le tout.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(pigIt("Pig latin is cool"), "igPay atinlay siay oolcay");
```

## Starter Code
```javascript
export function pigIt(str) {
  // Votre code ici
  return "";
}
```
