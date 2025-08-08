// app/Middleware/IsAdmin.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Кастомное middleware для проверки роли администратора
 */
export default class IsAdmin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // Пытаемся аутентифицировать пользователя по токену
    await auth.use('api').authenticate()

    const user = auth.use('api').user
    // Проверяем, что пользователь существует и имеет роль 'admin'
    if (!user || user.role !== 'admin') {
      return response.forbidden({ message: 'Доступ только для администратора' })
    }

    // Передаём управление следующему middleware/контроллеру
    await next()
  }
}
