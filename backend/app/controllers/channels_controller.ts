import Channel from '#models/channel'
import { channelCreationValidator } from '#validators/channel'
import type { HttpContext } from '@adonisjs/core/http'
import { randomBytes } from 'crypto'

export default class ChannelsController {
  async store({ auth, request }: HttpContext) {
    const user = auth.user

    if (!user) throw new Error('User not found')

    const { name } = await request.validateUsing(channelCreationValidator)
    const userId = user.id
    const inviteLink = randomBytes(4).toString('hex')

    const channel = await Channel.create({ name, ownerId: userId, inviteLink })
    user.related('channels').attach([channel.id])

    return channel
  }
}
