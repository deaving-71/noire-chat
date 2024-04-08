import PrivateChat from '#models/private_chat'
import { privateChatMessageValidator } from '#validators/private_chat'
import { Infer } from '@vinejs/vine/types'
import { Server, Socket } from 'socket.io'
import logger from '@adonisjs/core/services/logger'
import redis from '@adonisjs/redis/services/main'
import Notification from '#models/notification'

export default function privateChatHandlers(io: Server, socket: Socket) {
  socket.on('private-chat:send-message', sendMessage)

  async function sendMessage(data: Infer<typeof privateChatMessageValidator>) {
    try {
      const { content, receiverId, messageId } = await privateChatMessageValidator.validate(data)
      const senderId = socket.data.user.id

      const message = await PrivateChat.sendMessage({ content, receiverId, senderId })
      const notifications = await Notification.findBy('userId', receiverId)

      const receiverSockets = await redis.lrange(String(receiverId), 0, -1)
      const senderSockets = await redis.lrange(String(senderId), 0, -1)
      const sockets = [...receiverSockets, ...senderSockets]

      if (notifications) {
        if (!notifications.privateChats.includes(message.privateChatId)) {
          notifications.privateChats.push(message.privateChatId)
          const newNotifications = await notifications.save()

          if (receiverSockets.length < 0) return

          const { privateChats, friendRequestsCount } = newNotifications

          io.to(receiverSockets).emit('notification', {
            privateChats,
            friendRequestsCount,
          })
        }
      }

      io.to(sockets).emit('private-chat:message-received', message.serialize(), messageId)
    } catch (error) {
      logger.error(error)
      socket.emit('error', error)
    }
  }
}
