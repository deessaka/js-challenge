# Données sur 1 octet

## Analyse de la consigne
> Vous devez surveiller des installations industrielles dans le cercle arctique à l’aide de 1 à 16 caméras. En 
raison des coûts élevés des données, chaque commande envoyée à ces caméras est limitée à un octet. 
Chaque caméra dans chaque installation est initialement réglée à 30 degrés vers le bas (-30°) et pointée 
vers l'avant. Les caméras peuvent être commandées à distance pour les déplacer vers le haut (up) ou le 
bas (down), à gauche (left) ou à droite (right), jusqu'à 45 degrés maximum dans chacune des directions. 
'up' et 'right' sont considérés comme positifs, 'down' et 'left' sont considérés comme négatifs. 
Les quatre premiers bits du paquet représentent l’ID de la caméra (indexées à partir de 0). Le cinquième 
bit indique s’il faut déplacer la caméra de cinq degrés vers le haut, le sixième bit s’il faut baisser de cinq 
degrés.  Les  septième  et  huitième  bit  indiquent  s’il  faut  déplacer  la  caméra  à  gauche  ou  à  droite 
respectivement, de cinq degrés.  
Complétez ce début de programme : 
function Network (count) { 
  this.cameras = []; 
  59 
  for (var i = 0; i < count; i++) 
    this.cameras.push(new Camera(0, -30)); 
} 
Network.prototype.process = function (byte) { 
  // Ajustement de la caméra suivant la valeur de « byte » 
} 
function Camera (h, v) { 
  this.horizontal = h; 
  this.vertical = v; 
} 
Camera.prototype.move = function (h, v) { 
  // Ajustement de l’angle 
}

## Le Contrat
- **Entrées** : count
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
// require assertions to test Network implementation
```

## Starter Code
```javascript
function Network(count) {
  // Votre code ici
}
```
