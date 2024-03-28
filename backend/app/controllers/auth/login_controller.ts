import { HttpContext } from '@adonisjs/core/http'
import { loginValidator } from '#validators/auth'
import User from '#models/user'
import { stringify } from 'node:querystring'

export default class LoginController {
  async store({ request, response, auth }: HttpContext) {
    try {
      const data = request.only(['email', 'password', 'remember'])

      const { email, password, remember } = await loginValidator.validate(data)

      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user, remember)

      response.plainCookie('noirechat-userdata', stringify(user.serialize()), {
        httpOnly: true,
        encode: false,
      })

      return response.json(user)
    } catch (error) {
      return response.status(400).json({ root: 'Invalid email or password' })
    }
  }

  async destroy({ auth }: HttpContext) {
    await auth.use('web').logout()
  }
}
