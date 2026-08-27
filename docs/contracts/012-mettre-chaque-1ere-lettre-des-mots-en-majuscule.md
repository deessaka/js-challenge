# ADR - Exercice 12 : Mettre chaque 1ere lettre des mots en majuscule

## 1. Analyse de la consigne
L'exercice consiste à ajouter une méthode `toJadenCase` au prototype `String` en JavaScript. Cette méthode doit renvoyer une nouvelle chaîne où la première lettre de chaque mot est en majuscule, comme dans les tweets de Jaden Smith.

## 2. Le Contrat (Ce qu'on teste)
La méthode appelée sur une instance de chaîne de caractères doit renvoyer une nouvelle chaîne avec l'initiale de chaque mot capitalisée, sans altérer le reste des lettres.

## 3. Test proposé
```javascript
describe('Exercice 12 - Mettre chaque 1ere lettre en majuscule', () => {
  it('doit capitaliser chaque mot', () => {
    expect("Ceci est une phrase".toJadenCase()).toEqual("Ceci Est Une Phrase");
  });
});
```

## 4. Starter Code
```javascript
// #12 — Mettre chaque 1ere lettre des mots en majuscule
String.prototype.toJadenCase = function () {
  // Votre solution ici
};
```