# ADR - Exercice 1 : Nombre de personnes dans le bus

## 1. Analyse de la consigne
Le but de cet exercice est de calculer le nombre de personnes restantes dans un bus après une série d'arrêts. L'entrée est une liste de paires d'entiers, où le premier entier représente le nombre de personnes qui montent et le deuxième entier représente le nombre de personnes qui descendent. Le deuxième entier du premier arrêt est toujours 0. La sortie attendue est un entier, correspondant au nombre de personnes encore dans le bus après le dernier arrêt.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer un entier représentant le total des passagers restants, en additionnant les montées et en soustrayant les descentes pour chaque arrêt.

## 3. Test proposé
```javascript
describe('Exercice 1 - Nombre de personnes dans le bus', () => {
  it('doit renvoyer 5', () => {
    expect(number([[10,0],[3,5],[5,8]])).toEqual(5);
  });
  it('doit renvoyer 17', () => {
    expect(number([[3,0],[9,1],[4,10],[12,2],[6,1],[7,10]])).toEqual(17);
  });
  it('doit renvoyer 21', () => {
    expect(number([[3,0],[9,1],[4,8],[12,2],[6,1],[7,8]])).toEqual(21);
  });
});
```

## 4. Starter Code
```javascript
// #1 — Nombre de personnes dans le bus
function number(busStops) {
  // Votre solution ici
}
```
