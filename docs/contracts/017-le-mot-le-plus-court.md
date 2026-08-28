# ADR - Exercice 17 : Le mot le plus court

## 1. Analyse de la consigne
L'entrée est une chaîne de mots séparés par des espaces. La fonction doit renvoyer la longueur du (ou des) mot(s) le(s) plus court(s) contenu(s) dans la chaîne.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit extraire les mots de la chaîne, évaluer leur longueur et renvoyer le plus petit entier correspondant à la longueur d'un mot.

## 3. Test proposé
```javascript
describe('Exercice 17 - Le mot le plus court', () => {
  it('doit renvoyer 3', () => {
    expect(findShort("bitcoin take over the world maybe who knows perhaps")).toEqual(3);
  });
});
```

## 4. Starter Code
```javascript
// #17 — Le mot le plus court
function findShort(s) {
  // Votre solution ici
}
```