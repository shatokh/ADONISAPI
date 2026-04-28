import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IsAdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    await auth.authenticate()

    const user = auth.user
    if (!user || user.role !== 'admin') {
      return response.forbidden({ message: 'Доступ только для администратора' })
    }

    return next()
  }
}
