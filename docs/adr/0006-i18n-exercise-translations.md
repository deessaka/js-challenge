# 0006 — Internationalisation des exercices (i18n FR/EN)

## Statut

Proposé

## Contexte

Les exercices Codojo sont exclusivement rédigés en français. La population cible est principalement camerounaise, où la cohabitation du français et de l'anglais est constitutive : une part des apprenants est unilingue anglophone et ne peut pas comprendre les énoncés tels qu'ils existent aujourd'hui. L'absence de traduction est un frein direct à l'accès au contenu pédagogique.

Deux approches ont été examinées et écartées avant de retenir la solution ci-dessous.

**Répliquer la base de données** revient à maintenir deux instances du schéma `exercises` en parallèle. Cette option garantit la désynchronisation à terme sur tous les champs non-textuels — difficulté, points, statut, prérequis, contrats d'exercice — et multiplie le coût de toute évolution du schéma.

**Ajouter des colonnes `title_fr` / `title_en` directement sur la table `exercises`** viole la première forme normale : le nombre de colonnes croît linéairement avec le nombre de langues, le schéma n'est pas extensible au-delà de deux langues, et chaque requête existante doit être modifiée pour sélectionner la bonne colonne selon la locale.

La décision retenue introduit une table de traductions séparée, conforme au pattern Entity-Translation, qui isole les champs lisibles traduits sans toucher aux données comportementales de l'exercice.

## Décisions

### 1. Table `exercise_translations`

Une table dédiée `exercise_translations` stocke une ligne par couple `(exercise_id, locale)`. Elle porte les seuls champs à vocation éditoriale : `title`, `description` et `hint`. Tous les autres champs de l'exercice — difficulté, points, catégorie, prérequis, code de démarrage, statut, contrat — restent dans la table `exercises` et ne sont jamais dupliqués.

Les données sources demeurent en français dans `exercises`. La table `exercise_translations` ne contient que les langues additionnelles (anglais en premier). Une contrainte `UNIQUE (exercise_id, locale)` garantit qu'il ne peut exister qu'une traduction par langue et par exercice. Un index sur `(exercise_id, locale, status)` couvre les requêtes de résolution à la lecture.

Chaque traduction porte un champ `status` à trois valeurs : `draft` (en cours de rédaction), `auto_generated` (produite par un LLM, en attente de relecture humaine) et `published` (validée par un administrateur).

Un champ `locale` est également ajouté à la table `users` avec la valeur par défaut `fr`, afin de persister la préférence de langue du compte.

### 2. Résolution de la locale

La locale active pour une requête est déterminée dans l'ordre de priorité suivant, du plus fort au plus faible :

1. Le header HTTP `X-Codojo-Locale` transmis par le CLI, permettant un override de session via le flag `--lang`.
2. Le champ `locale` du profil utilisateur en base de données.
3. Le fallback implicite `fr`.

Seules les locales présentes dans la liste `['fr', 'en']` sont acceptées. Toute valeur inconnue est silencieusement remplacée par `fr`. La validation se fait côté serveur dans un service dédié `LocaleResolverService`, de manière à centraliser cette logique pour tous les endpoints concernés.

Quand une traduction est trouvée, l'API retourne les champs traduits avec un champ `translationStatus: 'translated'`. Quand aucune traduction n'existe pour la locale demandée, l'API retourne les champs français originaux avec `translationStatus: 'fallback'`. Le CLI affiche dans ce cas une notice discrète : `⚠ (traduction en cours, affichage en français)`.

### 3. Traduction automatique par LLM

Un service `TranslationService` encapsule les appels à un LLM externe (OpenAI ou Anthropic) pour générer `title`, `description` et `hint` en anglais à partir du contenu français source. Le fournisseur et la clé d'API sont configurables via les variables d'environnement `TRANSLATION_PROVIDER` et `TRANSLATION_API_KEY`.

Le déclenchement opère en deux temps :

**Batch sur l'existant.** Une commande Ace `node ace translations:generate` traduit tous les exercices publiés qui ne disposent pas encore de traduction pour la locale cible. Elle accepte les flags `--locale`, `--force` et `--dry-run`. Le traitement par lots de dix exercices avec un délai entre chaque lot préserve les quotas des fournisseurs LLM. En cas d'erreur sur un exercice, la commande continue sur les suivants et loggue l'incident.

**À la publication.** Lorsqu'un administrateur passe un exercice au statut `published`, une tâche de fond non-bloquante est déclenchée pour générer la traduction manquante. La publication de l'exercice n'attend pas le résultat du LLM : si la génération échoue, l'erreur est logguée silencieusement et la traduction sera produite lors du prochain passage du batch.

### 4. Correction manuelle depuis le portail

Les administrateurs peuvent relire et corriger les traductions générées automatiquement depuis le formulaire d'exercice existant, via un onglet « Traductions » ajouté à la page d'édition. L'onglet présente pour chaque locale les champs `title`, `description` et `hint` avec leur statut courant et leur date de dernière modification. La sauvegarde d'une correction passe le statut de la traduction à `published` et journalise l'action `exercise.translation_updated` dans le `AdminActivityLog`, conformément au principe d'action sensible défini dans `CONTEXT.md`.

## Conséquences

- Le schéma est normalisé et extensible : ajouter une troisième langue (arabe, espagnol…) ne nécessite aucune migration destructive, seulement de nouvelles lignes dans `exercise_translations`.
- Les utilisateurs français existants ne subissent aucune régression : le fallback `fr` est transparent et ne modifie pas les chemins de requête actuels.
- Le contrat de l'API v1 reste rétrocompatible : `translationStatus` est un champ additionnel optionnel qui n'affecte pas les clients existants.
- La qualité des traductions automatiques dépend du LLM retenu et entraîne un coût d'API proportionnel au nombre d'exercices. Les traductions `auto_generated` doivent être considérées comme des brouillons en attente de validation humaine.
- Le header `X-Codojo-Locale` introduit un vecteur d'entrée supplémentaire côté serveur, qui doit être validé strictement par `LocaleResolverService` avant toute utilisation.
- Les nouveaux exercices publiés seront temporairement visibles en français pour les utilisateurs anglophones, jusqu'à ce que la tâche de traduction de fond aboutisse. La notice de fallback rend cette latence transparente sans bloquer l'accès.
