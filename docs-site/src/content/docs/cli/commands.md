---
title: Commandes CLI
description: Référence rapide des commandes Codojo disponibles dans le terminal.
---

Les commandes `codojo` et `dojo` sont équivalentes. Lancez `codojo help` pour afficher l’aide directement dans votre terminal.

| Commande                         | Usage                                                             |
| -------------------------------- | ----------------------------------------------------------------- |
| `codojo`                         | Lance l’interface interactive TUI.                                |
| `codojo login [token]`           | Enregistre un token API ; ouvre le profil sans token fourni.      |
| `codojo login --no-browser`      | Se connecte sans ouvrir automatiquement le navigateur.            |
| `codojo logout`                  | Supprime le token local.                                          |
| `codojo list`                    | Liste les challenges et leur état.                                |
| `codojo next`                    | Affiche le prochain challenge recommandé.                         |
| `codojo start <slug>`            | Ouvre directement l’éditeur sur un challenge.                     |
| `codojo submit <slug> [code.js]` | Soumet le code du fichier fourni ou de l’espace de travail local. |
| `codojo export <slug>`           | Imprime le document de travail local du challenge.                |
| `codojo dashboard`               | Affiche le lien vers le tableau de bord Web.                      |
| `codojo version`                 | Affiche la version installée.                                     |

| `codojo help` | Affiche l’aide complète. |

Les commandes `list`, `next`, `start`, `submit` et `export` nécessitent une authentification préalable. Consultez [la page de configuration](/reference/configuration/) pour modifier l’URL de l’API.

> La commande intégrée `codojo update` est documentée dans [Mise à jour](/cli/update/) et sera disponible dès que la version CLI qui la contient sera publiée. Pour la version actuellement publiée, utilisez la commande NPM indiquée dans cette page.
