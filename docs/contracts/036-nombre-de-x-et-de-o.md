# Nombre de X et de O

## Analyse de la consigne
Vérifiez si une chaîne a le même nombre de \'x\' et \'o\'. Vous devez renvoyer un booléen et le résultat doit  être insensible à la casse.  XO(\'xo\')  true  XO("xxOo")  true  XO("xxxm")  false  XO("Oo")  false  XO("ooom")  false  XO("abcdefghijklmnopqrstuvwxyz")  true

## Le Contrat
- **Entrées** : xo
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { XO } from './solution';

describe('Nombre de X et de O', () => {
  it('Test case 1', () => {
    expect(XO(\'xo\')).toEqual(true);
  });
});

```

## Starter Code
```javascript
export function XO(xo) {
  // TODO
}

```
