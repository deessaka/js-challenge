# ADR - Exercice 4 : Nettoyage de chaînes

## 1. Analyse de la consigne
L'objectif est de supprimer tous les chiffres d'une chaîne de caractères (qui contient potentiellement du texte, des espaces et des caractères spéciaux). L'entrée est une chaîne de caractères et la sortie doit être la chaîne sans aucun chiffre (0-9).

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer une chaîne de caractères dont tous les caractères numériques ont été retirés, en préservant scrupuleusement les autres caractères.

## 3. Test proposé
```javascript
describe('Exercice 4 - Nettoyage de chaînes', () => {
  it('doit conserver les caractères spéciaux sans nombres', () => {
    expect(stringClean('! !')).toEqual('! !');
  });
  it('doit supprimer tous les nombres', () => {
    expect(stringClean('123456789')).toEqual('');
  });
  it('doit nettoyer une phrase avec nombres au milieu', () => {
    expect(stringClean("(E3at m2e2!!)")).toEqual("(Eat me!!)");
  });
  it('doit nettoyer un long texte', () => {
    expect(stringClean("Wh7y can't we3 bu1y the goo0d software3? #cheapskates3")).toEqual("Why can't we buy the good software? #cheapskates");
  });
});
```

## 4. Starter Code
```javascript
// #4 — Nettoyage de chaînes
function stringClean(s) {
  // Votre solution ici
}
```