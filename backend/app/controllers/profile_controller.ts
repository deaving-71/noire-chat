import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async show({ auth }: HttpContext) {
    const userId = auth.user?.id

    if (!userId) throw new Error('User not found')

    const profile = await User.getUser(userId)

    return profile
  }
}
