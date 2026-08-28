# 079 - Cryptage et décryptage d'une chaîne

## Analyse de la consigne
**Cryptage** : à partir d'une chaîne, prendre un caractère sur deux, les concaténer, puis concaténer tous les autres caractères restants ; répéter l'opération `n` fois. **Décryptage** : à partir d'une chaîne cryptée `n` fois, retrouver le texte d'origine.

## Le Contrat
- **Entrées** : `text` (string), `n` (number) - le nombre de répétitions.
- **Sortie** : (string) - le texte crypté (pour `encrypt`) ou décrypté (pour `decrypt`).

## Test proposé
```javascript
import { strict as assert } from 'node:assert';
import { encrypt, decrypt } from './index.js';

assert.strictEqual(encrypt("This is a test!", 0), "This is a test!");
assert.strictEqual(encrypt("This is a test!", 1), "hsi  etTi sats!");
assert.strictEqual(encrypt("This is a test!", 2), "s eT ashi tist!");
assert.strictEqual(decrypt(" Tah itse sits!", 3), "This is a test!");
assert.strictEqual(decrypt("hskt svr neetn!Ti aai eyitrsig", 1), "This kata is very interesting!");
```

## Starter Code
```javascript
export function encrypt(text, n) {
  // Votre solution ici
}

export function decrypt(text, n) {
  // Votre solution ici
}
```
