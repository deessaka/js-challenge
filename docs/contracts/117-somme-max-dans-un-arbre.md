# Somme max dans un arbre

## Analyse de la consigne
Dans un arbre binaire, on doit trouver la somme maximale possible en parcourant une branche de la racine jusqu'à une feuille.
- **Entrée :** `root` (TreeNode, possède `value`, `left`, `right`).
- **Sortie :** `Number` (somme maximale).

## Le Contrat
La fonction parcourt récursivement toutes les branches de l'arbre, accumule les valeurs, et retourne la somme de la branche qui possède le total le plus élevé.

## Test proposé
```javascript
import { strict as assert } from 'assert';

var TreeNode = function(value, left, right) {
  this.value = value;
  this.left = left;
  this.right = right;
};

var root = new TreeNode(5, 
  new TreeNode(-22, new TreeNode(9), new TreeNode(50)), 
  new TreeNode(11, new TreeNode(9), new TreeNode(2))
);

assert.equal(maxSum(root), 33);
```

## Starter Code
```javascript
export function maxSum(root) {
  // Votre code ici
  return 0;
}
```
