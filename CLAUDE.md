# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Codojo is an educational JavaScript coding exercise platform built with AdonisJS 6 and React (via Inertia.js). Students solve JavaScript programming challenges that are executed in an isolated sandbox environment using `isolated-vm`. The application uses Redis for caching, PostgreSQL for persistence, and supports OAuth authentication with GitHub.

## Essential Commands

### Development

```bash
npm run dev           # Start development server with HMR (http://localhost:3333)
npm run build         # Build the application for production
npm start             # Start production server (requires build first)
```

### Testing

```bash
npm test              # Run all tests (unit + functional)
node ace test unit    # Run only unit tests
node ace test functional  # Run only functional tests
```

### Code Quality

```bash
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run typecheck     # Run TypeScript type checking
```

### Database

```bash
node ace migration:run        # Run pending migrations
node ace migration:rollback   # Rollback last migration batch
node ace db:seed              # Seed the database
```

### Docker

```bash
npm run up:dev        # Build and start all services (app, postgres, redis) with logs
npm run down          # Stop and remove all containers
docker compose up -d  # Start services in background
```

## Architecture

### Backend Structure (AdonisJS)

The backend follows AdonisJS conventions with custom import aliases defined in `package.json`:

- **Controllers** (`#controllers/*`): HTTP request handlers
  - `exercise_controller.ts`: Main logic for loading exercises, saving progress, and executing code
  - `auth_registers_controller.ts`: Email/password authentication
  - `oauths_controller.ts`: GitHub OAuth flow
  - `user_controller.ts`: Password management

- **Services** (`#services/*`): Business logic layer
  - `test_runner_service.ts`: Executes user code in isolated VM with mock Jest environment
  - `exercise_services.ts`: Manages exercises with Redis caching (24h TTL)
  - `oauth_service.ts`: Handles OAuth user creation/authentication
  - `user_progress.ts`: Tracks completion status

- **Models** (`#models/*`): Lucid ORM models
  - `User`, `Exercise`, `UserSolution`, `UserProgress`, `AccessToken`

- **Middleware** (`#middleware/*`):
  - `auth_middleware.ts`: Authentication guard
  - `user_location_middleware.ts`: Tracks user position/progress in exercises

- **Constants** (`#constants/*`):
  - `CONST/exercises.ts`: Central repository of all exercise definitions (title, difficulty, description)

### Frontend Structure (React + Inertia.js)

Located in `inertia/`:

- **Pages** (`~/pages/*`): Inertia page components
  - `exercise.tsx`: Main exercise workspace with Monaco editor and split panels
  - `home.tsx`: Dashboard with exercise list
  - `auth/login.tsx`: Authentication page

- **Components** (`#components/*` or `~/components/*`): Reusable React components
  - UI components using Radix UI + Tailwind CSS
  - Form components with react-hook-form + zod validation

- **Providers**: React Query setup for data fetching

### Code Execution Flow

1. User writes JavaScript code in Monaco editor (`exercise.tsx`)
2. Code submitted via POST to `/api/exercises/:id/execute`
3. `ExerciseController.execute()` receives code
4. `IsolatedTestRunner` (in `test_runner_service.ts`):
   - Creates isolated VM with 128MB memory limit
   - Injects user code
   - Injects mock Jest API (describe, it, expect)
   - Loads test file from `tests/exercises/ExerciceN.test.js`
   - Executes tests in sandbox
   - Returns pass/fail results
5. Solution saved (encrypted) to database if tests pass
6. Cache invalidated for that exercise/user combination

### Caching Strategy

Redis is used extensively:

- Exercise data with user solutions cached for 24 hours
- Cache keys: `exercise:{exerciseId}:user:{userId}`
- Automatic invalidation on solution updates
- Periodic cleanup via `ExerciseServices.cleanupCache()`

### Security

- User solutions are encrypted before storage using AdonisJS encryption
- Code execution isolated with `isolated-vm` (128MB memory limit)
- CSRF protection via Shield middleware
- Session-based authentication with optional GitHub OAuth
- SSL certificate verification script: `npm run verify-ssl`

## Key Conventions

### Import Aliases

The project uses custom import paths defined in `package.json`:

- `#controllers/*` → `./app/controllers/*.js`
- `#services/*` → `./app/services/*.js`
- `#models/*` → `./app/models/*.js`
- `#constants/*` → `./CONST/*.js`
- `~/` → `./inertia/*` (frontend)

Note: `.js` extensions in imports even though files are `.ts` (TypeScript transpilation)

### Test Files

- Exercise tests: `tests/exercises/ExerciceN.test.js` (French spelling: "Exercice")
- Unit tests: `tests/unit/**/*.spec.ts`
- Functional tests: `tests/functional/**/*.spec.ts`

### Hot Module Replacement

Configured via `hot-hook` for controllers and middleware (see `package.json` hotHook config)

## Common Development Tasks

### Adding a New Exercise

1. Add exercise definition to `CONST/exercises.ts` with incremented number
2. Create test file: `tests/exercises/ExerciceN.test.js` (use Jest syntax)
3. Add migration if database schema changes needed
4. Exercise automatically appears in UI via database seeder

### Running Single Test Suite

```bash
# Run specific exercise test by modifying controller to only load that exercise
# Or test directly with Node (tests are pure JavaScript)
node tests/exercises/Exercice1.test.js
```

### Database Reset

```bash
node ace migration:fresh --seed  # Drop all tables, migrate, and seed
```

### Checking Application Health

```bash
curl http://localhost:3333/health
```

## Environment Setup

Required environment variables (see `.env.example`):

- `APP_KEY`: Encryption key (generate with `node ace generate:key`)
- `DB_*`: PostgreSQL connection details
- `REDIS_*`: Redis connection details
- `GITHUB_CLIENT_ID/SECRET`: For OAuth (optional)
- `SMTP_*`: Email configuration (for password reset)

## Deployment

The project includes:

- `Dockerfile` for containerization
- `render.yaml` for Render.com deployment
- `Procfile` for Heroku-compatible platforms
- Documentation: `docs/deploy_to_render.md`

## Contributing

Follow Conventional Commits format (see `CONTRIBUTION.md`):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code restructure
- `test:` Test additions/changes
