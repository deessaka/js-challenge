# Distance de Levensthein

## Analyse de la consigne
L'objectif est d'implémenter la classe `Dictionary` avec une méthode `findMostSimilar(term)`. Cette méthode doit utiliser l'algorithme de la distance de Levenshtein pour déterminer quel mot du dictionnaire est le plus proche (en nombre minimum d'ajouts, remplacements et suppressions) du terme donné.

## Le Contrat
- **Entrée (Constructeur)** : `words` (Array<string>) - Un tableau de chaînes de caractères (le dictionnaire).
- **Entrée (findMostSimilar)** : `term` (string) - Le mot à corriger.
- **Sortie** : (string) - Le mot du dictionnaire ayant la plus petite distance de Levenshtein avec `term`.

## Test proposé
```javascript
const assert = require('assert');

const fruits = new Dictionary(['cherry', 'pineapple', 'melon', 'strawberry', 'raspberry']);
assert.strictEqual(fruits.findMostSimilar('strawbery'), 'strawberry');
assert.strictEqual(fruits.findMostSimilar('berry'), 'cherry');
```

## Starter Code
```javascript
class Dictionary {
  constructor(words) {
    this.words = words;
  }
  
  findMostSimilar(term) {
    // Votre code ici
    return "";
  }
}
```
