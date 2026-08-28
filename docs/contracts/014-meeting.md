# ADR - Exercice 14 : Meeting

## 1. Analyse de la consigne
L'entrée est une liste d'objets décrivant des développeurs (nom, pays, langage, repas, etc.). La fonction doit compter les options alimentaires sélectionnées et renvoyer un objet dont les clés sont les types de repas et les valeurs le nombre de personnes ayant choisi ce repas.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit grouper les données du tableau d'entrée et retourner un objet comptabilisant correctement les fréquences d'apparition de chaque type de repas.

## 3. Test proposé
```javascript
describe('Exercice 14 - Meeting', () => {
  it('doit compter les repas', () => {
    const list1 = [
      {FirstName: 'Noah', lastName: 'M.', pays: 'Suisse', continent: 'Europe', age: 19, langue: 'C', Repas: 'végétarien'},
      {FirstName: 'Anna', lastName: 'R.', pays: 'Liechtenstein', continent: 'Europe', age: 52, langue: 'JavaScript', Repas: 'standard'},
      {FirstName: 'Ramona', lastName: 'R.', pays: 'Paraguay', continent: 'Amériques', age: 29, langue: 'Ruby', Repas: 'vegan'},
      {FirstName: 'George', lastName: 'B.', pays: 'Angleterre', continent: 'Europe', age: 81, langue: 'C', Repas: 'végétarien'}
    ];
    expect(countFoodOptions(list1)).toEqual({végétarien: 2, standard: 1, vegan: 1});
  });
});
```

## 4. Starter Code
```javascript
// #14 — Meeting
function countFoodOptions(list) {
  // Votre solution ici
}
```