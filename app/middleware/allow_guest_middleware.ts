import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AllowGuestMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    try {
      await auth.authenticate()
      return response.forbidden({
        message: 'Маршрут доступен только неавторизованным пользователям',
      })
    } catch {
      return next()
    }
  }
}
