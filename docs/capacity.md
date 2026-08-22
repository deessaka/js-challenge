# Capacité et tests de charge

## Objectif

Codojo distingue le trafic HTTP classique des exécutions de code utilisateur. Les pages et endpoints peuvent continuer à servir des utilisateurs pendant qu’un plafond séparé protège la ressource la plus coûteuse : les isolates `isolated-vm` utilisés par les soumissions.

## Protection d’exécution

Chaque instance du serveur utilise `CODE_EXECUTION_CONCURRENCY`. La valeur par défaut est `2`, ce qui est volontairement conservateur pour une instance disposant de 512 Mo de mémoire. Une requête qui arrive lorsque le plafond est atteint reçoit une réponse `429` avec un en-tête `Retry-After: 2`, au lieu de créer un nouvel isolate et de risquer une saturation mémoire.

Cette limite est locale à chaque processus. Si plusieurs instances sont déployées, la capacité totale est la somme des limites locales, mais la base de données, Redis et le coût CPU doivent être validés séparément. Cette protection ne constitue pas une file de travaux distribuée ; si les exécutions doivent être garanties plutôt que refusées temporairement, il faudra introduire un worker et une file partagée dans un chantier ultérieur.

## Réglages opérationnels

| Paramètre                     |               Valeur par défaut | Rôle                                                              |
| ----------------------------- | ------------------------------: | ----------------------------------------------------------------- |
| `CODE_EXECUTION_CONCURRENCY`  |                             `2` | Nombre maximal de soumissions/exécutions simultanées par instance |
| `DB_POOL_MIN`                 |                             `1` | Nombre minimal de connexions PostgreSQL par processus             |
| `DB_POOL_MAX`                 | `10` en production, `1` en test | Nombre maximal de connexions PostgreSQL par processus             |
| Timeout d’un isolate          |                       `5000 ms` | Durée maximale d’exécution du code utilisateur                    |
| Mémoire maximale d’un isolate |                        `128 MB` | Limite `isolated-vm` par exécution                                |

Les valeurs du pool doivent être ajustées en tenant compte du nombre d’instances : le nombre total de connexions potentielles est approximativement `DB_POOL_MAX × nombre_d_instances`, sans dépasser la capacité de PostgreSQL.

## Test local sûr

Le script de charge refuse par défaut les URLs distantes. Pour tester un serveur local sur le endpoint de santé pendant 30 secondes avec 500 workers virtuels, exécuter :

```bash
LOAD_TEST_CONFIRM=local \
LOAD_URL=http://127.0.0.1:3333/health \
LOAD_CONCURRENCY=500 \
npm run load:test
```

Le script affiche le nombre de réponses par statut, le débit, la latence moyenne et la latence maximale. Une cible distante exige la valeur de confirmation distincte `LOAD_TEST_CONFIRM=explicit-remote` et ne doit être utilisée qu’après validation explicite d’un environnement de staging dédié.

## Limite de validation

Un test local ne permet pas de certifier la capacité de Render. La validation finale doit utiliser un staging proche de la production, des données synthétiques et des métriques CPU, mémoire, connexions PostgreSQL, connexions Redis, latence et taux d’erreur. Le plan Render gratuit est limité à une seule instance web et ne dispose pas des fonctions de scaling horizontal ; il ne doit donc pas être considéré comme la cible finale pour 500 utilisateurs simultanés.

Pour les références d’hébergement, consulter la [documentation Render sur les instances gratuites](https://render.com/docs/free), la [documentation du pooling PostgreSQL](https://render.com/docs/postgresql-connection-pooling) et la [documentation Render Key Value](https://render.com/docs/key-value).
