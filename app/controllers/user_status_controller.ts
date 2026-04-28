import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { statusValidator } from '#validators/status'

export default class UserStatusController {
  async update({ request, params }: HttpContext) {
    const { status } = await request.validateUsing(statusValidator)
    const userId = Number(params.id)

    const user = await User.findOrFail(userId)
    user.status = status
    await user.save()

    return user
  }
}
