# ADR - Exercice 3 : Enlever le premier et le dernier caractère d’une chaîne

## 1. Analyse de la consigne
Il est demandé d'écrire une fonction qui prend en entrée une chaîne de caractères et qui renvoie cette même chaîne amputée de son tout premier et de son tout dernier caractère.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer une nouvelle chaîne correspondant à la chaîne d'entrée sans le premier ni le dernier caractère.

## 3. Test proposé
```javascript
describe('Exercice 3 - Enlever le premier et le dernier caractère', () => {
  it('doit renvoyer "eci est une phras"', () => {
    expect(removeChar("Ceci est une phrase")).toEqual("eci est une phras");
  });
});
```

## 4. Starter Code
```javascript
// #3 — Enlever le premier et le dernier caractère d’une chaîne
function removeChar(str) {
  // Votre solution ici
}
```
