# Qu’est-ce qui vient après ?

## Analyse de la consigne
Vous recevrez deux entrées : une chaîne de caractères et une lettre. Renvoyez le caractère alphabétique  après chaque instance de la lettre voulue (insensible à la casse).  S'il y a un nombre, une ponctuation ou un trait de soulignement après la lettre, il ne doit pas être renvoyé.  comes_after(\"Pirates say arrrrrrrrr.\",'r')  'arrrrrrrr'  comes_after(\"Free coffee for all office workers!\",'F')  'rfeofi'  comes_after(\"king kUnta is the sickest rap song ever kNown k!\",'k')  'iUeN'  comes_after(\"p8tice makes pottery p0rfect!\",'p')  'o'  comes_after(\"d8u d._ rly 2d1s\",'D')  ''  comes_after(\"nothing to be found here\",'z')  ''

## Le Contrat
- **Entrées** : insensiblelacasse
- **Sortie** : Résultat attendu

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { voulue } from './solution';

describe('Qu’est-ce qui vient après ?', () => {
  it('should work', () => {
    // expect(voulue(...)).toEqual(...);
  });
});

```

## Starter Code
```javascript
export function voulue(insensiblelacasse) {
  // TODO
}

```
