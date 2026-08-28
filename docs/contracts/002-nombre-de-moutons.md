# ADR - Exercice 2 : Nombre de moutons

## 1. Analyse de la consigne
La consigne demande de compter le nombre de moutons présents dans un tableau. La présence d'un mouton est indiquée par la valeur booléenne `true`. Le tableau peut contenir de mauvaises valeurs telles que `null` ou `undefined`, qui doivent être ignorées (comme `false`). La sortie attendue est un entier représentant le total de `true`.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer le nombre d'occurrences exactes de la valeur booléenne `true` dans le tableau, en ignorant les autres types de valeurs.

## 3. Test proposé
```javascript
describe('Exercice 2 - Nombre de moutons', () => {
  it('doit renvoyer 17', () => {
    expect(countSheeps([true, true, true, false, true, true, true, true, true, false, true, false, true, false, false, true, true, true, true, true, false, false, true, true])).toEqual(17);
  });
  it('doit gérer les mauvaises valeurs', () => {
    expect(countSheeps([true, null, undefined, false, true])).toEqual(2);
  });
});
```

## 4. Starter Code
```javascript
// #2 — Nombre de moutons
function countSheeps(arrayOfSheep) {
  // Votre solution ici
}
```