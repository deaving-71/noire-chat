import User from '#models/user'
import { registrationValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(registrationValidator)
    const user = await User.create(payload)
    await user.related('notifications').create({ privateChats: [] })

    return user
  }
}
