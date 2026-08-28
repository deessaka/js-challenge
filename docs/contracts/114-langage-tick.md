# Langage Tick

## Analyse de la consigne
La fonction implémente un interpréteur pour le langage "Tick" qui possède une bande de mémoire infinie (cellules initialisées à 0) et 4 instructions : `>` (droite), `<` (gauche), `+` (incrémenter cellule, modulo 256), `*` (afficher la cellule en ASCII).
- **Entrée :** `code` (String).
- **Sortie :** `String`.

## Le Contrat
L'interpréteur lit le code caractère par caractère, ignorant ceux qui ne sont pas des commandes. Il maintient un pointeur sur une bande de mémoire et construit une chaîne de sortie correspondant aux valeurs ASCII imprimées.

## Test proposé
```javascript
import { strict as assert } from 'assert';

const code = "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*>++++++++++++++++++++++++++++++++*";
assert.equal(interpreter(code), "Hello");
```

## Starter Code
```javascript
export function interpreter(code) {
  // Votre code ici
  return "";
}
```
