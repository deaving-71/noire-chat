import Channel from '#models/channel'
import User from '#models/user'
import {
  channelCreationValidator,
  channelShowValidator,
  channelUpdateValidator,
} from '#validators/channel'
import type { HttpContext } from '@adonisjs/core/http'
import { randomBytes } from 'crypto'
import { DateTime } from 'luxon'

export default class ChannelsController {
  async store({ auth, request }: HttpContext) {
    const user = auth.user!

    const { name } = await request.validateUsing(channelCreationValidator)
    const userId = user.id
    const slug = randomBytes(4).toString('hex')

    const channel = await Channel.create({ name, ownerId: userId, slug })
    await user.related('channels').attach([channel.id])

    return channel
  }

  async show({ request, response }: HttpContext) {
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

    if (!_channel) {
      return response.notFound({ message: 'Could not find this channel' })
    }

    const { messages, members, ...channel } = _channel.serialize()

    const _members = members.filter((member: User) => member.id !== channel.owner.id)

    return { channel, members: _members, messages }
  }

  async update({ auth, request }: HttpContext) {
    const user = auth.user!

    const { params } = await request.validateUsing(channelUpdateValidator)
    const { id } = params

    const channel = await user
      .related('channels')
      .pivotQuery()
      .where('channel_id', id)
      .update({ last_seen_messages: DateTime.now().toISO() })

    return channel
  }
}
