# JS Challenge — Extension VS Code

Cette extension constitue le MVP du client VS Code de JS Challenge. Elle consomme l’API `/api/v1` existante et laisse le dashboard Web responsable des statistiques détaillées, du profil et de l’administration.

## Fonctionnalités du MVP

L’extension affiche les challenges dans une TreeView, permet de se connecter avec un token API, ouvre un fichier local depuis le `starterCode`, conserve le challenge actif dans l’état du workspace et soumet le contenu de l’éditeur à `POST /api/v1/submissions`.

La commande de soumission affiche les résultats serveur dans un Output Channel. Le serveur reste la seule source de vérité pour la validation et la progression.

## Installation locale

```bash
cd vscode-extension
npm install
npm run compile
```

Dans VS Code, ouvrir le dossier `vscode-extension`, lancer l’extension en mode développement avec `F5`, puis exécuter `JS Challenge: Se connecter`.

Le MVP demande temporairement un token API via une boîte de dialogue et le stocke dans `SecretStorage`. Ce mécanisme est volontairement provisoire. Avant publication publique, il devra être remplacé par un callback navigateur avec OAuth 2.0 + PKCE.

## Configuration

```json
{
  "jsChallenge.apiBaseUrl": "http://localhost:3333",
  "jsChallenge.dashboardUrl": "http://localhost:3333/home"
}
```

## Commandes

| Commande | Fonction |
|---|---|
| `JS Challenge: Se connecter` | Stocker et vérifier un token API. |
| `JS Challenge: Se déconnecter` | Supprimer le token de `SecretStorage`. |
| `JS Challenge: Actualiser les challenges` | Recharger le catalogue depuis l’API. |
| `JS Challenge: Ouvrir le challenge` | Créer ou ouvrir le fichier `.js` du challenge sélectionné. |
| `JS Challenge: Soumettre la solution` | Envoyer le code courant à l’API et afficher le résultat serveur. |
| `JS Challenge: Ouvrir le dashboard` | Ouvrir le dashboard Web dans le navigateur. |

## Limites connues

Le MVP ne contient pas encore de callback de connexion navigateur, de test local, de cache offline, de queue côté serveur ou de packaging Marketplace. L’exécution et la validation utilisent l’endpoint de soumission synchrone actuel, qui sera remplacé par un worker lorsque l’infrastructure d’exécution sera introduite.
