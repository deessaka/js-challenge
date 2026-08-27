# Chaîne dans une chaîne

## Analyse de la consigne
> Créez  une  fonction  qui  renvoie true si  une partie  des  caractères  de str1 peut  être  réarrangée  pour 
correspondre à str2, sinon renvoyer false. Par exemple : 
Si str1 est 'rkqodlw' et str2 est 'world', la sortie devrait retourner true. 
Si str1 est 'cedewaraaossoqqyt' et str2 est 'codewars' devrait retourner true. 
Si str1 est 'katas' et str2 est 'steak' devrait renvoyer false. 
Seules les minuscules seront utilisées (a-z). Aucune ponctuation ni aucun chiffre ne sera inclus. 
La performance doit être considérée.

## Le Contrat
- **Entrées** : str1, str2
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
strictEqual(scramble('rkqodlw', 'world'), true);
```

## Starter Code
```javascript
function scramble(str1, str2) {
  // Votre code ici
}
```
