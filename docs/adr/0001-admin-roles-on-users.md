---
status: accepted
---

# Stocker le rôle administratif sur User

Les rôles `user`, `admin` et `super_admin` sont stockés directement sur `users` plutôt que dans un système de permissions séparé. Le panel V1 a peu de rôles et cette solution rend le contrôle d’accès explicite, auditable et facilement extensible sans introduire une infrastructure de permissions disproportionnée.
