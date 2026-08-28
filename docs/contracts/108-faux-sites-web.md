# Faux sites web

## Analyse de la consigne
La fonction doit générer une liste de faux noms de domaine à partir d'un domaine donné en appliquant une des trois règles de modification (o -> 0, l -> 1, suppression d'un caractère dans un doublon consécutif). Le domaine de premier niveau ne doit pas être affecté. Les résultats doivent être triés par ordre Unicode.
- **Entrée :** `siteName` (String).
- **Sortie :** `Array` de chaînes de caractères.

## Le Contrat
La fonction doit isoler la partie nom du domaine, y appliquer chaque règle possible une par une pour générer des variantes uniques, puis rattacher le domaine de premier niveau et renvoyer la liste triée. Si aucune modification n'est possible, renvoyer un tableau vide.

## Test proposé
```javascript
import { strict as assert } from 'assert';

assert.deepEqual(goodName("codewars.com"), ["c0dewars.com"]);
assert.deepEqual(goodName("microsoft.com"), ["micr0soft.com", "micros0ft.com"]);
assert.deepEqual(goodName("pex4fun.com"), []);
```

## Starter Code
```javascript
export function goodName(siteName) {
  // Votre code ici
  return [];
}
```
