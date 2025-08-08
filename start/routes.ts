/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Здоровотест
router.get('/', async () => {
  return { hello: 'world' }
})

// Группа маршрутов для аутентификации
router
  .group(() => {
    // Регистрация (для гостей)
    router.post('/register', 'AuthController.register').use(['guest'])

    // Логин (для гостей)
    router.post('/login', 'AuthController.login').use(['guest'])

    // Получить профиль (для аутентифицированных)
    router.get('/me', 'AuthController.me').use(['auth'])

    // Изменить статус пользователя (только для админа)
    router.patch('/users/:id/status', 'UserStatusController.update').use(['auth']).use(['isAdmin'])
  })
  .prefix('/auth')
