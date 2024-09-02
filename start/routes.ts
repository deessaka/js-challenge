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
const ExercisesController = () => import('#controllers/exercises_controller')
const OauthController = () => import('#controllers/oauths_controller')
const AuthRegistersController = () => import('#controllers/auth_registers_controller')

router
  .get('/', [HomeController, 'render'])
  .as('home')
  .use(middleware.auth({ guards: ['web'] }))

router.get('/auth/login', [AuthRegistersController, 'render']).as('auth-login.render')
router.post('/auth/login', [AuthRegistersController, 'execute']).as('auth-login.execute')
router
  .post('/auth/logout', [LogoutsController, 'execute'])
  .as('auth-logout.execute')
  .use(middleware.auth({ guards: ['web'] }))

router
  .get('/oauth/:provider/callback', [OauthController, 'callback'])
  .where('provider', /github/)
  .as('oauth-callback')
router
  .get('/oauth/:provider/redirect', [OauthController, 'redirect'])
  .where('provider', /github/)
  .as('oauth-redirect')

router.get('/exercises/:exercise', [ExercisesController, 'render']).as('exercise')

export default router
