# Animaux écrasés

## Analyse de la consigne
> Retrouvez le nom de l’animal écrasé à partir de sa photo : 
roadKill(\"==========h===yyyyyy===eeee=n==a========\")  \"hyena\" 
roadKill(\"======pe====nnnnnn=================n=n=ng====u==iiii=iii==nn=============n=\") 
 \"penguin\" 
roadKill(\"=====r=rrr=rra=====eee======bb====b=======\")  \"bear\" 
  57 
La liste des animaux est donnée dans ANIMALS 
ANIMALS=['aardvark','alligator','armadillo','antelope','baboon','bear','bobcat','butterf
ly','cat','camel','cow','chameleon','dog','dolphin','duck','dragonfly','eagle','elephant
','emu','echidna','fish','frog','flamingo','fox','goat','giraffe','gibbon','gecko','hyen
a','hippopotamus','horse','hamster','insect','impala','iguana','ibis','jackal','jaguar',
'jellyfish','kangaroo','kiwi','koala','killerwhale','lemur','leopard','llama','lion','mo
nkey','mouse','moose','meercat','numbat','newt','ostrich','otter','octopus','orangutan',
'penguin','panther','parrot','pig','quail','quokka','quoll','rat','rhinoceros','racoon',
'reindeer','rabbit','snake','squirrel','sheep','seal','turtle','tiger','turkey','tapir',
'unicorn','vampirebat','vulture','wombat','walrus','wildebeast','wallaby','yak','zebra']

## Le Contrat
- **Entrées** : photo
- **Sortie** : Définie par la consigne

## Test proposé
```javascript
const { strictEqual } = require('assert');
strictEqual(roadKill("==========h===yyyyyy===eeee=n==a========"), "hyena");
```

## Starter Code
```javascript
function roadKill(photo) {
  // Votre code ici
}
```
