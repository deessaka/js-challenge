---
title: Soumettre une solution
description: Enregistrer une validation officielle après avoir vérifié votre code.
---

La soumission officielle envoie votre code au serveur Codojo pour une validation complète. Elle doit être utilisée lorsque vous avez terminé votre boucle de développement et que vous souhaitez enregistrer le résultat dans votre progression.

## Préparer la soumission

Commencez par sauvegarder votre code, puis exécutez un dry-run. Vérifiez les tests échoués, les logs et le challenge sélectionné. Si l’exercice est verrouillé ou si vous n’êtes pas connecté, la soumission ne pourra pas être validée.

## Depuis l’application Web

Utilisez l’action de soumission du challenge ouvert. Le résultat indique si la solution est acceptée et détaille les cas vérifiés. Une solution acceptée est enregistrée dans votre progression.

## Depuis la CLI

Après l’installation et la connexion, utilisez :

```bash
codojo submit <slug> [code.js]
```

Si le fichier `code.js` n’est pas fourni, la CLI utilise l’espace de travail local associé au challenge. Pour voir le prochain exercice recommandé :

```bash
codojo next
```

La commande renvoie un code de sortie non nul lorsqu’une erreur de validation ou d’exécution empêche la soumission. Consultez [le dépannage](/reference/troubleshooting/) si le problème persiste.

> Ne partagez jamais votre token API dans le code, un dépôt public ou une capture d’écran.
