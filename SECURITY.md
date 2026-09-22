# Politique de sécurité

## Versions supportées

Seule la dernière version déployée en production reçoit des correctifs de sécurité.

## Périmètre

Les éléments suivants sont dans le périmètre de cette politique :

- API v1 (`/api/v1/*`)
- Portail Web (authentification, gestion de compte, tokens)
- CLI `@codojo/cli` (gestion des tokens, communication avec l'API)
- Sandbox d'exécution du code (isolation des soumissions)

Sont hors périmètre :

- Les instances Codojo hébergées par des tiers
- L'infrastructure d'hébergement non gérée par l'équipe Codojo
- Les vulnérabilités dans les dépendances tierces non exploitables dans ce contexte

## Signaler une vulnérabilité

**Ne pas ouvrir une issue GitHub publique pour une vulnérabilité de sécurité.**

Envoyer un email à **contact@codojo.dev** avec :

- Une description de la vulnérabilité
- Les étapes pour la reproduire
- L'impact potentiel estimé
- Si possible, une suggestion de correction

### Ce que tu peux attendre

- Accusé de réception sous **72 heures**
- Évaluation et plan de correction sous **7 jours**
- Divulgation publique coordonnée après le correctif, avec crédit au reporter si souhaité

Nous nous engageons à traiter les rapports de sécurité de manière responsable et à ne pas engager de poursuites contre les chercheurs qui respectent cette politique de divulgation responsable.
