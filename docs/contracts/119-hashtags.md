# Hashtags

## Analyse de la consigne
Un générateur de hashtags transforme une phrase en une chaîne concaténée. Chaque mot commence par une majuscule, et le tout est précédé d'un '#'.
- **Entrée :** `str` (String).
- **Sortie :** `String` ou `Boolean` (false).

## Le Contrat
La fonction vérifie d'abord si l'entrée (une fois les espaces vides enlevés) est vide, auquel cas elle renvoie `false`. Sinon, elle convertit chaque mot avec une initiale majuscule, les colle ensemble, ajoute le `#`. Si la taille finale dépasse 140 caractères, elle renvoie `false`. Sinon, elle retourne le hashtag.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.equal(generateHashtag(""), false);
assert.equal(generateHashtag(" Hello there thanks for trying my Kata"), "#HelloThereThanksForTryingMyKata");
assert.equal(generateHashtag("Hello World"), "#HelloWorld");
```

## Starter Code
```javascript
export function generateHashtag(str) {
  // Votre code ici
  return false;
}
```
