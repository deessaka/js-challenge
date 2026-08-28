# ADR - Exercice 9 : Accumulation de lettres

## 1. Analyse de la consigne
L'entrée est une chaîne de caractères (ex: "abcd"). La sortie est une chaîne où chaque caractère de l'entrée est répété un nombre de fois correspondant à sa position (1-indexé). La première occurrence est en majuscule, les suivantes en minuscules, et les blocs sont séparés par un tiret "-".

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer une chaîne formatée avec des blocs séparés par des tirets, où le n-ième bloc contient le n-ième caractère répété n fois (1ère lettre majuscule, le reste minuscule).

## 3. Test proposé
```javascript
describe('Exercice 9 - Accumulation de lettres', () => {
  it('doit accumuler abcd', () => {
    expect(accum("abcd")).toEqual("A-Bb-Ccc-Dddd");
  });
  it('doit accumuler RqaEzty', () => {
    expect(accum("RqaEzty")).toEqual("R-Qq-Aaa-Eeee-Zzzzz-Tttttt-Yyyyyyy");
  });
  it('doit accumuler cwAt', () => {
    expect(accum("cwAt")).toEqual("C-Ww-Aaa-Tttt");
  });
});
```

## 4. Starter Code
```javascript
// #9 — Accumulation de lettres
function accum(s) {
  // Votre solution ici
}
```