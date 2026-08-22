---
title: Expressions régulières
description: Valider, extraire et transformer du texte avec match, test et replace — les outils des exercices de chaînes.
section: Notions
order: 7
---

# Expressions régulières

Une expression régulière (regex) décrit un **motif** : un ensemble de chaînes qui lui correspondent. En JavaScript, elle sert à trois choses — valider une entrée, extraire des fragments, remplacer du texte — via trois méthodes : `test` (sur l’objet regex), `match` et `replace` (sur la chaîne).

## Les briques d’un motif

| Élément | Rôle | Exemple |
| --- | --- | --- |
| `\d`, `\w`, `\s` | Un chiffre, un caractère alphanumérique, un espace | `\d` correspond à `7` |
| `.` | N’importe quel caractère (sauf retour à la ligne) | — |
| `[abc]`, `[a-z]`, `[^0-9]` | Classe de caractères autorisés ou exclus | `[aeiouy]` une voyelle |
| `^`, `$` | Début et fin de chaîne | `^\d$` un seul chiffre |
| `*`, `+`, `?`, `{m,n}` | Quantificateurs : 0 ou plus, 1 ou plus, 0 ou 1, entre m et n | `\d{4}` quatre chiffres |
| `(…)`, `|` | Groupe et alternative | `(\d{4}\|\d{6})` |

## Valider avec `test`

Exercice type du catalogue : *Code PIN* (n° 11) — accepter exactement 4 ou 6 chiffres.

```js
function pinValide(pin) {
  return /^(\d{4}|\d{6})$/.test(pin)
}

pinValide('1234') // true
pinValide('12345') // false
```

Les ancres `^` et `$` sont indispensables ici. Sans elles, le motif `\d{4}` correspondrait à l’intérieur de `'12345'` et validerait à tort un code à cinq chiffres.

## Extraire avec `match`

Exercice type : *Nombre de voyelles* (n° 13).

```js
function compterVoyelles(phrase) {
  const trouvées = phrase.match(/[aeiouy]/gi)
  return trouvées ? trouvées.length : 0
}
```

Deux points d’attention : le drapeau `g` demande toutes les occurrences (sans lui, `match` s’arrête à la première), et `match` renvoie `null` quand rien ne correspond — gérez ce cas avant d’appeler `.length`.

## Remplacer avec `replace`

Exercice type : *Mettre chaque première lettre des mots en majuscule* (n° 12).

```js
function capitaliser(phrase) {
  return phrase.replace(/\b\w/g, (lettre) => lettre.toUpperCase())
}

capitaliser('bonjour le monde') // 'Bonjour Le Monde'
```

Les groupes capturants se réutilisent dans le remplacement avec `$1`, `$2`, etc. Exemple inspiré de *Numéros de téléphone* (n° 58) :

```js
function formater(chiffres) {
  return chiffres.replace(/^(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4')
}

formater('01234567') // '01 23 45 67'
```

## Les pièges classiques

- **Oublier les ancres** dans une validation : le motif peut alors correspondre au milieu d’une chaîne invalide.
- **Oublier le drapeau `g`** : `match` ne renvoie que la première occurrence.
- **Ne pas échapper les métacaractères** : pour chercher un point littéral, écrivez `\.` — un `.` seul correspond à n’importe quel caractère.
- **Confondre les rôles** : `regex.test(chaîne)` renvoie un booléen ; `chaîne.match(regex)` renvoie les correspondances.

> Une expression régulière n’est pas toujours l’outil le plus simple. Pour vérifier qu’une chaîne contient une sous-chaîne, `includes` suffit ; pour découper, pensez à `split`. Choisissez l’outil le plus lisible : votre solution doit rester compréhensible.

## Cas limites à tester avant de soumettre

- La chaîne vide.
- Les caractères accentués et spéciaux : `\w` ne couvre pas `é`, `ç` ou `-`.
- Les espaces multiples ou en début/fin de chaîne.
- Une entrée qui correspond partiellement au motif.

## Pour aller plus loin

- [Programmation fonctionnelle](/docs/functional-programming/) — combinez extraction et transformation.
- [Méthodes avancées](/docs/advanced-methods/) — vérifier une condition sur chaque correspondance.
- [Comprendre les exercices](/docs/challenges/) — états de progression et validation officielle.
