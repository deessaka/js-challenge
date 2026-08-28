# « g », la lettre heureuse

## Analyse de la consigne
Nous dirons que "g" est une lettre heureuse dans une chaîne donnée, s\'il y a un autre "g" immédiatement  à droite ou à gauche de celle-ci.  Pour str = "gg0gg3gg0gg", la sortie doit être true  Pour str = "gog", la sortie doit être false.    23  gHappy("ggg")  true  gHappy("gggg")  true  gHappy("umwho cia q6z onb kbs")  true  gHappy("ggg ggg g ggg")  false  gHappy("good grief")  false

## Le Contrat
- **Entrées** : str1
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { gHappy } from './solution';

describe('« g », la lettre heureuse', () => {
  it('Test case 1', () => {
    expect(gHappy("ggg")).toEqual(true);
  });
});

```

## Starter Code
```javascript
export function gHappy(str1) {
  // TODO
}

```
