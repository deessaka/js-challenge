# ADR - Exercice 8 : Pourboire

## 1. Analyse de la consigne
L'objectif est de calculer le montant du pourboire en fonction d'un montant total (nombre) et d'une évaluation du service (chaîne de caractères). Les pourcentages sont : Terrible: 0%, Poor: 5%, Good: 10%, Great: 15%, Excellent: 20%. Le résultat doit être arrondi à l'entier supérieur (ceil). Le service doit être évalué de manière insensible à la casse. Si l'évaluation n'est pas reconnue, il faut renvoyer "Rating not recognised".

## 2. Le Contrat (Ce qu'on teste)
La fonction doit renvoyer l'entier correspondant au pourboire calculé (arrondi au supérieur) ou la chaîne "Rating not recognised" si l'évaluation n'est pas valide.

## 3. Test proposé
```javascript
describe('Exercice 8 - Pourboire', () => {
  it('doit calculer le pourboire pour Excellent service', () => {
    expect(calculateTip(20, "ExcellEnt")).toEqual(4);
  });
  it('doit calculer le pourboire pour Good service avec arrondi supérieur', () => {
    expect(calculateTip(26.95, "goOd")).toEqual(3);
  });
  it('doit renvoyer Rating not recognised', () => {
    expect(calculateTip(20, "hi")).toEqual("Rating not recognised");
  });
});
```

## 4. Starter Code
```javascript
// #8 — Pourboire
function calculateTip(amount, rating) {
  // Votre solution ici
}
```