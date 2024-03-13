import User from '#models/user'
import { registrationValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async store({ request }: HttpContext) {
    const data = request.all()
    const payload = await registrationValidator.validate(data)
    const user = await User.create(payload)
    return user
  }
}
