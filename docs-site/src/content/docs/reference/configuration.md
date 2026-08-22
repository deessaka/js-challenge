---
title: Configuration
description: Configurer l’API et les préférences locales utilisées par Codojo.
---

## URL de l’API

La CLI utilise par défaut l’API de production Codojo. Pour cibler une autre instance, définissez :

```bash
export CODOJO_API_URL=http://localhost:3333
```

L’ancienne variable `JS_CHALLENGE_API_URL` reste acceptée pour compatibilité, mais les nouvelles installations doivent utiliser `CODOJO_API_URL`.

## Fichier local

Les credentials sont stockés dans :

```text
${XDG_CONFIG_HOME:-~/.config}/codojo/config.json
```

Le fichier contient notamment l’URL API et le token local. Protégez-le comme un secret et évitez de synchroniser votre dossier de configuration dans un dépôt public.

## Environnement de développement

Pour développer la CLI contre une instance locale :

```bash
CODOJO_API_URL=http://localhost:3333 codojo
```

L’application Web et l’API doivent être démarrées séparément selon les instructions du dépôt. Les données de production ne doivent pas être utilisées pour tester du code expérimental.

## Notification de mise à jour

La vérification automatique peut être désactivée avec :

```bash
CODOJO_NO_UPDATE_CHECK=1 codojo
```

Les environnements CI sont également ignorés afin de ne pas ajouter de requêtes réseau ni de sortie inattendue aux pipelines.
