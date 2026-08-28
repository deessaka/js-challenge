# Les martins-chasseurs

## Analyse de la consigne
Une famille de kookaburras (martin-chasseur) est dans mon jardin. Je ne peux pas les voir tous, mais je  peux les entendre ! Le truc pour compter les kookaburras est d\'écouter attentivement :  - Les mâles font HaHaHa ...  - Les femelles font hahaha ...  Et ils alternent toujours mâles / femmes  kookaCounter("")  0  kookaCounter("hahahahaha")  1  kookaCounter("hahahahahaHaHaHa")  2  kookaCounter("HaHaHahahaHaHa")  3

## Le Contrat
- **Entrées** : martinchasseur
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { kookaburras } from './solution';

describe('Les martins-chasseurs', () => {
  it('should work', () => {
    // expect(kookaburras(...)).toEqual(...);
  });
});

```

## Starter Code
```javascript
export function kookaburras(martinchasseur) {
  // TODO
}

```
