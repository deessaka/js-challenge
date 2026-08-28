---
status: accepted
---

# Contrats déclaratifs et évaluateurs versionnés

Le contrat actif d’un exercice est une version persistée dans `exercise_contract_versions`. Il décrit l’interface de la fonction, les exemples, les cas limites, la famille d’évaluation, les opérateurs autorisés et la génération de cas. Une modification crée une nouvelle version brouillon ; la version publiée reste active jusqu’à la publication atomique d’une version entièrement validée.

Pour les familles DSL supportées, le serveur compile ce document en starter et en cas de test. Le compilateur repose sur une liste fermée d’opérateurs et de fonctions connues : le portail Web ne reçoit ni ne stocke de JavaScript de test administrateur. Le hash du document est conservé avec chaque version pour détecter une altération.

La publication vérifie la forme du contrat, la compilation, les exemples, les cas limites et les cas générés reproductibles. Elle refuse un contrat incomplet, une entrée invalide, une incohérence de référence ou des cas incapables de distinguer une solution constante.

Les évaluations hors DSL font référence à un évaluateur complexe identifié par un couple `id`/`version`. Cet évaluateur et ses tests vivent dans le dépôt et sont revus comme du code. Le portail peut le sélectionner et le configurer, mais ne peut pas écrire son JavaScript.

Pendant la migration, les exercices sans version de contrat publiée utilisent encore leur fichier de test Git existant. Cette compatibilité est transitoire ; un test ou un contrat indisponible est une erreur d’exercice et ne doit jamais être enregistré comme un échec de solution utilisateur.
