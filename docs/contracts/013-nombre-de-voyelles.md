# ADR - Exercice 13 : Nombre de voyelles

## 1. Analyse de la consigne
L'entrée est une chaîne de caractères. La sortie est un entier. Il faut compter et renvoyer le nombre total de voyelles ('a', 'e', 'i', 'o', 'u') présentes dans la chaîne.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer le nombre exact d'occurrences des cinq voyelles spécifiées, quelles que soient les autres lettres présentes.

## 3. Test proposé
```javascript
describe('Exercice 13 - Nombre de voyelles', () => {
  it('doit compter les voyelles', () => {
    expect(getCount("Ceci est une phrase")).toEqual(7);
  });
});
```

## 4. Starter Code
```javascript
// #13 — Nombre de voyelles
function getCount(str) {
  // Votre solution ici
}
```