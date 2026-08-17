# Audit UI/UX et architecture des composants

## Contexte

L’interface mélange actuellement trois niveaux de chrome applicatif (`BaseLayout`, `ExerciseLayout`, `AdminLayout`) avec des variantes de navigation injectées directement depuis certaines pages. Le résultat est fonctionnel mais difficile à maintenir : une même intention visuelle est parfois implémentée plusieurs fois avec des classes et des couleurs différentes.

## Constats principaux

| Zone | Constat | Risque |
|---|---|---|
| Navigation principale | `BaseLayout` rend automatiquement `Header`, tandis que `exercise.tsx` rend directement un autre `Header` dans `ExerciseLayout`. `about.tsx` détourne aussi `headerProps.centerContent` pour fabriquer un header spécial. | Deux navbars dans l’atelier et contrats de layout difficiles à comprendre. |
| Layouts | `AdminLayout` enveloppe `BaseLayout`, ce qui lui fait hériter du header et du footer publics. `ExerciseLayout` possède son propre shell mais ne possède pas de primitive de chrome partagée. | Responsabilités imbriquées, espacements dupliqués, difficulté à créer de nouvelles zones de travail. |
| Authentification | `AuthCard` existe et est réutilisable, mais les pages password et vérification reconstruisent des cartes, overlays, headers et états visuels similaires. | Divergence visuelle et corrections répétées. |
| À propos | La page utilise un corps sombre avec `text-white`, `text-gray-300`, `bg-white/10` et un `centerContent` de header ad hoc, alors que le design system fournit déjà `surface`, `display-heading`, `eyebrow` et les couleurs sémantiques. | Outlier visuel et absence de contrat de page commun. |
| Atelier | La page et `resize_panel` répètent le thème sombre, les couleurs accent et les boutons de l’éditeur. | Couleurs difficiles à changer et composants fortement couplés à une page. |
| Couleurs | Plusieurs valeurs hexadécimales sont dispersées : `#11182B`, `#17203A`, `#0D1425`, `#202A47`, `#86E3C0`, `#F4D35E`, etc. | Incohérences et impossibilité de faire évoluer le thème proprement. |
| UI primitives | Des composants shadcn existent, mais de nombreux boutons, badges, états vides, champs et cartes restent construits localement. `profile/show.tsx` contient même son propre helper `cn`. | Duplication et non-respect strict du design system. |
| Code métier/UI | `~/lib/lib.ts` mélange `cn` et `executeCode`; `exercise.tsx` importe directement le runner avec une logique de chargement dynamique. | Responsabilités mélangées et tests plus difficiles. |
| Erreurs | Les pages 404 et 500 n’utilisent aucun layout ou composant partagé et restent en anglais. | Rupture de langue, de navigation et d’accessibilité. |
| Responsive | La navigation mobile est intégrée au header public mais aucun contrat équivalent n’existe pour l’atelier ou l’administration. | Expériences différentes selon la zone de l’application. |

## Architecture cible

L’application doit distinguer le **chrome applicatif** du contenu de page :

1. `AppShell` fournit les préoccupations transversales : thème, notifications, progression Inertia, accessibilité et animation de page.
2. `PublicLayout` compose `AppShell`, `SiteHeader`, contenu principal et `SiteFooter`.
3. `WorkspaceLayout` compose `AppShell`, `WorkspaceHeader`, contenu plein écran et `ErrorBoundary`, sans footer et sans header public.
4. `AdminLayout` compose `AppShell`, `SiteHeader` en variante admin si nécessaire, `AdminSidebar` et le contenu admin. La sidebar doit être un composant autonome avec navigation active.
5. `SiteHeader` est le seul composant de navigation public. Ses variations sont explicites (`showNav`, `variant`, `leading`, `center`, `trailing`) et ne doivent pas être fabriquées dans les pages.
6. `WorkspaceHeader` est le seul header de l’atelier. Il réutilise les primitives `Button`, `Badge` et les tokens du thème sombre, mais ne réutilise pas le header public par composition accidentelle.
7. Les pages utilisent des primitives partagées : `PageHeader`, `PageSection`, `Surface`, `EmptyState`, `StatusBadge`, `ConfirmDialog` et `FlashBanner`.
8. Les couleurs métier et atelier sont exposées par des tokens CSS sémantiques, jamais par des hexadécimales dans les pages.
9. Les pages ne contiennent que l’orchestration et les données propres à leur route. Les règles d’affichage et les variantes visuelles vivent dans les composants.

## Priorités de refactor

La première modification doit supprimer le double `Header` de l’atelier sans changer son comportement fonctionnel. La deuxième doit extraire le chrome commun et les tokens. La troisième doit migrer les pages atypiques (`about`, password, erreurs et profil) vers les primitives existantes ou nouvelles. Chaque étape doit être vérifiée par un build et une revue des imports afin de garantir qu’aucun composant de navigation parallèle ne réapparaît.
