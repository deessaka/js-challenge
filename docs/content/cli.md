---
title: Utiliser la CLI Codojo
description: Installer et utiliser la CLI Codojo depuis votre terminal.
section: Outils
order: 20
---

# Utiliser la CLI Codojo

La CLI permet de consulter les challenges, d’ouvrir un espace de travail interactif et d’envoyer une solution sans quitter le terminal. Elle est publiée sous le paquet `@codojo/cli`.

## Installation

```bash
npm install --global @codojo/cli@latest
```

La CLI requiert Node.js 22 ou une version ultérieure. Vérifiez l’installation :

```bash
codojo version
```

## Authentification

Connectez-vous avec :

```bash
codojo login
```

La commande vous guide vers votre profil Codojo pour générer un token CLI. Le token est enregistré dans le répertoire de configuration utilisateur et ne doit jamais être ajouté au dépôt, à un ticket ou à une capture d’écran.

Pour vous déconnecter :

```bash
codojo logout
```

## Commandes utiles

| Commande                         | Utilisation                                  |
| -------------------------------- | -------------------------------------------- |
| `codojo`                         | Ouvre l’interface interactive du terminal.   |
| `codojo list`                    | Liste les challenges et leur état.           |
| `codojo next`                    | Affiche le prochain challenge recommandé.    |
| `codojo start <slug>`            | Ouvre l’éditeur sur un challenge.            |
| `codojo submit <slug> [code.js]` | Soumet un fichier ou le travail local.       |
| `codojo export <slug>`           | Imprime le travail local enregistré.         |
| `codojo dashboard`               | Affiche le lien vers le tableau de bord Web. |
| `codojo help`                    | Affiche l’aide complète.                     |

Les commandes qui lisent ou soumettent des challenges nécessitent une authentification. L’option `--api-url` permet de cibler explicitement une instance compatible lorsque cela est nécessaire.

## Travailler prudemment

N’exécutez pas une commande de soumission avec un fichier dont vous ne contrôlez pas le contenu. Vérifiez le slug et le chemin du fichier avant de l’envoyer, et évitez de placer des secrets dans les fichiers de challenge.

Pour la configuration détaillée, consultez la [référence de configuration](/docs/configuration/).
