import PrivateChat from '#models/private_chat'
import PrivateChatMessage from '#models/private_chat_message'
import User from '#models/user'
import { receiverIdValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class PrivateChatsController {
  async index({ auth }: HttpContext) {
    const user = auth.user!

    const _privateChats = await PrivateChat.query()
      .where('receiverId', user.id)
      .orWhere('senderId', user.id)
      .has('messages')
      .preload('sender')
      .preload('receiver')
      .preload('messages', (messagesQuery) => {
        messagesQuery.preload('sender').orderBy('id', 'desc')
      })

    //@ts-ignore
    const privateChats: (Omit<PrivateChat, 'messages'> & { last_message: PrivateChatMessage })[] =
      _privateChats?.map((chat) => {
        const { messages, ...rest } = chat.toJSON()

        const last_message = messages.at(0)
        return { ...rest, last_message }
      })

    privateChats.sort(
      (a, b) => b.last_message.createdAt.toSeconds() - a.last_message.createdAt.toSeconds()
    )

    return privateChats
  }

  /**
   * initiate a chat
   * @returns - the chat id
   */
  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id

    const { receiverId } = await receiverIdValidator.validate(request.qs())

    // check if the user receiver exists
    const receiver = await User.find(receiverId)
    if (!receiver) {
      return response.badRequest({ message: 'User does not exist' })
    }

    const chat = await PrivateChat.getChat({ senderId: userId, receiverId })

    return chat.id
  }

  async show({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id

    const { params } = await request.validateUsing(
      vine.compile(vine.object({ params: vine.object({ id: vine.number() }) }))
    )
    const { id } = params

    const chat = await PrivateChat.query()
      .where('id', id)
      .andWhere(function (query) {
        query.where('senderId', userId).orWhere('receiverId', userId)
      })
      .preload('sender')
      .preload('receiver')
      .preload('messages', (messagesQuery) => messagesQuery.preload('sender'))
      .first()

    if (!chat) {
      return response.notFound({ message: 'The chat inbox you trying to access does not exist' })
    }

    return chat
  }
}
