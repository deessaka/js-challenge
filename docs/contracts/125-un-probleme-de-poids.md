# Un problème de poids

## Analyse de la consigne
Trier une liste de nombres (passée sous forme de chaîne, séparés par des espaces) selon le "poids" de chaque nombre. Le poids est la somme des chiffres composant le nombre. En cas d'égalité de poids, le tri s'effectue alphabétiquement (comme des chaînes de caractères).
- **Entrée :** `str` (String).
- **Sortie :** `String`.

## Le Contrat
La fonction extrait les nombres, calcule la somme des chiffres de chacun pour déterminer son poids, trie selon ce critère (et alphabétiquement en cas de même poids), puis les rejoint en une seule chaîne.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(orderWeight("103 123 4444 99 2000"), "2000 103 123 4444 99");
```

## Starter Code
```javascript
export function orderWeight(str) {
  // Votre code ici
  return "";
}
```
