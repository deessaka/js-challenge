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
// Health check route
router.get('/health', async ({ response }) => {
  return response.ok({ status: 'ok', timestamp: new Date().toISOString() })
})

// Public routes
router.get('/', [HomeController, 'landing']).as('landing')
router.get('/about', [HomeController, 'about']).as('about')
router
  .get('/home', [HomeController, 'render'])
  .as('home')
  .use(middleware.auth({ guards: ['web'] }))

// User Profile
router
  .get('/profile', [UserController, 'profile'])
  .as('user.profile')
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
router
  .post('/auth/resend-verification', [EmailVerificationsController, 'resendVerification'])
  .as('auth.resend-verification')
  .use(middleware.rateLimit({ maxAttempts: 3, decayMinutes: 5 }))

// OAuth
router
  .get('/oauth/:provider/callback', [OauthController, 'callback'])
  .where('provider', /github/)
  .as('oauth-callback')
router
  .get('/oauth/:provider/redirect', [OauthController, 'redirect'])
  .where('provider', /github/)
  .as('oauth-redirect')

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
router
  .post('/password/request-reset', [UserController, 'requestReset'])
  .as('password.request-reset')
  .use(middleware.rateLimit({ maxAttempts: 3, decayMinutes: 15 }))
router.get('/password/reset/:token', [UserController, 'renderResetForm']).as('password.reset')
router
  .post('/password/reset/:token', [UserController, 'resetPassword'])
  .as('password.reset.execute')
  .use(middleware.rateLimit({ maxAttempts: 5, decayMinutes: 15 }))

export default router
