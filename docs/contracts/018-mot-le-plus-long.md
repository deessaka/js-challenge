# ADR - Exercice 18 : Mot le plus long

## 1. Analyse de la consigne
L'entrée est une chaîne de mots séparés par des espaces. La fonction doit renvoyer le mot le plus long. S'il y a égalité de longueur pour plusieurs mots, la fonction doit renvoyer le dernier d'entre eux.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer une chaîne de caractères correspondant au mot le plus long ou, en cas d'ex aequo, au mot le plus long situé le plus à droite dans la phrase.

## 3. Test proposé
```javascript
describe('Exercice 18 - Mot le plus long', () => {
  it('doit trouver fgh', () => {
    expect(longestWord('a b c d e fgh')).toEqual("fgh");
  });
  it('doit trouver three', () => {
    expect(longestWord('one two three')).toEqual("three");
  });
  it('doit trouver grey', () => {
    expect(longestWord('red blue grey')).toEqual("grey");
  });
});
```

## 4. Starter Code
```javascript
// #18 — Mot le plus long
function longestWord(s) {
  // Votre solution ici
}
```