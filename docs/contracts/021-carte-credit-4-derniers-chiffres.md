# ADR - Exercice 21 : Carte crédit – 4 derniers chiffres

## 1. Analyse de la consigne
L'entrée est une chaîne de caractères (par ex., un numéro de carte de crédit). La sortie doit être une nouvelle chaîne dans laquelle tous les caractères ont été remplacés par '#' (dièse), à l'exception des quatre derniers caractères, qui restent inchangés.

## 2. Le Contrat (Ce qu'on teste)
La fonction doit masquer tous les caractères d'une chaîne par le caractère '#', sauf pour les quatre derniers caractères qui doivent être retournés en clair. Si la chaîne est plus courte que 4 caractères, elle reste inchangée.

## 3. Test proposé
```javascript
describe('Exercice 21 - Carte crédit', () => {
  it('doit masquer la carte sauf les 4 derniers chiffres', () => {
    expect(maskify('4556364607935616')).toEqual('############5616');
  });
  it('ne doit rien masquer si la chaîne fait 1 caractère', () => {
    expect(maskify('1')).toEqual('1');
  });
  it('doit masquer seulement le premier sur 5 caractères', () => {
    expect(maskify('11111')).toEqual('#1111');
  });
});
```

## 4. Starter Code
```javascript
// #21 — Carte crédit – 4 derniers chiffres
function maskify(cc) {
  // Votre solution ici
}
```