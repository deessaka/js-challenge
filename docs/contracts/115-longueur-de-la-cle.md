# Longueur de la clé

## Analyse de la consigne
On cherche à trouver la plus courte sous-chaîne (la clé) qui, lorsqu'elle est répétée, peut former le début de la chaîne donnée en entrée.
- **Entrée :** `str` (String).
- **Sortie :** `String` (la clé).

## Le Contrat
La fonction doit identifier le plus petit préfixe de la chaîne qui, répété plusieurs fois et potentiellement tronqué à la fin, correspond exactement à la chaîne d'entrée.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(findTheKey("123412341234123412"), "1234");
assert.equal(findTheKey("1231"), "123");
assert.equal(findTheKey("111111"), "1");
```

## Starter Code
```javascript
export function findTheKey(str) {
  // Votre code ici
  return "";
}
```
