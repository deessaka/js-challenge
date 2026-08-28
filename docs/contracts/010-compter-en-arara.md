# ADR - Exercice 10 : Compter en Arara

## 1. Analyse de la consigne
L'entrée est un nombre entier représentant une quantité. La tribu Arara compte en utilisant "anane" pour 1 et "adak" pour 2. La sortie doit être une chaîne représentant le nombre en combinant "adak" (autant que possible) puis "anane" si le nombre est impair, le tout séparé par des espaces.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer la traduction correcte en base 2 avec les mots "adak" (2) et "anane" (1) sans espace à la fin.

## 3. Test proposé
```javascript
describe('Exercice 10 - Compter en Arara', () => {
  it('doit renvoyer anane pour 1', () => {
    expect(countArara(1)).toEqual("anane");
  });
  it('doit renvoyer adak anane pour 3', () => {
    expect(countArara(3)).toEqual("adak anane");
  });
  it('doit renvoyer adak adak adak adak pour 8', () => {
    expect(countArara(8)).toEqual("adak adak adak adak");
  });
});
```

## 4. Starter Code
```javascript
// #10 — Compter en Arara
function countArara(n) {
  // Votre solution ici
}
```