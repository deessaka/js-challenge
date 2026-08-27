# ADR - Exercice 20 : Carré des nombres

## 1. Analyse de la consigne
L'entrée est un nombre entier. La fonction doit élever chaque chiffre de ce nombre au carré et les concaténer pour former un nouveau nombre qui sera retourné. (Par exemple, 9119 devient 811181 car 9^2 = 81, 1^2 = 1).

## 2. Le Contrat (Ce qu'on teste)
La fonction doit concaténer le carré de chaque chiffre individuel du nombre passé en paramètre et retourner le nombre entier résultant.

## 3. Test proposé
```javascript
describe('Exercice 20 - Carré des nombres', () => {
  it('doit élever chaque chiffre au carré', () => {
    expect(squareDigits(9119)).toEqual(811181);
  });
});
```

## 4. Starter Code
```javascript
// #20 — Carré des nombres
function squareDigits(num) {
  // Votre solution ici
}
```