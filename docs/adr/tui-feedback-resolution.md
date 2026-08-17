# Résolution des retours TUI

## Constat

La TUI affichait une palette trop homogène, le runner exposait une fonction `log` qui écrivait côté serveur mais ne renvoyait aucune sortie au client, et le login demandait directement un token sans expliquer son origine.

## Décisions

### Palette et hiérarchie

Conserver le support `NO_COLOR`, mais centraliser une palette sémantique ANSI 16 couleurs dans `cli/src/tui/ansi.ts`. Les états de succès, d’échec, d’avertissement et de focus utilisent respectivement vert, rouge, jaune et cyan. Un panneau focalisé reçoit une bordure lourde (`━`) et un fond de focus ; les panneaux secondaires conservent une bordure légère (`─`) et un fond de surface. Aucun composant ne doit réintroduire de codes ANSI codés en dur.

### Logs d’exécution

Le runner collecte les appels `log(...)` et `console.log(...)` dans l’isolate V8 sous la forme de lignes texte bornées en nombre et en longueur. Le résultat interne du runner expose `consoleLogs` séparément de `results`. Le DTO public et le type CLI exposent le même champ. Les logs sont renvoyés dans la réponse de soumission immédiate et dans le dry-run ; ils ne sont pas persistés dans la base pour éviter une migration et parce qu’ils appartiennent à une exécution, non à l’historique métier. Les résultats d’assertions restent dans `results` et ne doivent jamais être affichés dans la section logs.

### Connexion CLI

Le MVP conserve le stockage local sécurisé du token, conformément au contrat API-first existant. Le dashboard Web fournit une section Profil dédiée au terminal avec une action POST « Générer un token CLI ». Le token brut est affiché une seule fois dans un message flash après génération ; seules les métadonnées non secrètes peuvent être listées ensuite. La TUI affiche toujours l’URL du profil et les étapes en français avant le champ masqué. La sous-commande `login` ouvre cette URL avec le navigateur système lorsque cela est possible, puis conserve la saisie manuelle comme fallback. Aucun token ne doit apparaître dans les logs ou dans les réponses de listing.

## Compatibilité

Les routes historiques restent inchangées. Les routes API v1 conservent leur enveloppe `{ data: ... }`. `consoleLogs` est optionnel pour rester compatible avec les réponses existantes et les anciennes soumissions. Le guard `web` protège la génération du token ; le guard `api` continue de vérifier les tokens dans `auth_access_tokens`.
