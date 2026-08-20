---
status: accepted
---

# Construire un moteur d’édition terminal intégré

Codojo conserve l’éditeur intégré comme expérience principale sur Linux, macOS et Windows. La CLI migrera vers Ink 7 et isolera un moteur TypeScript headless, conscient des graphèmes Unicode et indépendant du rendu, afin de garantir un sous-ensemble Vim précis sans déléguer l’édition à un processus externe.

Cette décision remplace le modèle d’édition, la navigation entre vues et les raccourcis de l’ADR historique `terminal-cli-architecture.md` sans modifier ses décisions relatives à l’API et à l’authentification.

## Options considérées

- Déléguer à Vim, Neovim ou `$EDITOR` aurait fourni immédiatement la meilleure stabilité, mais aurait rompu l’expérience d’apprentissage intégrée retenue pour Codojo.
- Réécrire la TUI avec un moteur natif Rust ou Go aurait offert davantage de contrôle terminal, au prix d’une nouvelle chaîne de compilation et de distribution multiplateforme.
- Conserver Ink 5 et corriger les touches au cas par cas ne résout pas la confusion actuelle entre offsets UTF-16, graphèmes et cellules terminal, ni la distinction fiable entre saisie et collage ou le curseur simulé.

## Conséquences

Le document, les commandes Vim, l’historique et le viewport deviennent des modules testables sans React. Ink reste la couche d’application et de rendu, avec un propriétaire unique des entrées, un curseur terminal réel, un canal de collage distinct et refusé, et un écran alternatif configurable. La refonte sera publiée sous le tag npm `next` avant promotion en version stable après validation automatisée et manuelle sur les trois plateformes.

## Amendement du 20 août 2026 — Refuser le collage

L’éditeur intégré intercepte le canal de collage identifiable fourni par Ink et refuse son contenu sans modifier le document ni son historique. La vue affiche immédiatement que le collage est désactivé. La saisie Unicode, AltGr et les compositions IME restent des entrées autorisées.

Ce refus est garanti lorsque le terminal expose le collage encadré. Dans un protocole legacy qui transmet un collage comme une suite de frappes ordinaires, le distinguer sans bloquer aussi la saisie rapide ou une composition IME est impossible ; Codojo privilégie alors la saisie correcte et documente cette limite.
