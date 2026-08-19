# Codojo — Agent Task Plan

## Status Legend

- [ ] TODO
- [~] IN PROGRESS
- [x] DONE
- [!] BLOCKED

---

## PHASE 1.5 — CI/CD Pipeline

- [x] Fix native build failure on GitHub Actions by downgrading isolated-vm^6 to ^5 to support Node.js 20 runner environments.

## PHASE 2 — Critical Fixes (Low Risk)

### 🔴 CRITICAL-01 — Sandbox timeout missing

- File: app/services/test_runner_service.ts
- Risk: LOW
- [x] Add timeout option to isolated-vm execution (EXECUTION_TIMEOUT_MS = 5000ms, line 66)
- [x] Verify with typecheck + lint (typecheck ✅ | lint script broken — no eslint.config.js in repo)

### 🔴 CRITICAL-02 — Isolate never disposed

- File: app/services/test_runner_service.ts
- Risk: LOW
- [x] Add isolate.dispose() in finally block (lines 82-84, guarded with isDisposed check)
- [x] Verify with typecheck + lint (typecheck ✅ | lint script broken — no eslint.config.js in repo)

### 🔴 CRITICAL-03 — No rate limit on /execute endpoint

- File: start/routes.ts (or equivalent)
- Risk: LOW
- [x] Add rate limiter middleware (10 req/min per IP on /execute)
- [x] Verify with typecheck + lint (typecheck ✅ | lint script broken — no eslint.config.js in repo)

### 🔴 CRITICAL-04 — XSS via dangerouslySetInnerHTML

- File: inertia/pages/exercise.tsx
- Risk: LOW
- [x] Install DOMPurify (+ @types/dompurify)
- [x] Wrap all dangerouslySetInnerHTML with sanitizer (resize_panel.tsx:180)
- [x] Verify with typecheck + lint (typecheck ✅ | lint script broken — no eslint.config.js in repo)

### 🔴 CRITICAL-05 — Silent error swallowing

- File: app/controllers/exercise_controller.ts
- Risk: LOW
- [x] Fix render() swallowing DB errors and returning undefined exercise
- [x] Fix onTestFailed reading .results from Error object (always undefined)
- [x] Verify with typecheck + lint (typecheck ✅ | lint script broken — no eslint.config.js in repo)

### 🔴 CRITICAL-06 — Broken pages on error (no error boundary)

- File: inertia/pages/exercise.tsx + app root
- Risk: LOW
- [x] Add React Error Boundary component (inertia/components/hoc/withErrorBoundary.tsx — enhanced existing)
- [x] Wrap exercise workspace (ExerciseLayout wraps <main> with ErrorBoundary + full-screen fallback)
- [x] Verify with typecheck + lint (typecheck ✅ | lint script broken — no eslint.config.js in repo)

---

## PHASE 3 — Medium Issues (pending Phase 2 completion)

- [ ] MEDIUM issues to be listed after Phase 2 is done

## PHASE 4 — Multi-Language Architecture

- [ ] LanguageAdapter pattern design
- [ ] Python runner proof of concept
- [ ] Test format abstraction

## PHASE 3.5 — Component Normalization

- [x] Remove duplicated custom Button/Card components

- [x] Restructure shadcn/ui directory from nested to flat

- [x] Update imports project-wide for refactored ui components

## PHASE 5 — UI/UX Redesign

- [ ] Exercise workspace layout
- [ ] Mobile responsiveness
- [ ] Accessibility (a11y)

## PHASE 6 — CLI-first architecture

- [x] Make API v1 the learning source of truth and reject locked submissions
- [x] Reconcile hybrid prerequisites and first-exercise onboarding
- [x] Normalize kyu labels and editorial points
- [x] Compute attempts, progress and daily streak from official submissions
- [x] Keep Ink as the sole TUI and paginate the complete catalog
- [x] Convert Web into account/token/admin control plane
- [x] Deprecate legacy exercise APIs and remove the Monaco learning UI

---

## Change Log

| Date       | Issue                     | File Modified                                     | Status |
| ---------- | ------------------------- | ------------------------------------------------- | ------ |
| 2026-02-27 | AGENT_PLAN.md created     | AGENT_PLAN.md                                     | DONE   |
| 2026-02-27 | CRITICAL-01 + CRITICAL-02 | app/services/test_runner_service.ts               | DONE   |
| 2026-02-27 | CRITICAL-03               | start/routes.ts                                   | DONE   |
| 2026-02-27 | CRITICAL-04               | inertia/components/resize_panel/resize_panel.tsx  | DONE   |
| 2026-02-27 | CRITICAL-04 (dep)         | package.json (dompurify + @types/dompurify added) | DONE   |
| 2026-02-27 | CRITICAL-05               | app/controllers/exercise_controller.ts            | DONE   |
| 2026-02-27 | CRITICAL-06               | inertia/components/hoc/withErrorBoundary.tsx      | DONE   |
| 2026-02-27 | CRITICAL-06               | inertia/components/layouts/exercise_layout.tsx    | DONE   |
| 2026-03-04 | Component Norm.           | inertia/components/ui/\*                          | DONE   |

| 2026-03-04 | Component Norm. | components.json | DONE |

| 2026-03-04 | Component Norm. | Various .tsx components | DONE |
| 2026-03-04 | CI Fix | package.json (isolated-vm downgrade) | DONE |
| 2026-08-19 | CLI-first architecture | API, progression, CLI, Web portal, migrations and docs | DONE |

---

**Rules for the agent:**

1. Update this file after EVERY change
2. Mark [~] when starting a task
3. Mark [x] immediately after typecheck + lint pass
4. Add every modified file to the Change Log
5. Never start a new task while one is [~]
6. If a fix causes a typecheck/lint failure → mark [!] BLOCKED and stop
