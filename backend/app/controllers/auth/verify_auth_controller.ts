import type { HttpContext } from '@adonisjs/core/http'

export default class VerifyAuthsController {
  async show({ auth }: HttpContext) {
    const isAuthenticated = await auth.use('web').check()

    return { isAuthenticated }
  }
}
