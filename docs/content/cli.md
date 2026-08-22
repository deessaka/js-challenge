---
title: Utiliser la CLI Codojo
description: Installer et utiliser la CLI Codojo depuis votre terminal — commandes, authentification et flux de travail.
section: Outils
order: 20
---

# Utiliser la CLI Codojo

La CLI permet de consulter les exercices, d’ouvrir un espace de travail interactif et d’envoyer une solution sans quitter le terminal. Elle est publiée sous le paquet `@codojo/cli`. Les commandes `codojo` et `dojo` sont équivalentes.

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

La commande ouvre votre profil Codojo dans le navigateur. Générez un token dans la section **Utiliser Codojo dans le terminal** : il n’est affiché qu’une seule fois, copiez-le dès sa création. La CLI l’enregistre dans votre répertoire de configuration utilisateur (voir [Configurer la CLI](/docs/configuration/)).

Pour vous déconnecter :

```bash
codojo logout
```

## Commandes utiles

| Commande                         | Utilisation                                  |
| -------------------------------- | -------------------------------------------- |
| `codojo`                         | Ouvre l’interface interactive du terminal.   |
| `codojo list`                    | Liste les exercices et leur état.            |
| `codojo next`                    | Affiche le prochain exercice recommandé.     |
| `codojo start <slug>`            | Ouvre l’éditeur sur un exercice.             |
| `codojo submit <slug> [code.js]` | Soumet un fichier ou le travail local.       |
| `codojo export <slug>`           | Imprime le travail local enregistré.         |
| `codojo dashboard`               | Affiche le lien vers le tableau de bord Web. |
| `codojo help`                    | Affiche l’aide complète.                     |

Les commandes qui lisent ou soumettent des exercices nécessitent une authentification. L’option `--api-url` permet de cibler explicitement une instance compatible lorsque cela est nécessaire — la priorité complète des sources d’URL est décrite dans [la configuration](/docs/configuration/#priorite-des-sources-d-url).

## Travailler prudemment

N’exécutez pas une commande de soumission avec un fichier dont vous ne contrôlez pas le contenu. Vérifiez le slug et le chemin du fichier avant de l’envoyer, et évitez de placer des secrets dans les fichiers d’exercice.

## Pour aller plus loin

- [Configurer la CLI](/docs/configuration/) — fichier de configuration, token et variables d’environnement.
- [Soumettre une solution](/docs/submitting/) — ce que fait la validation officielle.
- [Sécurité et bonnes pratiques](/docs/security/) — protéger compte et token.
