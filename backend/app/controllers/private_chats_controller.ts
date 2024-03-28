import PrivateChat from '#models/private_chat'
import User from '#models/user'
import { receiverIdValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class PrivateChatsController {
  async index({ auth }: HttpContext) {
    const userId = auth.user?.id

    if (!userId) throw new Error('User not found')

    const user = await User.find(userId)

    const _sentPrivateChats = await user
      ?.related('sentPrivateChats')
      .query()
      .has('messages')
      .preload('receiver')
      .preload('sender')
      .preload('messages', (messagesQuery) => {
        messagesQuery.orderBy('id', 'desc').preload('sender').first()
      })

    const _receivedPrivateChats = await user
      ?.related('receivedPrivateChats')
      .query()
      .has('messages')
      .preload('receiver')
      .preload('sender')
      .preload('messages', (messagesQuery) => {
        messagesQuery.orderBy('id', 'desc').preload('sender').first()
      })

    const sentPrivateChats = _sentPrivateChats?.map((chat) => {
      const { messages, ...rest } = chat.serialize()
      const last_message = {
        content: chat.messages[0].content,
        createdAt: chat.messages[0].createdAt,
        sender: chat.messages[0].sender,
      }

      return { ...rest, last_message }
    })

    const receivedPrivateChats = _receivedPrivateChats?.map((chat) => {
      const { messages, ...rest } = chat.serialize()
      const last_message = {
        content: chat.messages[0].content,
        createdAt: chat.messages[0].createdAt,
        sender: chat.messages[0].sender,
      }

      return { ...rest, last_message }
    })

    //@ts-ignore //! TypeScript bug
    const private_chats = [...sentPrivateChats, ...receivedPrivateChats]

    return private_chats
  }

  /**
   * initiate a chat
   * @returns - the chat id
   */
  async store({ auth, request }: HttpContext) {
    const userId = auth.user?.id
    if (!userId) throw new Error('User not found')

    const { receiverId } = await receiverIdValidator.validate(request.qs())

    // check if the user receiver exists
    await User.findOrFail(receiverId)

    const chat = await PrivateChat.getChat({ senderId: userId, receiverId })

    return chat.id
  }

  async show({ auth, request, response }: HttpContext) {
    const userId = auth.user?.id

    if (!userId) throw new Error('User not found')

    const id = request.param('id')
    const chat = PrivateChat.query()
      .where('id', id)
      .where('senderId', userId)
      .orWhere('receiverId', userId)
      .preload('sender')
      .preload('receiver')
      .preload('messages', (messagesQuery) => messagesQuery.preload('sender'))
      .first()

    if (!chat) {
      return response.notFound({ message: 'This chat does not exist' })
    }

    return chat
  }
}
