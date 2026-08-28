# Chaîne cool

## Analyse de la consigne
Disons qu’une chaîne est cool si elle est formée uniquement par des lettres latines et que l’on n’a jamais  deux minuscules ou deux majuscules à des positions adjacentes. Par exemple :  coolString("aAaAaAa")  true  coolString("tTzXmLkG")  true  coolString("976")  false  coolString("aBC")  false  Écrire une fonction qui à partir d’une chaîne, vérifie si elle est cool ou non.

## Le Contrat
- **Entrées** : str1
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { coolString } from './solution';

describe('Chaîne cool', () => {
  it('Test case 1', () => {
    expect(coolString("aAaAaAa")).toEqual(true);
  });
});

```

## Starter Code
```javascript
export function coolString(str1) {
  // TODO
}

```
