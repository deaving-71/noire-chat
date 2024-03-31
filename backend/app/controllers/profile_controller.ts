import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async show({ auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'You must be logged in to perform this action' })
    }

    const _channels = await user
      .related('channels')
      .query()
      .preload('messages', (messagesQuery) => {
        messagesQuery.select(['created_at', 'senderId']).limit(100)
      })

    const pivotTable = (await user.related('channels').pivotQuery()) as {
      channel_id: number
      last_seen_messages: string
    }[]

    const channels = _channels.map((channel) => {
      const { last_seen_messages } =
        pivotTable.find((pivot) => pivot.channel_id === channel.id) || {}

      let unreadMessages = 0

      if (last_seen_messages) {
        for (let message of channel.messages) {
          if (message.senderId === user.id) continue
          console.log(message.senderId)
          console.log(user.id)
          if (Date.parse(message.createdAt) > Date.parse(last_seen_messages)) {
            unreadMessages++
          }
        }
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
