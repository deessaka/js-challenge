---
status: accepted
---

# Construire un moteur d’édition terminal intégré

Codojo conserve l’éditeur intégré comme expérience principale sur Linux, macOS et Windows. La CLI migrera vers Ink 7 et isolera un moteur TypeScript headless, conscient des graphèmes Unicode et indépendant du rendu, afin de garantir un sous-ensemble Vim précis sans déléguer l’édition à un processus externe.

Cette décision remplace le modèle d’édition, la navigation entre vues et les raccourcis de l’ADR historique `terminal-cli-architecture.md` sans modifier ses décisions relatives à l’API et à l’authentification.

## Options considérées

- Déléguer à Vim, Neovim ou `$EDITOR` aurait fourni immédiatement la meilleure stabilité, mais aurait rompu l’expérience d’apprentissage intégrée retenue pour Codojo.
- Réécrire la TUI avec un moteur natif Rust ou Go aurait offert davantage de contrôle terminal, au prix d’une nouvelle chaîne de compilation et de distribution multiplateforme.
- Conserver Ink 5 et corriger les touches au cas par cas ne résout pas la confusion actuelle entre offsets UTF-16, graphèmes et cellules terminal, ni le collage multiligne et le curseur simulé.

## Conséquences

Le document, les commandes Vim, l’historique et le viewport deviennent des modules testables sans React. Ink reste la couche d’application et de rendu, avec un propriétaire unique des entrées, un curseur terminal réel, un canal de collage distinct et un écran alternatif configurable. La refonte sera publiée sous le tag npm `next` avant promotion en version stable après validation automatisée et manuelle sur les trois plateformes.
