# Codojo CLI

Le client terminal officiel de [Codojo](https://codojo.ekodevs.com), le dojo d’entraînement aux katas JavaScript.

Il propose cinq vues terminal exclusives avec un éditeur intégré, ainsi que des commandes directes adaptées aux scripts. Les commandes `codojo` et `dojo` sont équivalentes.

## Prérequis et installation

- Node.js 22 ou version ultérieure
- un compte Codojo et un token API pour accéder aux exercices

```bash
npm install --global @codojo/cli
codojo login
codojo
```

## Interface interactive

Lancez `codojo` ou `dojo` sans argument. La TUI ouvre cinq vues terminal :

- `Ctrl+1` — catalogue public, recherche et filtres ;
- `Ctrl+2` — consignes de l’exercice sélectionné ;
- `Ctrl+3` — éditeur de code JavaScript intégré ;
- `Ctrl+4` — résultats détaillés des tests et logs ;
- `?` — aide des raccourcis.

Raccourcis principaux :

- `↑` / `↓` ou `j` / `k` : sélectionner un exercice ;
- `/` ou `Ctrl+F` : rechercher, `f` : changer de filtre ;
- `Entrée` : ouvrir les consignes ou l’éditeur ;
- `Ctrl+T` dans l’éditeur : lancer un test non persistant ;
- `Ctrl+S` dans l’éditeur : sauvegarder durablement sans soumettre ;
- `Ctrl+Entrée` dans l’éditeur : sauvegarder puis soumettre officiellement ;
- `Échap` : revenir à la vue précédente ;
- `Ctrl+Q` ou `Ctrl+C` : quitter proprement.

L’éditeur accepte la saisie Unicode, les caractères AltGr et les compositions IME fournies par le terminal. Son Mode Normal prend en charge `h/j/k/l`, les flèches, `w/b`, `0/$`, `gg/G`, `gj/gk`, `i/I/a/A/o/O`, `x/r`, `dd/dw/d$`, `cc/cw/c$`, `u`, `Ctrl+R` et `Échap`.

Les lignes longues sont wrappées selon les cellules du terminal sans modifier la solution. `j/k` suivent les lignes logiques ; les flèches et `gj/gk` suivent les lignes visuelles. Le curseur reste attaché à sa position logique après un redimensionnement.

Chaque modification est sauvegardée atomiquement. Si une récupération plus récente existe après une interruption, Codojo demande explicitement de la restaurer, de l’inspecter ou de l’ignorer avant de modifier le fichier principal.

Le collage identifiable est désactivé : son contenu est ignoré et la vue affiche une explication. Sur un terminal legacy qui transmet un collage comme des frappes ordinaires, Codojo ne peut pas le distinguer de la saisie rapide sans dégrader AltGr ou les IME. Le support IME reste expérimental.

Au démarrage, l’en-tête indique l’API utilisée. La configuration publiée par défaut affiche `LIVE · codojo.ekodevs.com`.

## Commandes directes

```text
codojo login [token]             Enregistre un token API
codojo login --no-browser        N’ouvre pas automatiquement le profil Web
codojo logout                    Supprime le token local
codojo list                      Liste les exercices disponibles
codojo next                      Affiche le prochain exercice
codojo start <slug>              Crée le fichier d’exercice localement
codojo submit <slug> [code.js]   Soumet et teste le code
codojo dashboard                 Affiche l’URL du tableau de bord
codojo update                    Met à jour l’installation globale depuis NPM
codojo update --tag beta         Installe la dernière version du canal bêta
codojo version                   Affiche la version installée
codojo help                      Affiche l’aide complète
```

`list`, `next`, `start` et `submit` nécessitent une authentification préalable.

## Authentification et configuration

`codojo login` ouvre le profil Codojo dans le navigateur, puis demande le token généré dans la section **Utiliser Codojo dans le terminal**. Le token n’est affiché qu’une fois lors de sa création.

La CLI vérifie discrètement, en arrière-plan, si une version plus récente est disponible sur le registre NPM configuré. Cette vérification ne bloque pas la commande principale, est mise en cache et est ignorée en environnement CI. Lorsqu’une mise à jour est disponible, la CLI affiche la version actuelle, la nouvelle version et propose `codojo update`.

Pour mettre à jour l’installation globale :

```bash
codojo update
```

La commande cible le tag stable `latest` par défaut. Pour tester la version bêta publiée sur NPM, utilisez explicitement `codojo update --tag beta`. Une installation globale peut nécessiter les permissions adaptées à votre gestionnaire Node.js ; la CLI ne tente pas d’élévation de privilèges automatique.

Pour désactiver la vérification automatique dans un script ou localement :

```bash
CODOJO_NO_UPDATE_CHECK=1 codojo
```

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
