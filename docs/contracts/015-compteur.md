# ADR - Exercice 15 : Compteur

## 1. Analyse de la consigne
L'entrée est une chaîne de caractères représentant un nombre (ex: "1250"). La fonction doit renvoyer un tableau de tableaux de nombres. Pour chaque chiffre de l'entrée `x`, il faut générer un tableau allant de 0 à `x`.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer un tableau principal dont la longueur équivaut à celle de la chaîne d'entrée. Chaque sous-tableau doit correspondre à une séquence de 0 jusqu'au chiffre évalué à cet index.

## 3. Test proposé
```javascript
describe('Exercice 15 - Compteur', () => {
  it('doit générer les séquences pour 1250', () => {
    expect(counterEffect("1250")).toEqual([[0,1],[0,1,2],[0,1,2,3,4,5],[0]]);
  });
  it('doit générer les séquences pour 0050', () => {
    expect(counterEffect("0050")).toEqual([[0],[0],[0,1,2,3,4,5],[0]]);
  });
  it('doit générer les séquences pour 0000', () => {
    expect(counterEffect("0000")).toEqual([[0],[0],[0],[0]]);
  });
});
```

## 4. Starter Code
```javascript
// #15 — Compteur
function counterEffect(str) {
  // Votre solution ici
}
```