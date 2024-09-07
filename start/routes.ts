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

router
  .get('/', [HomeController, 'render'])
  .as('home')
  .use(middleware.auth({ guards: ['web'] }))

// Auth
router.get('/auth/login', [AuthRegistersController, 'render']).as('auth-login.render')
router.post('/auth/login', [AuthRegistersController, 'execute']).as('auth-login.execute')
router
  .post('/auth/logout', [LogoutsController, 'execute'])
  .as('auth-logout.execute')
  .use(middleware.auth({ guards: ['web'] }))

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
    router.get('/exercises/:exerciseId', [ExerciseController, 'render']).as('exercise')
    router
      .get('api/exercises/:exerciseId/load-progress', [ExerciseController, 'loadProcess'])
      .as('load-progress')
    router
      .post('api/exercises/:exerciseId/save-progress', [ExerciseController, 'saveProgress'])
      .as('save-progress')
    router.post('api/exercises/:exerciseId/execute', [ExerciseController, 'execute']).as('execute')
  })
  .use(middleware.auth({ guards: ['web'] }))

export default router
