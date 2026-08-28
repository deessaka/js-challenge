# ADR - Exercice 16 : Le plus long nombre

## 1. Analyse de la consigne
L'entrée est un tableau de nombres. La sortie attendue est le nombre du tableau qui possède le plus grand nombre de chiffres. Si deux nombres ont la même taille, le premier trouvé dans le tableau est renvoyé.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer le premier élément du tableau dont la conversion en chaîne de caractères présente la plus grande longueur.

## 3. Test proposé
```javascript
describe('Exercice 16 - Le plus long nombre', () => {
  it('doit trouver 100', () => {
    expect(findLongest([1, 10, 100])).toEqual(100);
  });
  it('doit trouver 9000', () => {
    expect(findLongest([9000, 8, 800])).toEqual(9000);
  });
  it('doit trouver le premier parmi des nombres de même taille (900)', () => {
    expect(findLongest([8, 900, 500])).toEqual(900);
  });
});
```

## 4. Starter Code
```javascript
// #16 — Le plus long nombre
function findLongest(array) {
  // Votre solution ici
}
```