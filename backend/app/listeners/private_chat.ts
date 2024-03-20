import Friend from '#models/friend'
import PrivateChat from '#models/private_chat'
import { Callback } from '#types/listeners'
import { privateChatMessageValidator } from '#validators/private_chat'
import { errors } from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import { Server, Socket } from 'socket.io'
import logger from '@adonisjs/core/services/logger'
import redis from '@adonisjs/redis/services/main'

export default function privateChatHandlers(io: Server, socket: Socket) {
  socket.on('private-chat:send-message', sendMessage)

  async function sendMessage(data: Infer<typeof privateChatMessageValidator>, cb?: Callback) {
    try {
      const { content, receiverId } = await privateChatMessageValidator.validate(data)
      const senderId = socket.data.user.id
      const areFriends = await Friend.areFriends({
        receiverId: receiverId,
        senderId: senderId,
      })

      if (!areFriends) {
        cb && cb({ success: false, message: 'You are not friends with this user.' })
        return
      }

      const message = await PrivateChat.sendMessage({ content, receiverId, senderId })

      const receiverSockets = await redis.lrange(String(receiverId), 0, -1)
      const senderSockets = await redis.lrange(String(senderId), 0, -1)
      const sockets = [...receiverSockets, ...senderSockets]

      io.to(sockets).emit('private-chat:message-received', message)
    } catch (error) {
      logger.error(error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        cb && cb({ success: false, message: 'Validation error', errors: { ...error.messages } })
      }
    }
  }
}
