# ADR - Exercice 6 : Supprimer les doublons

## 1. Analyse de la consigne
L'entrée est une liste (tableau) de nombres. Il faut supprimer les éléments en double et renvoyer le tableau simplifié trié dans l'ordre croissant. 

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer un tableau de nombres contenant uniquement des valeurs uniques, ordonnées du plus petit au plus grand.

## 3. Test proposé
```javascript
describe('Exercice 6 - Supprimer les doublons', () => {
  it('doit enlever les doublons et trier la liste', () => {
    expect(removeDuplicates([1,1,2,4,5,2,1,2,3,5,5,5])).toEqual([1, 2, 3, 4, 5]);
  });
});
```

## 4. Starter Code
```javascript
// #6 — Supprimer les doublons
function removeDuplicates(arr) {
  // Votre solution ici
}
```