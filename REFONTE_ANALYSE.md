# Analyse de référence et de l’application

## Références visuelles

### Wispr Flow

La page de Wispr Flow repose sur une direction artistique éditoriale et expressive : fond crème très clair, texte noir à fort contraste, typographie serif distinctive pour le message héros, navigation minimale et CTA très visible. Le storytelling commence par une promesse courte et mémorable, puis montre le produit en action avec des exemples avant/après et des blocs démonstratifs. La page alterne de grands espaces respirants, des surfaces noires ou très foncées pour les preuves sociales, des logos clients et des sections qui expliquent progressivement le bénéfice. Les effets graphiques sont organiques et servent la démonstration plutôt qu’une décoration gratuite.

Patterns à retenir : promesse orientée résultat, CTA unique et répété, preuve par exemple concret, avant/après, section “comment ça marche”, variations de ton, et séparation nette entre marketing et interaction produit. Les contrôles visibles sont simples, avec un état hover/focus suffisamment lisible.

### Codecademy – Code Challenges

La page Codecademy utilise une composition de catalogue très fonctionnelle : hero court avec titre, description et panneau d’accès Pro ; filtre de langage placé immédiatement avant la grille ; cartes homogènes avec catégorie, titre, niveau et langage. Le fond légèrement coloré et le motif discret donnent une identité sans nuire à la lisibilité. La grille transforme un grand volume d’exercices en unités scannables, tandis que les métadonnées structurent la prise de décision.

Patterns à retenir : hiérarchie titre > description > filtres > grille, cartes de taille régulière, métadonnées compactes, labels de niveau, accès premium explicite et forte densité contrôlée. Le design favorise la progression et la recherche rapide plutôt qu’un effet spectaculaire.

## Structure actuelle de l’application

L’application est un monorepo AdonisJS 7 + Inertia React + TypeScript + Tailwind CSS. Les pages principales sont `/` (landing publique), `/home` (dashboard authentifié), `/exercises/:id` (éditeur de challenge), `/about` et les pages d’authentification. Les contrôleurs serveur alimentent la landing, le dashboard avec `progressExercises` et `users`, ainsi que l’exercice avec son `id`, `number`, `title`, `description` et son code initial.

Le layout général `BaseLayout` applique un thème sombre par défaut, un header sticky, un wrapper central, des transitions Framer Motion et un footer. Le dashboard affiche une grille paginée de `ExerciseCard` et un leaderboard dans une sidebar. Les cartes ont quatre états fonctionnels : verrouillée, accessible, complétée et actionnable. L’éditeur est une expérience plein écran composée d’un header compact, d’un panneau Monaco pour le code, d’une sortie console, d’une description et d’une barre d’actions `Tester` / `Valider`. Le code est synchronisé dans `localStorage` et sur le serveur avec debounce ; l’exécution et la validation affichent leur résultat dans la console.

## Principes de refonte retenus

1. Conserver tous les contrats de données et toutes les routes existantes.
2. Séparer visuellement le marketing public, le catalogue d’apprentissage et l’atelier d’exécution.
3. Remplacer le dark glassmorphism omniprésent par une identité plus éditoriale et plus lisible, inspirée de Wispr Flow, avec accents cobalt/menthe/jaune utilisés avec parcimonie.
4. Emprunter à Codecademy la structure de catalogue, les filtres et les métadonnées compactes.
5. Donner à l’éditeur une hiérarchie plus claire : contexte du défi, code, résultat, description et actions persistantes.
6. Respecter les guidelines Vercel : HTML sémantique, focus-visible, labels et aria-labels, `aria-live` pour les résultats, boutons pour les actions, liens pour la navigation, `prefers-reduced-motion`, transitions ciblées et traitement des états vides.

## Sources

[1]: https://wisprflow.ai/ "Wispr Flow"
[2]: https://www.codecademy.com/code-challenges "Codecademy Code Challenges"
[3]: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md "Vercel Web Interface Guidelines"
