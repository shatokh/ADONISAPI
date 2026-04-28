import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/login'
import { registerValidator } from '#validators/register'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)
    const token = await User.accessTokens.create(user)

    return response.created({
      user,
      token: token.value?.release?.() ?? token,
    })
  }

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return {
      user,
      token: token.value?.release?.() ?? token,
    }
  }

  async me({ auth }: HttpContext) {
    await auth.authenticate()

    return auth.user
  }
}
