# Mixer 2 chaînes de caractères

## Analyse de la consigne
Le but est de comparer deux chaînes et de compter la fréquence des lettres minuscules. Seules les lettres apparaissant strictement plus d'une fois au maximum dans l'une des chaînes sont conservées. Le résultat doit être formaté spécifiquement en précisant la provenance (1, 2, ou =) puis trié par longueur décroissante et ordre lexicographique.

## Le Contrat
- **Entrée** : `s1` (string), `s2` (string) - Deux chaînes de caractères à comparer.
- **Sortie** : (string) - Une chaîne formatée résumant les différences et fréquences maximales des lettres minuscules, triée selon la consigne.

## Test proposé
```javascript
const assert = require('assert');

let s1 = "my&friend&Paul has heavy hats! &";
let s2 = "my friend John has many many friends &";
assert.strictEqual(mix(s1, s2), "2:nnnnn/1:aaaa/1:hhh/2:mmm/2:yyy/2:dd/2:ff/2:ii/2:rr/=:ee/=:ss");

s1 = "Are the kids at home? aaaaa fffff";
s2 = "Yes they are here! aaaaa fffff";
assert.strictEqual(mix(s1, s2), "=:aaaaaa/2:eeeee/=:fffff/1:tt/2:rr/=:hh");
```

## Starter Code
```javascript
function mix(s1, s2) {
  // Votre code ici
  return "";
}
```
