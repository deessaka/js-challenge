# ADR - Exercice 19 : RVB vers niveaux de gris

## 1. Analyse de la consigne
L'entrée est un tableau à deux dimensions représentant une image, où chaque pixel est un tableau `[R, G, B]`. La fonction doit convertir cette image couleur en niveaux de gris. Chaque composante d'un pixel gris correspond à la moyenne des valeurs `R`, `G` et `B` du pixel d'origine, arrondie à l'entier le plus proche.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer un tableau de même dimension où chaque triplet `[R, G, B]` est remplacé par `[P, P, P]`, avec `P = Math.round((R + G + B) / 3)`.

## 3. Test proposé
```javascript
describe('Exercice 19 - RVB vers niveaux de gris', () => {
  it('doit convertir l image en niveaux de gris', () => {
    const image = [
      [[123, 231, 12], [56, 43, 124]],
      [[78, 152, 76], [64, 132, 200]]
    ];
    const expected = [
      [[122, 122, 122], [74, 74, 74]],
      [[102, 102, 102], [132, 132, 132]]
    ];
    expect(grayscale(image)).toEqual(expected);
  });
});
```

## 4. Starter Code
```javascript
// #19 — RVB vers niveaux de gris
function grayscale(image) {
  // Votre solution ici
}
```