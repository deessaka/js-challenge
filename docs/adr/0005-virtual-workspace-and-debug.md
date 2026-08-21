# 0005 — Espace de travail virtualisé et console de debug

## Statut
Accepté

## Contexte

Dans la continuité de [l'ADR-0004](./0004-integrated-terminal-editor-engine.md) qui a établi l'éditeur intégré du **client terminal** comme expérience principale (en retirant le Watch mode et le support des éditeurs externes), deux frictions majeures sont apparues :

1. **Pollution de l'espace de travail** : L'application créait toujours un fichier local `<slug>.js` dans le dossier courant (`process.cwd()`) de l'utilisateur. C'était un héritage du besoin d'ouvrir le fichier dans VSCode. Désormais, cela ne fait que polluer l'ordinateur de l'apprenant et brouiller son contexte.
2. **Ambiguïté du Dry-Run** : Le raccourci `Ctrl+T` ("Tester") exécutait la batterie de tests complète côté serveur, exactement comme une soumission. Les utilisateurs ont besoin d'une vraie **console de debug** pour tester leurs hypothèses (`console.log`) sans subir la validation stricte des tests avant d'être prêts.
3. **Absence des tests en production** : Lors du déploiement (Render), les scripts de tests JavaScript n'étaient pas copiés par le builder AdonisJS, provoquant une erreur `ENOENT`.

Cette décision amende l'ADR-0004 sur deux points : le contrat de `Ctrl+T` (anciennement dry-run avec tests) et le mécanisme de récupération avec prompt (Restaurer/Inspecter/Ignorer), tous deux livrés via la spec #51. Elle ne modifie ni le contrat des endpoints de l'API v1, ni le schéma de données.

## Décisions

### 1. Espace de travail virtualisé (Option B)
La CLI ne crée plus aucun fichier dans le répertoire courant de l'apprenant. Le document de l'éditeur intégré persiste de manière transparente dans le répertoire d'état de la plateforme (`$XDG_STATE_HOME` ou `~/.local/state/codojo/` sous Linux, équivalents macOS/Windows déjà en place dans `EditorPersistence`). L'apprenant vit une expérience fluide, de type "bac à sable".

- **Un document unique par exercice** : le document n'est plus partitionné par empreinte du répertoire courant (workspace). Lancer `codojo` depuis n'importe quel dossier retrouve le même brouillon.
- **Source de vérité unique** : le document virtuel est écrit atomiquement à chaque changement (avec debounce). Il n'y a plus de « fichier principal » distinct ni de prompt de récupération : l'état durable est toujours le plus récent.
- **Concurrence** : deux instances ouvertes sur le même exercice appliquent la politique « dernière écriture gagnante », silencieusement. L'usage nominal reste un apprenant, une instance.

### 2. Migration non destructive
Au premier lancement d'un exercice sans document virtuel, un éventuel `<slug>.js` hérité de la 0.1.x dans le répertoire courant est importé silencieusement comme document virtuel. Codojo ne supprime jamais le fichier physique ; l'utilisateur le nettoie lui-même. Les anciens enregistrements de récupération sont importés selon le même principe, au mieux.

### 3. Commande d'export vers stdout
`codojo export <slug>` imprime le document virtuel local sur la sortie standard. Codojo n'écrit jamais de fichier ; l'utilisateur redirige explicitement s'il le souhaite (`codojo export fib > fib.js`). Si l'exercice n'a jamais été ouvert localement, une erreur claire renvoie vers le portail web, qui conserve l'historique des soumissions. Les plateformes sans échappatoire (CodeWars, LeetCode) ont vu naître des scrapers tiers : l'export stdout lève cette frustration sans réintroduire de pollution implicite.

### 4. Console de debug exclusive (`Ctrl+T`)
Le raccourci `Ctrl+T` est renommé « Debug ». Côté backend, l'`IsolatedTestRunner` adapte son comportement si `dryRun === true` : il exécute *uniquement* le code de l'apprenant pour capturer les logs V8, **sans charger ni exécuter** le fichier de test Jest. Les assertions sont réservées à la soumission officielle (`Ctrl+Entrée`).

- **Exécution côté serveur** : parité pédagogique avec l'environnement de soumission (même isolate, mêmes limites de 5 s et 100 lignes de logs). Le flag `dryRun` existe déjà dans le validateur et le contrat de l'API v1 ; seule sa sémantique change. La route web legacy `execute`, qui ne transmet jamais `dryRun`, est inchangée.
- **Affichage** : le debug laisse l'éditeur actif et affiche un panneau compact de trois à cinq lignes (statut, durée, dernières lignes de log, première erreur). Le panneau est marqué obsolète dès que le buffer change. La vue Tests reste dédiée aux assertions des soumissions officielles.

### 5. Inclusion des tests dans le build
Afin de réparer les soumissions sur le serveur LIVE, les fichiers de tests (`tests/exercises/**/*.test.js`) sont explicitement déclarés dans les `metaFiles` du fichier `adonisrc.ts` pour être copiés dans le dossier `/build/` de production.

### 6. Coloration et hiérarchie visuelle
L'éditeur intégré (`CodeEditorView`) intégrera une légère marge/séparation sous son en-tête ainsi qu'une coloration syntaxique JavaScript, appliquée **au rendu uniquement** : les calculs d'offsets Unicode du moteur headless restent intacts. La coloration passe par une interface `tokenize(line, language)` extensible, avec un tokenizer JavaScript léger maintenu par Codojo. Un second langage pourra être branché derrière la même interface sans toucher au moteur — l'ajout d'un langage au catalogue restant une décision produit séparée (l'Exercice est JavaScript par définition du glossaire).

### 7. Flux de développement (Local vs Prod)
Pour protéger la version de production stable pendant le développement, le développement local de la CLI repose sur l'injection de l'environnement : `CODOJO_API_URL=http://localhost:3333`. Un script `npm run dev:cli` facilite cette exécution isolée sans nécessiter de `npm link` global risqué.

## Conséquences

- `EditorPersistence` ne reçoit plus de chemin issu de `process.cwd()` : le document virtuel vit dans le répertoire d'état, clé par exercice, avec écriture atomique à chaque changement.
- `codojo start <slug>` ouvre directement l'éditeur intégré sur l'exercice (document virtuel créé à la volée) ; `codojo submit` lit le document virtuel. Aucun chemin de la CLI ne crée de fichier dans le répertoire courant.
- L'API fait évoluer la sémantique de `dryRun` dans `IsolatedTestRunner` (run sans Jest) ; les endpoints et le validateur sont inchangés.
- Le catalogue de raccourcis renomme le libellé de `Ctrl+T` en « Debug » ; la spec #51 et les formulations « dry-run » des tickets livrés (#59) sont annotées comme amendées par la présente décision.
- Le vocabulaire du glossaire (`CONTEXT.md`) est enrichi : **Console de debug** et **Espace de travail virtualisé** ; « dry-run » est déprécié.
- L'expérience terminale devient plus robuste, plus propre, et alignée avec les outils modernes de formation de type Exercism ou Codecademy.
