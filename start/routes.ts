/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const LogoutsController = () => import('#controllers/logouts_controller')
const HomeController = () => import('#controllers/home_controller')
const ExerciseController = () => import('#controllers/exercise_controller')
const OauthController = () => import('#controllers/oauths_controller')
const AuthRegistersController = () => import('#controllers/auth_registers_controller')
const UserController = () => import('#controllers/user_controller')
const EmailVerificationsController = () => import('#controllers/email_verifications_controller')
const TokensController = () => import('#controllers/tokens_controller')
const AdminController = () => import('#controllers/admin_controller')
const ApiV1Controller = () => import('#controllers/api_v1_controller')
const DocumentationController = () => import('#controllers/documentation_controller')
// Health check route
router.get('/health', async ({ response }) => {
  return response.ok({ status: 'ok', timestamp: new Date().toISOString() })
})

// Public routes
router.get('/', [HomeController, 'landing']).as('landing')
router.get('/about', [HomeController, 'about']).as('about')
router.get('/docs', [DocumentationController, 'index']).as('docs.index')
router
  .get('/docs/:slug', [DocumentationController, 'show'])
  .where('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .as('docs.show')
router
  .get('/home', [HomeController, 'render'])
  .as('home')
  .use(middleware.auth({ guards: ['web'] }))

// User Profile
router
  .get('/profile', [UserController, 'profile'])
  .as('user.profile')
  .use(middleware.auth({ guards: ['web'] }))
router
  .get('/profile/api-tokens', [TokensController, 'index'])
  .as('user.tokens.index')
  .use(middleware.auth({ guards: ['web'] }))
router
  .post('/profile/api-tokens', [TokensController, 'create'])
  .as('user.tokens.create')
  .use(middleware.auth({ guards: ['web'] }))
router
  .delete('/profile/api-tokens/:id', [TokensController, 'revoke'])
  .as('user.tokens.revoke')
  .use(middleware.auth({ guards: ['web'] }))

// Auth
router
  .get('/auth/login', [AuthRegistersController, 'render'])
  .as('auth-login.render')
  .use(middleware.guest())
router
  .post('/auth/login', [AuthRegistersController, 'execute'])
  .as('auth-login.execute')
  .use(middleware.rateLimit({ maxAttempts: 5, decayMinutes: 15 }))
  .use(middleware.guest())
router
  .post('/auth/logout', [LogoutsController, 'execute'])
  .as('auth-logout.execute')
  .use(middleware.auth({ guards: ['web'] }))

// Registration
router
  .get('/auth/register', [AuthRegistersController, 'renderRegister'])
  .as('auth-register.render')
  .use(middleware.guest())
router
  .post('/auth/register', [AuthRegistersController, 'register'])
  .as('auth-register.execute')
  .use(middleware.rateLimit({ maxAttempts: 5, decayMinutes: 15 }))
  .use(middleware.guest())

// Email Verification
router
  .get('/auth/verify-email/:token', [EmailVerificationsController, 'verify'])
  .as('auth.verify-email')
  .use(middleware.guest())
router
  .post('/auth/resend-verification', [EmailVerificationsController, 'resendVerification'])
  .as('auth.resend-verification')
  .use(middleware.rateLimit({ maxAttempts: 3, decayMinutes: 5 }))
  .use(middleware.guest())

// OAuth
router
  .get('/oauth/:provider/callback', [OauthController, 'callback'])
  .where('provider', /github/)
  .as('oauth-callback')
  .use(middleware.guest())
router
  .get('/oauth/:provider/redirect', [OauthController, 'redirect'])
  .where('provider', /github/)
  .as('oauth-redirect')
  .use(middleware.guest())

// Versioned API for the web dashboard and terminal CLI
router
  .group(() => {
    router.get('/me', [ApiV1Controller, 'me']).as('api.v1.me')
    router.get('/challenges', [ApiV1Controller, 'challenges']).as('api.v1.challenges')
    router.get('/challenges/:slug', [ApiV1Controller, 'challenge']).as('api.v1.challenge')
    router.get('/progress', [ApiV1Controller, 'progress']).as('api.v1.progress')
    router
      .get('/progress/:challengeId', [ApiV1Controller, 'challengeProgress'])
      .as('api.v1.progress.challenge')
    router
      .get('/recommendations/next', [ApiV1Controller, 'nextChallenge'])
      .as('api.v1.recommendations.next')
    router
      .post('/submissions', [ApiV1Controller, 'createSubmission'])
      .as('api.v1.submissions.create')
      .use(middleware.rateLimit({ maxAttempts: 10, decayMinutes: 1 }))
    router.get('/submissions/:id', [ApiV1Controller, 'submission']).as('api.v1.submissions.show')
  })
  .prefix('/api/v1')
  .use(middleware.auth({ guards: ['api'] }))

// Exercises
router
  .group(() => {
    router
      .get('/exercises/:exerciseId', [ExerciseController, 'render'])
      .where('exerciseId', /^[1-9]\d*$/)
      .as('exercise')
    router
      .get('api/exercises/:exerciseId/load-progress', [ExerciseController, 'loadProcess'])
      .as('load-progress')
    router
      .post('api/exercises/:exerciseId/save-progress', [ExerciseController, 'saveProgress'])
      .as('save-progress')
    // CRITICAL-03: rate-limit code execution — each submission spins up a 128MB
    // isolated-vm. Without a limit, a single user can exhaust server memory.
    router
      .post('api/exercises/:exerciseId/execute', [ExerciseController, 'execute'])
      .as('execute')
      .use(middleware.rateLimit({ maxAttempts: 10, decayMinutes: 1 }))
  })
  .use([middleware.auth({ guards: ['web'] }), middleware.exercise()])

// Admin panel
router
  .group(() => {
    router.get('/', [AdminController, 'dashboard']).as('admin.dashboard')
    router.get('/users', [AdminController, 'users']).as('admin.users')
    router.post('/users/:id/role', [AdminController, 'updateUser']).as('admin.users.role')
    router.post('/users/:id/status', [AdminController, 'updateUserStatus']).as('admin.users.status')
    router
      .post('/users/:id/reset-progress', [AdminController, 'resetUserProgress'])
      .as('admin.users.reset-progress')
    router.get('/exercises', [AdminController, 'exercises']).as('admin.exercises')
    router.post('/exercises', [AdminController, 'createExercise']).as('admin.exercises.create')
    router.post('/exercises/:id', [AdminController, 'updateExercise']).as('admin.exercises.update')
    router
      .post('/exercises/:id/verify-tests', [AdminController, 'verifyExerciseTests'])
      .as('admin.exercises.verify-tests')
  })
  .prefix('/admin')
  .use(middleware.admin({ guards: ['web'] }))

// Password
router
  .get('/password/edit', [UserController, 'render'])
  .as('password.edit')
  .use(middleware.auth({ guards: ['web'] }))
router
  .post('/password/set', [UserController, 'setPassword'])
  .as('password.set')
  .use(middleware.auth({ guards: ['web'] }))
router
  .get('/password/request-reset', [UserController, 'renderRequestReset'])
  .as('password.request-reset.render')
  .use(middleware.guest())
router
  .post('/password/request-reset', [UserController, 'requestReset'])
  .as('password.request-reset')
  .use(middleware.rateLimit({ maxAttempts: 3, decayMinutes: 15 }))
  .use(middleware.guest())
router
  .get('/password/reset/:token', [UserController, 'renderResetForm'])
  .as('password.reset')
  .use(middleware.guest())
router
  .post('/password/reset/:token', [UserController, 'resetPassword'])
  .as('password.reset.execute')
  .use(middleware.rateLimit({ maxAttempts: 5, decayMinutes: 15 }))
  .use(middleware.guest())

export default router
