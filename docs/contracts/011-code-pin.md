# ADR - Exercice 11 : Code PIN

## 1. Analyse de la consigne
L'entrée est une chaîne de caractères. La sortie est un booléen (`true` ou `false`). La fonction doit vérifier si la chaîne est un code PIN valide, c'est-à-dire si elle est composée uniquement de chiffres et a une longueur exacte de 4 ou de 6 caractères.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer `true` si la chaîne ne contient que des chiffres et a une longueur de 4 ou 6. Elle doit renvoyer `false` dans le cas contraire (lettres, autres longueurs).

## 3. Test proposé
```javascript
describe('Exercice 11 - Code PIN', () => {
  it('doit valider un code à 4 chiffres', () => {
    expect(ValidatePIN("1234")).toEqual(true);
  });
  it('doit refuser un code de mauvaise taille', () => {
    expect(ValidatePIN("12345")).toEqual(false);
  });
  it('doit refuser un code contenant des lettres', () => {
    expect(ValidatePIN("a234")).toEqual(false);
  });
});
```

## 4. Starter Code
```javascript
// #11 — Code PIN
function ValidatePIN(pin) {
  // Votre solution ici
}
```