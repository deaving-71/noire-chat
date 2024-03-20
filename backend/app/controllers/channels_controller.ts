import Channel from '#models/channel'
import User from '#models/user'
import { channelCreationValidator, channelShowValidator } from '#validators/channel'
import type { HttpContext } from '@adonisjs/core/http'
import { randomBytes } from 'crypto'

export default class ChannelsController {
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.abort({
        message: 'You must be logged in to perform this action',
        status: 401,
      })
    }

    const { name } = await request.validateUsing(channelCreationValidator)
    const userId = user.id
    const slug = randomBytes(4).toString('hex')

    const channel = await Channel.create({ name, ownerId: userId, slug })
    user.related('channels').attach([channel.id])

    return channel
  }

  async show({ request }: HttpContext) {
    const { params } = await request.validateUsing(channelShowValidator)
    const { slug } = params

    // TODO: implement pagination
    const _channel = await Channel.query()
      .where('slug', slug)
      .preload('messages', (messagesQuery) => {
        messagesQuery.preload('sender')
      })
      .preload('owner')
      .preload('members')
      .first()

    if (!_channel) throw new Error('Channel not found')

    const { messages, members, ...channel } = _channel.serialize()
    const onlineMembers = members.filter((m: User) => m.isOnline === true)
    const offlineMembers = members.filter((m: User) => m.isOnline === false)

    return { channel, members: { online: onlineMembers, offline: offlineMembers }, messages }
  }
}
