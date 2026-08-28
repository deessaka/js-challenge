# Exercice 102: Codes secrets par mobile

## Analyse de la consigne
Trouver les bons mots de passe pour chaque mot tapé sur un clavier de téléphone mobile classique.

## Le Contrat
- **Entrée(s) :** `word` (chaîne de caractères)
- **Sortie :** (nombre ou chaîne de caractères) Le code numérique.

## Test proposé
```javascript
import { strict as assert } from 'assert';
import { unlock } from './102-codes-secrets-par-mobile.js';

assert.equal(unlock("Nokia"), 66542);
assert.equal(unlock("Voiture"), 8648873);
assert.equal(unlock("Porte"), 76783);
```

## Starter Code
```javascript
export function unlock(word) {
  // TODO: Implémenter la logique
  return 0;
}
```
