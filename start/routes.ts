/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const UserStatusController = () => import('#controllers/user_status_controller')

router.get('/', async () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router.post('/register', [AuthController, 'register']).use(middleware.guest())
    router.post('/login', [AuthController, 'login']).use(middleware.guest())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())

    router
      .patch('/users/:id/status', [UserStatusController, 'update'])
      .use(middleware.auth())
      .use(middleware.isAdmin())
  })
  .prefix('/auth')
