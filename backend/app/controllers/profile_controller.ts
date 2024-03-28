import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ProfilesController {
  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    if (!user) {
      return response.unauthorized({ message: 'You must be logged in to perform this action' })
    }

    const _channels = await user
      .related('channels')
      .query()
      .preload('messages', (messagesQuery) => {
        messagesQuery.select(['created_at']).limit(100)
      })

    const pivotTable = (await user.related('channels').pivotQuery()) as {
      channel_id: number
      last_seen_messages: string | null
    }[]

    const channels = _channels.map((channel) => {
      const { last_seen_messages } =
        pivotTable.find((pivot) => pivot.channel_id === channel.id) || {}

      let unreadMessages = 0

      if (last_seen_messages) {
        channel.messages.forEach((message) => {
          if (Date.parse(message.createdAt) > Date.parse(last_seen_messages)) {
            unreadMessages++
          }
        })
      } else {
        unreadMessages = channel.messages.length
      }

      const channelJSON = channel.serialize()
      delete channelJSON.messages

      return {
        ...channelJSON,
        unreadMessages,
      }
    })

    return {
      profile: user,
      channels,
    }
  }
}
