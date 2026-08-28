# Anagrammes

## Analyse de la consigne
> Qu'est-ce  qu’une  anagramme  ?  Eh  bien,  deux  mots  sont  des  anagrammes  les  uns  des  autres  s’ils 
contiennent tous deux les mêmes lettres. Par exemple : 
'abba' et 'baab' == vrai 
'abba' et 'bbaa' == vrai 
'abba' et 'abbba' == faux 
Écrivez une fonction qui trouvera tous les anagrammes d'un mot d'une liste. Vous recevrez deux entrées, 
un  mot  et  un  tableau  avec  des  mots.  Vous  devez  renvoyer  un  tableau  de  tous  les  anagrammes  ou  un 
tableau vide s'il n'y en a pas. Par exemple : 
anagrams('abba', ['aabb', 'abcd', 'bbaa', 'dada']) => ['aabb', 'bbaa'] 
anagrams('racer', ['crazer', 'carer', 'racar', 'caers', 'racer']) => ['carer', 'racer'] 
anagrams('laser', ['lazing', 'lazy',  'lacer']) => []

## Le Contrat
- **Entrées** : word, words
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { deepStrictEqual } = require('assert');
deepStrictEqual(anagrams('abba', ['aabb', 'abcd', 'bbaa', 'dada']), ['aabb', 'bbaa']);
```

## Starter Code
```javascript
function anagrams(word, words) {
  // Votre code ici
}
```
