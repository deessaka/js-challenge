# Codojo CLI

Le client terminal officiel de [Codojo](https://codojo.ekodevs.com), le dojo d’entraînement aux katas JavaScript.

Il propose une interface interactive à onglets avec éditeur intégré, ainsi que des commandes directes adaptées aux scripts. Les commandes `codojo` et `dojo` sont équivalentes.

## Prérequis et installation

- Node.js 22 ou version ultérieure
- un compte Codojo et un token API pour accéder aux exercices

```bash
npm install --global @codojo/cli
codojo login
codojo
```

## Interface interactive

Lancez `codojo` ou `dojo` sans argument. La TUI ouvre cinq vues accessibles avec les touches numériques :

- `1` — liste des défis, recherche et filtres ;
- `2` — consignes du défi sélectionné ;
- `3` — éditeur de code JavaScript intégré ;
- `4` — résultats des tests, logs et mode watch ;
- `?` — aide des raccourcis.

Raccourcis principaux :

- `↑` / `↓` ou `j` / `k` : sélectionner un défi ;
- `/` : rechercher, `f` : changer de filtre ;
- `Entrée` : ouvrir les consignes ou l’éditeur ;
- `Ctrl+T` dans l’éditeur : lancer un test non persistant ;
- `Ctrl+S` dans l’éditeur : sauvegarder durablement sans soumettre ;
- `Ctrl+Entrée` dans l’éditeur : sauvegarder puis soumettre officiellement ;
- `w` : activer ou désactiver le test automatique du fichier local ;
- `Échap` : revenir à la vue précédente ;
- `Ctrl+Q` ou `Ctrl+C` : quitter proprement.

L’éditeur accepte la saisie Unicode, les caractères AltGr et les compositions IME fournies par le terminal. Le support IME reste expérimental. Le collage identifiable est désactivé : son contenu est ignoré et la vue affiche une explication. Sur un terminal legacy qui transmet un collage comme des frappes ordinaires, Codojo ne peut pas le distinguer de la saisie rapide sans dégrader AltGr ou les IME.

Au démarrage, l’en-tête indique l’API utilisée. La configuration publiée par défaut affiche `LIVE · codojo.ekodevs.com`.

## Commandes directes

```text
codojo login [token]             Enregistre un token API
codojo login --no-browser        N’ouvre pas automatiquement le profil Web
codojo logout                    Supprime le token local
codojo list                      Liste les exercices disponibles
codojo next                      Affiche le prochain exercice
codojo start <slug> [--no-edit]  Crée le fichier d’exercice localement
codojo submit <slug> [code.js]   Soumet et teste le code
codojo dashboard                 Affiche l’URL du tableau de bord
codojo version                   Affiche la version installée
codojo help                      Affiche l’aide complète
```

`list`, `next`, `start` et `submit` nécessitent une authentification préalable.

## Authentification et configuration

`codojo login` ouvre le profil Codojo dans le navigateur, puis demande le token généré dans la section **Utiliser Codojo dans le terminal**. Le token n’est affiché qu’une fois lors de sa création.

La configuration est enregistrée avec des permissions strictes dans :

```text
${XDG_CONFIG_HOME:-~/.config}/codojo/config.json
```

Pour cibler une autre instance de l’API :

```bash
export CODOJO_API_URL=http://localhost:3333
```

L’ancienne variable `JS_CHALLENGE_API_URL` reste acceptée pour compatibilité. La TUI respecte également `NO_COLOR=1`.

## Développement

Depuis le dossier `cli/` :

```bash
npm install
npm test
npm link
```

## Licence

[MIT](LICENSE)
