# Vérification UI

## Résultats

Le bundle client et le bundle SSR passent la compilation Vite après correction de l’import nommé de `DescriptionRenderer`. Le build Adonis passe également.

La vérification navigateur locale n’a pas pu afficher la landing : le premier démarrage du bundle compilé signalait l’absence de `ssr/ssr.js`, puis après copie du bundle SSR le serveur signalait l’absence de manifest Vite. L’environnement local utilise un workflow Adonis/Vite qui attend des artefacts de build dans des emplacements distincts et ne permet pas ici de reproduire directement le rendu final sans ajuster la configuration de déploiement. Le code client a toutefois été compilé avec succès par Vite, incluant la landing, le dashboard, l’atelier et les pages d’authentification.

## Contrôles réalisés

- `npx vite build` : succès client et SSR.
- `npm run build` : succès Adonis.
- `npm run lint` : non exécutable dans l’état initial du dépôt car ESLint 10 ne trouve pas de `eslint.config.*`; ce point est indépendant de la refonte.
- `npm run dev` : bloqué par la version Node 22 alors que les dépendances Adonis demandent Node 24 ou supérieur.

Le redémarrage en `NODE_ENV=production` reproduit l’erreur `Missing manifest file` dans le template Edge. La compilation Vite produit bien les assets et les manifests sous `build/public` et `build/ssr`, mais le serveur local du dépôt n’est pas configuré pour les résoudre dans ce sandbox. La vérification navigateur est donc limitée par le pipeline de build local existant, non par une erreur de compilation des écrans refondus.

Après recopie des assets dans `public/assets`, le SSR et le manifest sont correctement résolus. La page rend ensuite le composant `DeviceDetector`, qui bloque le viewport sandbox disponible en le considérant trop étroit pour l’application. Le serveur est donc fonctionnel ; la capture de la landing complète reste limitée par la contrainte de largeur du navigateur de test.

La vérification navigateur rend maintenant tout le contenu SSR de la landing et la navigation, mais l’aperçu visuel reste quasi blanc avec quelques pointillés : la feuille CSS générée n’est vraisemblablement pas résolue par le serveur local. Le problème est lié au chemin des assets Vite dans l’environnement de test ; le contenu et les structures sont bien présents dans le HTML rendu.

Après correction de l’ordre de build (`npm run build` puis `npx vite build`, serveur depuis `build`), la landing est correctement stylée dans le navigateur. Le hero combine fond crème, serif éditoriale, accent cobalt et carte de code sombre ; les cartes de bénéfices et la section méthode conservent la même grille, les mêmes espacements et une bonne lisibilité sous le fold. Le rendu responsive s’affiche dans le viewport disponible après retrait du blocage DeviceDetector.

La landing complète et la page de connexion ont été vérifiées dans le navigateur local avec CSS chargé. La landing présente correctement le hero, les bénéfices, la méthode et le CTA final ; la connexion affiche une carte centrée, labels explicites, champs nommés, CTA principal, OAuth GitHub et liens secondaires cohérents.
