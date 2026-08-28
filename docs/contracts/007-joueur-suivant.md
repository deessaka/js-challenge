# ADR - Exercice 7 : Joueur suivant

## 1. Analyse de la consigne
Le jeu oppose deux joueurs : "black" et "white". Le joueur qui gagne un tour commence le suivant. La fonction reçoit la couleur du joueur actuel (chaîne) et un booléen indiquant s'il a gagné ou non (`true` ou `false`). Elle doit renvoyer le nom du joueur qui jouera le tour suivant.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer le nom du joueur ("black" ou "white") devant jouer le prochain tour selon qu'il ait gagné ou perdu.

## 3. Test proposé
```javascript
describe('Exercice 7 - Joueur suivant', () => {
  it('doit renvoyer white si black perd', () => {
    expect(whoseMove("black", false)).toEqual("white");
  });
  it('doit renvoyer white si white gagne', () => {
    expect(whoseMove("white", true)).toEqual("white");
  });
  it('doit renvoyer black si white perd', () => {
    expect(whoseMove("white", false)).toEqual("black");
  });
});
```

## 4. Starter Code
```javascript
// #7 — Joueur suivant
function whoseMove(lastPlayer, win) {
  // Votre solution ici
}
```