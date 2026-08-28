# Points au tennis

## Analyse de la consigne
Votre ami vous a invité à regarder un match de tennis. Vous vous ennuyez dès le premier jeu et commencez  à chercher quelque chose pour vous divertir. En regardant le tableau des scores, vous vous rendez compte  que vous ne savez même pas combien de points ont été gagnés depuis le début du jeu et vous vous décidez  à le trouver. Le tableau ci-dessous donnent les points au tennis :  zéro (« love » en anglais) : pour aucun point marqué dans le jeu ;  15 : pour un point marqué ;  30 : pour deux points marqués ;  40 : pour trois points marqués.  tennisGamePoints("15-40")  4 // 1 er  joueur = 1 pt et 2 e  joueur = 3 pts  tennisGamePoints("30-all")  4 // 2 pts pour chaque joueur  tennisGamePoints("love-30")  2 // 1 er  joueur = 0 pt et 2 e  joueur = 2 pts  tennisGamePoints("15-30")  3 // 1 er  joueur = 1 pt et 2 e  joueur = 2 pts

## Le Contrat
- **Entrées** : loveenanglais
- **Sortie** : ...

## Test proposé
```javascript
import { describe, it, expect } from 'vitest';
import { ro } from './solution';

describe('Points au tennis', () => {
  it('should work', () => {
    // expect(ro(...)).toEqual(...);
  });
});

```

## Starter Code
```javascript
export function ro(loveenanglais) {
  // TODO
}

```
