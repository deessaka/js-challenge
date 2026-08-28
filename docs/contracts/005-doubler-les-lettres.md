# ADR - Exercice 5 : Doubler les lettres

## 1. Analyse de la consigne
La fonction reçoit une chaîne de caractères et doit renvoyer une nouvelle chaîne où chaque caractère (y compris les espaces et la ponctuation) est répété une fois, en conservant la casse d'origine.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer une chaîne dont chaque caractère a été dupliqué de manière contiguë.

## 3. Test proposé
```javascript
describe('Exercice 5 - Doubler les lettres', () => {
  it('doit doubler "String"', () => {
    expect(doubleChar("String")).toEqual("SSttrriinngg");
  });
  it('doit doubler les espaces et caractères spéciaux', () => {
    expect(doubleChar("Hello World")).toEqual("HHeelllloo  WWoorrlldd");
    expect(doubleChar("1234!_ ")).toEqual("11223344!!__  ");
  });
});
```

## 4. Starter Code
```javascript
// #5 — Doubler les lettres
function doubleChar(str) {
  // Votre solution ici
}
```