# Architecture cible UI/UX

## Principe directeur

Les pages orchestrent les données et les actions métier. Les layouts possèdent le chrome de leur zone. Les composants de présentation possèdent les variantes visuelles. Aucun écran ne doit reconstruire une navigation, une carte, un état vide ou une boîte de confirmation déjà disponible dans le design system.

## Composition des shells

| Composant | Responsabilité | Ne doit pas faire |
|---|---|---|
| `AppShell` | Thème, détection d’appareil, notifications, progression Inertia, skip link et animation de navigation. | Décider de la navigation ou des espacements propres à une page. |
| `BaseLayout` | Shell public : `SiteHeader`, conteneur de contenu, `SiteFooter`. | Être utilisé comme conteneur implicite par un layout qui a déjà son propre système de largeur/padding. |
| `WorkspaceLayout` | Shell plein écran sombre pour l’atelier, `ErrorBoundary` et contenu sans footer. | Rendre le header public. |
| `AdminLayout` | Shell d’administration, `AdminSidebar`, en-tête de page et messages flash. | Réimplémenter les primitives de navigation ou de table. |
| `SiteHeader` | Navigation marketing/authentifiée, menu mobile, actions de session et thème. | Connaître le contenu d’une page particulière. |
| `WorkspaceHeader` | Header sombre de l’atelier avec slot leading/trailing et menu utilisateur. | Afficher les liens publics ou une seconde navigation. |

## Primitives de présentation

Les composants suivants doivent être utilisés avant toute nouvelle classe locale :

- `PageHeader` pour les titres de page, eyebrow, description et actions.
- `PageSection` pour les sections verticales avec titre et espacement cohérent.
- `EmptyState` pour les tableaux, listes et statistiques sans données.
- `FlashBanner` pour les messages success/error, avec les composants shadcn concernés.
- `StatusBadge` pour les états utilisateur, exercice et synchronisation.
- `ConfirmDialog` pour les actions destructives ou irréversibles.
- `Surface` ou `Card` pour les conteneurs visuels, jamais un nouveau rectangle avec ses propres couleurs.

## Tokens

Les couleurs de l’atelier sont exposées par des tokens sémantiques (`--workspace-background`, `--workspace-panel`, `--workspace-editor`, `--workspace-accent`, `--workspace-warning`). Les composants utilisent les classes Tailwind générées depuis ces tokens. Les valeurs hexadécimales ne doivent plus apparaître dans les pages ou composants métier.

## Règles d’implémentation

1. Un composant de navigation ne doit être importé que par son layout ou par un composant de navigation parent.
2. Les pages ne rendent pas directement `Header`, `Footer`, `ThemeProvider`, `DeviceDetector` ou les primitives transversales du shell.
3. Les composants utilisent `cn` depuis `~/lib/utils`; aucun helper `cn` local n’est autorisé.
4. Les composants shadcn (`Button`, `Input`, `Label`, `Badge`, `Card`, `Dialog`, `AlertDialog`, `Table`, `Tabs`, `Select`, `Sheet`, `Tooltip`, `Skeleton`, `Sonner`) sont les seules bases d’interaction et de conteneur lorsque leur primitive existe.
5. Toute variante est exprimée par une prop ou une variante CVA, pas par une copie complète du composant.
6. Les textes utilisateur restent en français, y compris les pages d’erreur.
7. Chaque changement de shell doit être validé par le build, une vérification des imports de navigation et un smoke test des routes publiques, authentifiées et admin.
