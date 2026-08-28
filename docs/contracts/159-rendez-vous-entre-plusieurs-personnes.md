# Rendez-vous entre plusieurs personnes

## Analyse de la consigne
Il faut trouver le premier créneau commun d'une durée donnée parmi les agendas de plusieurs personnes. Les créneaux doivent être situés entre 09h00 et 19h00 et être au format texte "hh:mm". Si un tel créneau n'existe pas, la fonction doit renvoyer `null`.

## Le Contrat
- **Entrée** : `schedules` (Array<Array<Array<string>>>) - Un tableau d'agendas, chaque agenda étant un tableau de réunions, chaque réunion étant un tableau `[début, fin]` au format "hh:mm".
- **Entrée 2** : `duration` (number) - La durée souhaitée du rendez-vous, en minutes.
- **Sortie** : (string | null) - L'heure de début du premier créneau compatible au format "hh:mm", ou `null` si aucun créneau ne convient.

## Test proposé
```javascript
const assert = require('assert');

const schedules = [
  [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
  [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
  [['17:45', '19:00']]
];

assert.strictEqual(getStartTime(schedules, 60), "12:15");
```

## Starter Code
```javascript
function getStartTime(schedules, duration) {
  // Votre code ici
  return null;
}
```
