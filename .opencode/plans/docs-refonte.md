# Plan — Refonte professionnelle de `docs/content/`

## Décisions validées avec l'utilisateur

- **Terminologie** : « exercice » partout (conforme à `CONTEXT.md`), abandon de « challenge »/« défi » dans la prose. Le slug de fichier `challenges.md` est conservé pour la stabilité des URL (une seule référence interne, mais stabilité = principe pro).
- **Registre** : vouvoiement, ton professionnel et pédagogique, orienté étudiants.
- **Notions** : 1 page d'intro + 3 pages détaillées (section « Notions »).
- **Liens morts** : création des pages `submitting.md` et `configuration.md`.
- **Domaine** : le bon domaine est `https://codojo.ekodevs.com` (avec « s »). Vérifié par DNS : `codojo.ekodevs.com` résout vers Render/Cloudflare, `codojo.ekodev.com` ne résout pas. Les 2 liens de la doc sont à corriger ; le code CLI est déjà correct (aucune modification code).

## Faits vérifiés dans le code

| Fait | Source |
|---|---|
| Frontmatter requis : title/description/section/order (+draft) | `app/services/documentation_service.ts:97-116` |
| Pas d'images autorisées (allowlist sanitize-html) | idem :37-60 |
| Difficulté affichée : Facile / Moyen / Difficile | `cli/src/ui/ChallengeList.tsx:106-108` |
| Catalogue : 161 exercices, difficultés 8→3 | `CONST/exercises.ts` |
| Commandes `codojo` et `dojo` équivalentes | `cli/README.md:5` |
| Token généré depuis profil web, affiché une seule fois | `cli/README.md:68` |
| Config : `~/.config/codojo/config.json`, XDG_CONFIG_HOME respecté, mode 0700 | `cli/src/config_store.ts:25-27,60` |
| Migration auto depuis `~/.config/js-challenge/` | `cli/src/config_store.ts:40-52` |
| Priorité URL : `--api-url` > `CODOJO_API_URL` > `JS_CHALLENGE_API_URL` > config.json > défaut | `cli/src/main.ts:79-87` |
| Défaut : `https://codojo.ekodevs.com` | `cli/src/config_store.ts:5` |
| Console de debug : exécution sans tests via Ctrl+T (éditeur intégré) | `CONTEXT.md` |
| CLI : Ink 7, symboles Unicode standards uniquement (`●`, `█`, braille) — aucune police Nerd Font requise | `cli/package.json`, `cli/src/ui/*` |

## Structure finale des sections

| Section | Pages (slug → order) |
|---|---|
| Premiers pas | index → 1, getting-started → 2 |
| Notions (nouvelle) | notions → 5, functional-programming → 6, regular-expressions → 7, advanced-methods → 8 |
| Exercices | challenges → 10, submitting → 11 (nouveau) |
| Outils | cli → 20, configuration → 21 (nouveau) |
| Référence | security → 30 |

## Fichiers à créer (6)

1. **notions.md** — intro aux 3 familles, tableau notion/méthodes/apprentissage, logique de progression séquentielle, liens vers les 3 pages détaillées.
2. **functional-programming.md** — `map/filter/reduce` : rôle, exemple par méthode ancré sur les exercices réels (#20 Carré des nombres, #6 Supprimer les doublons, #100 Somme de nombres), pièges (return oublié dans bloc `{}`, mutation de source avec `sort()`, reduce sans valeur initiale sur tableau vide), cas limites.
3. **regular-expressions.md** — table des briques (classes `\d \w \s`, ancres `^ $`, quantificateurs, groupes, alternatives), exemples ancrés (#11 Code PIN `/^(\d{4}|\d{6})$/`, #13 Nombre de voyelles avec `match` + flag g + gestion null, #12 Majuscules initiales avec `replace(/\b\w/g, …)`, #58 Numéros de téléphone avec groupes `$1 $2…`), pièges (ancres manquantes, échappement du `.`, flag g), conseil : préférer les méthodes de chaîne quand c'est plus simple.
4. **advanced-methods.md** — tableau comparatif every/some/find (retour, arrêt anticipé, sémantique tableau vide : every→true, some→false, find→undefined), exemples (#33 Divisible par ?, mots > 5 lettres, find premier pair), garde-fou undefined, compagnons (findIndex, includes, flatMap).
5. **submitting.md** — enregistrement ≠ soumission officielle, ce que fait le serveur (recharge l'exercice, applique le contrat, environnement isolé), lecture d'un échec (obtenu vs attendu), méthode de correction (console de debug Ctrl+T, une modification à la fois), checklist de cas limites avant soumission.
6. **configuration.md** — emplacement config (~/.config/codojo/config.json, XDG_CONFIG_HOME), contenu JSON (apiBaseUrl, token), priorité complète des sources d'URL, migration automatique legacy js-challenge, cycle de vie du token (profil web, affiché une fois, révocation), dépannage (401, commande introuvable, instance locale `CODOJO_API_URL=http://localhost:3333`).

## Fichiers à retoucher (5)

1. **index.md** — corriger domaine `codojo.ekodev.com` → `codojo.ekodevs.com` (ligne 25), terminologie exercice, ajout point d'entrée vers notions.md, reformulation parcours.
2. **getting-started.md** — corriger domaine (ligne 12), nouvelle section « Prérequis » (Node.js 22+, npm, terminal moderne Unicode ; aucune police Nerd Font ni configuration spéciale requise), terminologie, lien corrigé vers « fonctionnement des exercices », orientation étudiante renforcée.
3. **challenges.md** — section frontmatter « Challenges » → « Exercices », titre « Travailler sur un exercice », terminologie partout, liens croisés vers notions.
4. **cli.md** — mention alias `dojo`, token affiché une seule fois, terminologie, lien configuration valide.
5. **security.md** — harmonisation terminologique légère.

## Vérifications finales

- Grep : zéro occurrence de « challenge »/« défi » dans la prose de docs/content (hors slug technique).
- Validation croisée : tous les liens internes `/docs/<slug>/` pointent vers un fichier existant.
- Tests : `node --loader ts-node/esm bin/test.ts tests/unit/documentation_service.spec.ts` + spec fonctionnelle docs.

## Hors périmètre (signalé)

- UI utilise encore « challenge/défi » par endroits (`inertia/pages/about.tsx`) → passe séparée recommandée pour alignement avec CONTEXT.md.
